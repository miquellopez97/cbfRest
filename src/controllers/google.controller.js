let googleSheet = require('../spreadsheet');

const obtenerDatos = async (req, res) => {
    rowData = await googleSheet.accessGoogleSheet();

    rowData.forEach((e) => {
        if (e.Fecha){
            const data = e.Fecha.split('/');

        if (data[0]) {
            data[0] = parseInt(data[0]) + 10;
        }

        e.orderData = data[2]+data[1]+data[0];
        }
    });

    rowData.sort((a, b) => b.orderData - a.orderData);

    res.render('index', {rowData});
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

    res.render('showOne', {player});
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