const database = require("./database");

//creates the html-table for movie recommendations
async function movieRecommendationsHtmlConstructor(html, sessionId) {
  return new Promise(async (resolve) => {
    let result = await database.SQLMovieCollector(sessionId);
    let filledhtml = fillRecommendedMovieTable(result);
    let searchstring = `<table class="table">`;
    let newHTML = addToString(html, searchstring, filledhtml);
    resolve(newHTML);
  });
}

function fillRecommendedMovieTable(result) {
  let html = "";
  html += `<tr><td colspan="3" class="horizontalLine"></tr>`;

  for (let i = 0; i < result.length; i++) {
    html += ` <tr><td colspan="3" class="emptySpace"></tr>`;
    html += `<tr><th rowspan="3" style="width:10px"> <img class="poster" src="${
      result[i].POSTER
    }"> </img> </th><th class="movieTitle" colspan="2"> ${
      i + 1 + ". " + result[i].ORIGINAL_TITLE
    } </th></tr>`;
    html += `<tr><td style="width:10px"> <a href="https://www.imdb.com/title/${result[i].IMDB_TITLE_ID}" target="_blank"> <img class="imdb" src="/Pictures/IMDB.png"> </img> </a> </td> <td class="score">Score: ${result[i].IMDB_SCORE}</td></tr>`;
    html += ` <tr><td colspan="2" class=movieDescription>${result[i].DESCRIPTION}</td></tr>`;
    html += ` <tr><td colspan="3" class="horizontalLine"></tr>`;
    html += `<tr><td colspan="3" class="emptySpace"></tr>`;
  }
  return html;
}

//inputs inputstring to the end of searchstring in originalstring
function addToString(originalString, searchString, inputString) {
  let index = originalString.search(searchString) + searchString.length;
  let left = originalString.substring(0, index);
  let right = originalString.substring(index + 1, originalString.length);
  return left + inputString + right;
}

module.exports = {
  movieRecommendationsHtmlConstructor,
};
