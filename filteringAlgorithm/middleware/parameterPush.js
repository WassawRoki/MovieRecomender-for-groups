/* 	Receives array of movies and users.
	Compares user movie id's, with movie id's.
	Parses Movie paramters into user parameters as a set, to avoid duplicates
 */
function parameterPush(movieArr, userArr) {
  for (let i = 0; i < userArr.length; i++) {
    let paramCount = 0,
      movieNum = 0,
      avgScore = 0;
    for (let j = 0; j < userArr[i].movieID.length; j++) {
      let bool = false; // Used to stop inner for-loop when movie is found
      if (userArr[i].movieID != '') {
        //Skips the underlying for-loop if no movie is chosen
        for (let k = 0; k < movieArr.length && bool === false; k++) {
          if (userArr[i].movieID[j] === movieArr[k].ImdbId) {
            //Parses imdb score for selected movie as float
            avgScore += parseFloat(movieArr[k].avgVotesImdb);
            pushParams(userArr[i].genre, movieArr[k].genre);
            pushParams(userArr[i].actors, movieArr[k].actors);
            pushParams(userArr[i].keyWords, movieArr[k].keyWords);
            paramCount++;
            movieNum++;
            bool = true; //Increment to stop for-loop
          }
        }
      }
      //Divides by number of movies selected
      userArr[i].AvgImdbScore = avgScore / movieNum;
    }
    let genreSet = new Set(userArr[i].genre);
    let actorsSet = new Set(userArr[i].actors);
    let keyWordsSet = new Set(userArr[i].keyWords);
    userArr[i].genre = [...genreSet];
    userArr[i].actors = [...actorsSet];
    userArr[i].keyWords = [...keyWordsSet];
  }
}

// pushes parameters from movie array inro user array
function pushParams(userParams, movieParams) {
  for (let i = 0; i < movieParams.length; i++) {
    userParams.push(movieParams[i]);
  }
  return userParams;
}

// Expors for testing.
exports.parameterPush = parameterPush;
exports.pushParams = pushParams;

