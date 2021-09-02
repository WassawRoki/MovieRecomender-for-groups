const { parameterPush } = require("./middleware/parameterPush");
const { contentBasedFiltering } = require("./middleware/contentBasedFiltering");
const { borda } = require("./middleware/bordaScore");
const {
  createUserArray,
  createConstraints,
  createMovieArray,
  removeChoosenMovies,
  writeToSessionDB,
} = require("./middleware/createDataFunctions");

const {
  sessionLayoutCreator,
  populateMovieDB,
} = require("./middleware/databaseFilteringAlgorithm.js");
const {
  constraintBasedFiltering,
} = require("./middleware/constraintBasedFiltering");
const mysql = require("mysql");

// Function to call to run the algorithm.
async function runAlgorithm(sessionId) {
  let movieArr = [];
  let userArr = [];
  let constraints = await createConstraints(sessionId);

  userArr = await createUserArray(sessionId);
  await sessionLayoutCreator(sessionId, mysql);
  movieArr = await createMovieArray(); // Promise
  parameterPush(movieArr, userArr);
  // Movies has to be removed from object after parameters are pushed
  movieArr = constraintBasedFiltering(constraints, movieArr);
  movieArr = removeChoosenMovies(movieArr, userArr, false);
  contentBasedFiltering(movieArr, userArr);
  borda(movieArr, userArr);
  await writeToSessionDB(sessionId, mysql, movieArr);
  return movieArr;
}

exports.runAlgorithm = runAlgorithm;
