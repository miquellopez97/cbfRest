let googleSheet = require('../spreadsheet');

//Photo players
photoPlayers = {
    4 : 'https://s3-eu-west-1.amazonaws.com/playofffederacions/basquet/FED_FOTO/Thumbs/PER_0ace4ac21-cfc1-4347-a379-ac438f4d14fc.jpg',
    5 : 'https://s3-eu-west-1.amazonaws.com/playofffederacions/basquet/FED_FOTO/Thumbs/PER_0f23e5f32-2ca6-454d-85de-4b51838f3f5b.jpg',
    7 : 'https://s3-eu-west-1.amazonaws.com/playofffederacions/basquet/FED_FOTO/Thumbs/PER_0a367652b-1347-452e-8901-5c47df4f64bc.jpeg',
    8 : 'https://s3-eu-west-1.amazonaws.com/playofffederacions/basquet/FED_FOTO/Thumbs/PER_0b8255b1d-0af2-42c8-8ac7-b3c39cfd6c2e.jpg',
    9 : 'https://s3-eu-west-1.amazonaws.com/playofffederacions/basquet/FED_FOTO/Thumbs/PER_0c0bb3e2d-2aa1-4ff6-95cb-cf6d8847a09a.jpg',
    10 : 'https://s3-eu-west-1.amazonaws.com/playofffederacions/basquet/FED_FOTO/Thumbs/PER_05cece0da-51f9-4307-844d-858975439077.png',
    11 : 'https://s3-eu-west-1.amazonaws.com/playofffederacions/basquet/FED_FOTO/Thumbs/PER_06dec579f-b152-42b6-86f8-ad4cf83d9f64.png',
    14 : 'https://s3-eu-west-1.amazonaws.com/playofffederacions/basquet/FED_FOTO/Thumbs/PER_0df8da245-4747-489b-8832-dc1634d34156.png',
    15 : 'https://s3-eu-west-1.amazonaws.com/playofffederacions/basquet/FED_FOTO/Thumbs/PER_0227aed8a-1c0a-410a-8004-d605e23a54ae.jpg',
    18 : 'https://s3-eu-west-1.amazonaws.com/playofffederacions/basquet/FED_FOTO/Thumbs/PER_052d9b5c9-0be5-47be-b002-850258b7f185.png',
    24 : 'https://s3-eu-west-1.amazonaws.com/playofffederacions/basquet/FED_FOTO/Thumbs/PER_097f226e4-6bcf-4799-8437-3f16ec9b4333.jpg'
};

const obtenerDatos = async (req, res) => {
    rowData = await googleSheet.accessGoogleSheet();
    const currentDate = new Date();
    showplayer = [rowData[0]];
    players = [];
    critical = [];
    twoWeeks = [];

    //Clean array, convert MarcaTemporal to Date and add photo
    rowData.forEach((e) => {
        if (e.MarcaTemporal){
            //Convert MarcaTemporal to Date
            const strDate = e.MarcaTemporal.split(' ', 1);
            const dateToConvert = strDate[0].split('/');
            const dateFormat = dateToConvert[1]+'/'+dateToConvert[0]+'/'+dateToConvert[2];
            e.date = new Date(dateFormat + "Z");

            //Add photo to player
            e.photo = photoPlayers[e.Numero];

            players.push(e);
        }
    });

    players.forEach((e) => {
        //Array with unique players
        let flag = false;
        showplayer.forEach((element) => {
            if (element.Numero === e.Numero) {
                flag = true;
            }
        });
        !flag ? showplayer.push(e) : null;

        //Cansancio ultimas dos semanas
        if((currentDate.getDate() - e.date) <= 15) {
            twoWeeks.push(e);
        }
    });

    //Add critical players
    showplayer.forEach((p) => {
        p.weeks = [];
        let value = 0;

        twoWeeks.forEach((e) => {
            if (p.Numero === e.Numero) {
                p.weeks.push(e);
            }
        })

        p.weeks.forEach((e) => {
            value += parseInt(e.Nivel_de_cansancio);
        })

        p.avg = value / p.weeks.length;

        p.avg >= 5 ? critical.push(p) : null;
    });

    //Sort arrays by number
    showplayer.sort((a, b) => a.Numero - b.Numero);
    critical.sort((a, b) => a.Numero - b.Numero);

    res.render('index', {showplayer, critical});
}

const showOne = async (req, res) => {
    let player = [];
    rowData = await googleSheet.accessGoogleSheet();

    //Add all registers of player
    rowData.forEach(value => {
        if (value.Numero === req.params.id) {
            player.push(value);
        }
    });

    //Sort data by date
    player.forEach((e) => {
        const strDate = e.MarcaTemporal.split(' ', 1);
        const dateToConvert = strDate[0].split('/');
        const dateFormat = dateToConvert[1]+'/'+dateToConvert[0]+'/'+dateToConvert[2];
        e.date = new Date(dateFormat + "Z");
    });
    player.sort((a, b) => b.date - a.date);

    //Array with last 16 registers
    lastSixteen = player.slice(0, 16);

    //Add photo to player
    player[0].photo = photoPlayers[req.params.id];

    res.render('showOne', {player, lastSixteen});
}

const pintarForm = (req, res) => {
    res.render('form', {});
}

const guardarData = (req, res) => {
    googleSheet.guardarData(req.body);
    res.redirect('/');
}

module.exports = {
    obtenerDatos: obtenerDatos,
    pintarForm: pintarForm,
    guardarData: guardarData,
    showOne: showOne
}