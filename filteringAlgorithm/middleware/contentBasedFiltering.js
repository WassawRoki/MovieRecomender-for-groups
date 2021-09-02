/* 	Takes in array of movies and users.
	calculates average scores for each movie.
 */
function contentBasedFiltering(movieArr, userArr) {
  for (let i = 0; i < userArr.length; i++) {
    for (let j = 0; j < movieArr.length; j++) {
      let intersection = 0,
        totalValue = 0,
        score = 0;
      intersection = findTotalIntersection(movieArr[j], userArr[i]);
      totalValue = calculateTotalValue(movieArr[j], userArr[i]);
      score = intersection / totalValue;
      userArr[i].movieScore.push(score); // Push score to user.
    }
  }
  for (let i = 0; i < movieArr.length; i++) {
    movieArr[i].usersAvgScore = calcAvgMovieScore(userArr, i);
  }
}

function intersectionScalar(movieImdbScore, userAvgImdbScore) {
  //Scales depending on average user IMDB value, for selected movies
  if (movieImdbScore >= 6 && userAvgImdbScore >= 6) {
    return 4;
  } else if (movieImdbScore < 6 && userAvgImdbScore > 6) {
    return 1;
  } else {
    //Std scalar if low avg. imdb score
    return 3;
  }
}

// Total intersection calculated with different parameters
function findTotalIntersection(movie, user) {
  let intersection = 0;
  let scalar = intersectionScalar(movie.avgVotesImdb, user.AvgImdbScore);
  // Tweek importance of parameter with a multiplyer.
  intersection += findIntersection(movie.genre, user.genre) * scalar;
  intersection += findIntersection(movie.actors, user.actors) * (0.5 * scalar);
  intersection +=
    findIntersection(movie.keyWords, user.keyWords) * (0.25 * scalar);

  return intersection * 2;
}

// Calculates intersection.
function findIntersection(movie, user) {
  let filteredArray = movie.filter((value) => user.includes(value));
  let mySet = new Set(filteredArray); // Turns it to a set to avoid duplicate
  return mySet.size;
}

// Calculates the total numerical value of all parameters.
function calculateTotalValue(movie, user) {
  let totalValue = 0;

  totalValue += movie.genre.length + user.genre.length;
  totalValue += movie.actors.length + user.actors.length;
  totalValue += movie.keyWords.length + user.keyWords.length;

  return totalValue;
}

// Calculates the average movie score.
function calcAvgMovieScore(userArr, i) {
  let movieScore = 0;
  for (let j = 0; j < userArr.length; j++) {
    movieScore += userArr[j].movieScore[i];
  }
  return movieScore / userArr.length;
}

exports.contentBasedFiltering = contentBasedFiltering;
exports.findIntersection = findIntersection;
exports.findTotalIntersection = findTotalIntersection;
exports.calcAvgMovieScore = calcAvgMovieScore;
exports.calculateTotalValue = calculateTotalValue;
exports.intersectionScalar = intersectionScalar;
