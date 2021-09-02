// Classes
const Movie = require('./movieConstructor');
const User = require('./userConstructor');
const Constraints = require('./constraintsConstructor');

// Modules
const {
  getAllMovieData,
  getAllUsersData,
  getAllConstraints,
  populateMovieDB,
} = require('./databaseFilteringAlgorithm');

// Creates user objects
async function createUserArray(sessionId) {
  let userArrRawDBData = await getAllUsersData(sessionId);
  let userArr = [];
  for (let i = 0; i < userArrRawDBData.length; i++) {
    userArr[i] = new User(userArrRawDBData[i]);
  }
  return userArr;
}

async function createConstraints(sessionId) {
  let constraintsRaw = await getAllConstraints(sessionId);
  let constraints = [];
  constraints = new Constraints(constraintsRaw[0]);
  return constraints;
}

// Receives constraints selected by the users.
// Returns array of movies with constraint movies removed.
async function createMovieArray() {
  let movieArr = [];
  let movieArrReal = await getAllMovieData();
  let moviesInArray = 0;

  for (let i = 0; i < movieArrReal.length; i++) {
    movieArr[i] = new Movie(movieArrReal[i]);
  }

  return movieArr;
}

// Removes the possibillity of recomending an already choosen movie
function removeChoosenMovies(movieArr, userArr) {
  let imdbId = [];
  let savedId = [];
  // If user wants chosen movie its pushed to saveId
  for (let i = 0; i < userArr.length; i++) {
    if (userArr[i].includeSelectedMovies == 1) {
      savedId.push(userArr[i].movieID);
    }
  }
  // If user wants chosen movie removed its pushed to imdbId
  for (let i = 0; i < userArr.length; i++) {
    if (userArr[i].includeSelectedMovies == 0) {
      imdbId.push(userArr[i].movieID);
    }
  }
  // If theres a collision between saved and removed id's, we keep the movie
  for(let i =  0; i < savedId.length; i++){
    for (let j = 0; j < imdbId.length; j++) {
      for (let x = 0; x < imdbId[j].length; x++) {
        if(savedId[i].includes(imdbId[j][x])){
          imdbId[j].splice(x, 1);
        }
      }
    }
  }
  // Removes movies from movieArr, not in savedId
  for (let i = 0; i < movieArr.length; i++) {
    for (let j = 0; j < imdbId.length; j++) {
      for (let x = 0; x < imdbId[j].length; x++) {
        if (movieArr[i].ImdbId === imdbId[j][x]) {
          movieArr.splice(i, 1);
          i--;
        }
      }
    }
  }
  return movieArr;
}

async function writeToSessionDB(sessionId, mysql, movieArr) {
  for (let i = 0; i < 10 && i < movieArr.length; i++) {
    await populateMovieDB(
      sessionId,
      mysql,
      movieArr[i].ImdbId,
      movieArr[i].movieTitle.join(),
      movieArr[i].year.toString(),
      movieArr[i].genre.join(),
      movieArr[i].country.toString(),
      movieArr[i].actors.join(),
      movieArr[i].avgVotesImdb.toString(),
      movieArr[i].usersBordaScore.toString(),
      movieArr[i].usersAvgScore.toString(),
      movieArr[i].description,
      movieArr[i].poster
    );
  }
}

exports.writeToSessionDB = writeToSessionDB;
exports.createUserArray = createUserArray;
exports.createConstraints = createConstraints;
exports.createMovieArray = createMovieArray;
exports.removeChoosenMovies = removeChoosenMovies;
