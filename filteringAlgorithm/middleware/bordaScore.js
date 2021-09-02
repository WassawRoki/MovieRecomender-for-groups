/*  receives array og movies and users.
	Calculates the borda score based on the average score.
	And sorts the movie based on borda scores in descending order.
 */
function borda(movieArr, userArr) {
  for (let i = 0; i < userArr.length; i++) {
    let movieScoreCopy = [...userArr[i].movieScore];
    movieScoreCopy.sort((a, b) => b - a);
    for (let j = 0; j < userArr[i].movieScore.length; j++) {
      for (let k = 0; k < userArr[i].movieScore.length; k++) {
        if (userArr[i].movieScore[j] === movieScoreCopy[k]) {
          userArr[i].bordaScore[j] = movieScoreCopy.length - k;
        }
      }
    }
  }

  movieArr = calculateBordaScore(userArr, movieArr);

  movieArr.sort((a, b) => (a.usersBordaScore > b.usersBordaScore ? -1 : 1));
}

// Calculates BRC for every movie, averaged.
function calculateBordaScore(userArr, movieArr) {
  for (let i = 0; i < movieArr.length; i++) {
    for (let j = 0; j < userArr.length; j++) {
      movieArr[i].usersBordaScore += userArr[j].bordaScore[i];
    }
    movieArr[i].usersBordaScore /= userArr.length;
  }

  return movieArr;
}

exports.borda = borda;
exports.calculateBordaScore = calculateBordaScore;
