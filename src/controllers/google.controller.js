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
    showplayer = [rowData[0]];
    players = [];
    critical = [];

    //Delete undefineds
    rowData.forEach((e) => {
        if (e.MarcaTemporal){
            players.push(e);
        }
    });

    //Create Array unique players
    players.forEach((e) => {
        let flag = false;

        showplayer.forEach((element) => {
            if (element.Numero === e.Numero) {
                flag = true;
            }
        });

        !flag ? showplayer.push(e) : null;

        //Condicion dos ultimas semanas
        //let currentDate = new Date();
        const currentDate = new Date();
        if(e.Nivel_de_cansancio >= 5 && currentDate.getDate() - e.orderData < 15) {
            critical.push(e.Nombre);
        }
    });

    critical.forEach((e) => {
        console.log(e);
    })

    //Ordenar los datos por fecha

    //Add photos to player
    showplayer.forEach((e) => {
        e.photo = photoPlayers[e.Numero];
    });

    //Sort player by number
    showplayer.sort((a, b) => a.Numero - b.Numero);

    res.render('index', {showplayer});
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
        const preData = e.MarcaTemporal.split(' ')[0];

        const data = preData.split('/');

        if (data[0]) {
            data[0] = parseInt(data[0]) + 10;
        }

        e.orderData = data[2]+data[1]+data[0];
    });

    player.sort((a, b) => b.orderData - a.orderData);

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