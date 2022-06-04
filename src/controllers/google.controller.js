let googleSheet = require('../spreadsheet');

const obtenerDatos = async (req, res) => {
    rowData = await googleSheet.accessGoogleSheet();
    showplayer = [];
    noDaysOff = [rowData[0].Fecha];
    daysTrained = 0;

    rowData.forEach((e) => {
        if (e.Fecha){
            showplayer.push(e);

            const data = e.Fecha.split('/');
            data[0] = parseInt(data[0]) + 10;
            e.orderData = data[2]+data[1]+data[0];
        }
    });

    rowData.forEach((eRD) => {
        noDaysOff.forEach((eDO) => {
            if (eRD.Fecha != eDO) {
                noDaysOff.push(eRD);
            }
        });
    });
    daysTrained = noDaysOff.length;

    rowData.sort((a, b) => b.orderData - a.orderData);
    showplayer.sort((a, b) => a.Numero - b.Numero);

    res.render('index', {rowData, showplayer, daysTrained});
}

const showOne = async (req, res) => {
    let player = [];
    rowData = await googleSheet.accessGoogleSheet();
    rowData.forEach(value => {
        if (value.Numero === req.params.id) {
            player.push(value);
        }
    });

    player.forEach((e) => {
        const data = e.Fecha.split('/');

        if (data[0]) {
            data[0] = parseInt(data[0]) + 10;
        }

        e.orderData = data[2]+data[1]+data[0];
    });

    player.sort((a, b) => b.orderData - a.orderData);

    lastSixteen = player.slice(0, 16);
    
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