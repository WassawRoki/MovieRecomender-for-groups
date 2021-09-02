/* Receives movie parameter to check for constraints
    If constraints from user is found return true, else return false.
*/
const propertiesMovie = ['director', 'genre', 'actors'];
const propertiesConstraint = ['directors', 'genres', 'actors'];
// Keeps track of, if movie contains selected constraints
// Removes movie from array of objects if true
function constraintBasedFiltering(constraints, movieArr) {
  let movieHasConstraint = false;
  if (constraints.constraintsTrue !== 1) {
    for (let i = 0; i < movieArr.length; i++) {
      movieHasConstraint = false;
      for (let k = 0; k < 3; k++) {
        movieHasConstraint = parameterConstraint(
          movieArr[i][propertiesMovie[k]],
          constraints[propertiesConstraint[k]],
          movieHasConstraint
        );
      }
      movieHasConstraint = yearConstraint(
        movieArr[i],
        constraints,
        movieHasConstraint
      );
      movieHasConstraint = ratingConstraint(
        movieArr[i],
        constraints,
        movieHasConstraint
      );

      if (movieHasConstraint === true) {
        movieArr.splice(i, 1);
        i--;
      }
    }
  }
  return movieArr;
}

function parameterConstraint(
  movieParameter,
  constraintObject,
  movieHasConstraint
) {
  if (movieHasConstraint) {
    return true;
  }
  for (let i = 0; i < movieParameter.length; i++) {
    for (let j = 0; j < constraintObject.length; j++) {
      if (movieParameter[i] === constraintObject[j]) {
        return true;
      }
    }
  }
  return false;
}

function yearConstraint(movie, constraint, movieHasConstraint) {
  if (movieHasConstraint) {
    return true;
  }
  if (
    parseInt(movie.year) < constraint.startYear ||
    parseInt(movie.year) > constraint.endYear
  ) {
    return true;
  }
  return false;
}

function ratingConstraint(movie, constraint, movieHasConstraint) {
  if (movieHasConstraint) {
    return true;
  }
  if (parseFloat(movie.avgVotesImdb) < constraint.rating) {
    return true;
  }
  return false;
}

exports.parameterConstraint = parameterConstraint;
exports.constraintBasedFiltering = constraintBasedFiltering;
exports.yearConstraint = yearConstraint;
exports.ratingConstraint = ratingConstraint;
