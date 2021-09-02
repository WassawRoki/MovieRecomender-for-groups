const host = "localhost";
const user = "root";
const password = "";

async function resultBuilder(html, sessionId) {
    return new Promise(async resolve => {
    let mysql = require('mysql');
    let db = mysql.createConnection({ host: `${host}`, user: `${user}`, password: `${password}`, database: sessionId});
    let result = await SQLMovieCollector(db);
    let filledhtml =  htmlFillerLoop(result);
    let searchstring =`<table class="table">`;
    let newHTML =  addToString(html, searchstring, filledhtml);
    resolve (newHTML);
});
}

function htmlFillerLoop(result){
    let filledhtml="";
    filledhtml += `<tr><td colspan="3" class="horizontalLine"></tr>`;
    
    for (let i = 0; i < result.length; i++) {
        filledhtml += ` <tr><td colspan="3" class="emptySpace"></tr>`;
        filledhtml += `<tr><th rowspan="3" style="width:10px"> <img class="poster" src="${result[i].POSTER}"> </img> </th><th class="movieTitle" colspan="2"> ${(i+1)+ ". "+ result[i].ORIGINAL_TITLE} </th></tr>`;
        filledhtml += `<tr><td style="width:10px"> <a href="https://www.imdb.com/title/${result[i].IMDB_TITLE_ID}" target="_blank"> <img class="imdb" src="/Pictures/IMDB.png"> </img> </a> </td> <td class="score">Score: ${result[i].IMDB_SCORE}</td></tr>`;
        filledhtml += ` <tr><td colspan="2" class=movieDescription>${result[i].DESCRIPTION}</td></tr>`;
        filledhtml += ` <tr><td colspan="3" class="horizontalLine"></tr>`;
        filledhtml += `<tr><td colspan="3" class="emptySpace"></tr>`;
         
    }; 
    return filledhtml;
};

async function SQLMovieCollector(db) {
    const response = await new Promise(async resolve => {
        let query = db.query(
            "SELECT * FROM `movies` WHERE `IMDB_TITLE_ID` IS NOT NULL", function (err, result) {
                if (err) throw err;
                resolve(result);
            });
    });
    db.end();
    return response;
};



function addToString(originalString, searchString, inputString) {
    let index = originalString.search(searchString) + searchString.length;
    let left = originalString.substring(0, index);
    let right = originalString.substring(index + 1, originalString.length);
    return left + inputString + right
};

module.exports = {
    resultBuilder
}