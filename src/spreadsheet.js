const { GoogleSpreadsheet } = require('google-spreadsheet');

const credentials = require('./json/credentials.json');

const googleID = "1zzgaptdgZusVO5yEw-wTs3y_lvRzn2zQUJ6K8ESinM4";

async function accessGoogleSheet() {
    const doc = new GoogleSpreadsheet(googleID);
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rowsData = await sheet.getRows();

    return rowsData;
}

async function guardarData(pObject) {
    const doc = new GoogleSpreadsheet(googleID);
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow(pObject);
}

module.exports = {
    accessGoogleSheet: accessGoogleSheet,
    guardarData: guardarData
}