/* Test file for constraintBasedFiltering */

const Movies = require("../filteringAlgorithm/middleware/movieConstructor");
const Constraints = require("../filteringAlgorithm/middleware/constraintsConstructor");
const {
  constraintBasedFiltering,
  parameterConstraint,
  yearConstraint,
  ratingConstraint,
} = require("../filteringAlgorithm/middleware/constraintBasedFiltering");

const movie1 = {
  ORIGINAL_TITLE: "Monsters, Inc.",
  IMDB_TITLE_ID: "tt0198781",
  YEAR: "2001",
  DURATION: "92",
  AVG_VOTE: "7.9",
  GENRE: "Animation, Adventure, Comedy",
  ACTORS: " John Goodman , Billy Crystal , Mary Gibbs",
  KEY_WORDS: "monster,infant,energy supply",
  DIRECTOR: "Pete Docter, David Silverman",
  COUNTRY: "",
  DESCRIPTION: "",
  POSTER: "",
};

const movie2 = {
  ORIGINAL_TITLE: "The Lord of the Rings",
  IMDB_TITLE_ID: "tt1111111", // fake for testing.
  YEAR: "2011", // fake for testing.
  DURATION: "178",
  AVG_VOTE: "8.8",
  GENRE: "Action, Adventure, Fantasy",
  ACTORS: "Elijah Wood, Ian McKellen, Orlando Bloom",
  KEY_WORDS: "Ring,Fellowship,War,Evil",
  DIRECTOR: "Peter Jackson",
  COUNTRY: "",
  DESCRIPTION: "",
  POSTER: "",
};

const contstraint1 = {
  ACTORS: "John Goodman",
  DIRECTOR: "David Silverman",
  GENRE: "Action",
  startYear: 2000,
  endYear: 2021,
  RATING: 4,
  constraintsTrue: 0,
};

const contstraint2 = {
  ACTORS: "",
  DIRECTOR: "",
  GENRE: "",
  startYear: 2010,
  endYear: 2021,
  RATING: 6,
  constraintsTrue: 0,
};

const contstraint3 = {
  ACTORS: "Elijah Wood, Ian McKellen",
  DIRECTOR: "Peter Jackson, Pete Docter, David Silverman",
  GENRE: "Action, Drama, Fantasy, Animation",
  startYear: 2015,
  endYear: 2021,
  RATING: 7,
  constraintsTrue: 0,
};

const contstraint4 = {
  ACTORS: " Elijah Wood, Ian McKellen",
  DIRECTOR: "Peter Jackson",
  GENRE: "",
  startYear: 2000,
  endYear: 2008,
  RATING: 8,
  constraintsTrue: 0,
};

const contstraint5 = {
  ACTORS: "",
  DIRECTOR: "",
  GENRE: "",
  startYear: 0,
  endYear: 0,
  RATING: 0,
  constraintsTrue: 1,
};

let movie1Class = new Movies(movie1);
let movie2Class = new Movies(movie2);

let constraint1Class = new Constraints(contstraint1);
let constraint2Class = new Constraints(contstraint2);
let constraint3Class = new Constraints(contstraint3);
let constraint4Class = new Constraints(contstraint4);
let constraint5Class = new Constraints(contstraint5);

// Integration tests for constraintBasedFiltering.
test("test constraintBasedFiltering constraint1 object", () => {
  let movieArr = [movie1Class, movie2Class];
  expect(constraintBasedFiltering(constraint1Class, movieArr)).toEqual([]);
});

test("test constraintBasedFiltering constraint2 object", () => {
  let movieArr = [movie1Class, movie2Class];
  expect(constraintBasedFiltering(constraint2Class, movieArr)).toEqual([
    movie2Class,
  ]);
});

test("test constraintBasedFiltering constraint3 object", () => {
  let movieArr = [movie1Class, movie2Class];
  expect(constraintBasedFiltering(constraint3Class, movieArr)).toEqual([]);
});

test("test constraintBasedFiltering constraint4 object", () => {
  let movieArr = [movie1Class, movie2Class];
  expect(constraintBasedFiltering(constraint4Class, movieArr)).toEqual([]);
});

test("test constraintBasedFiltering constraint5 object", () => {
  let movieArr = [movie1Class, movie2Class];
  expect(constraintBasedFiltering(constraint5Class, movieArr)).toEqual([
    movie1Class,
    movie2Class,
  ]);
});

// Uit tests for parameterConstraint.
test("Should return true, test movieHasConstraint", () => {
  expect(parameterConstraint(movie1Class, constraint1Class, true)).toBeTruthy();
  expect(
    parameterConstraint(movie1Class, constraint1Class, false)
  ).not.toBeTruthy();
});

test("Test movie actors constraints", () => {
  expect(
    parameterConstraint(movie1Class.actors, constraint1Class.actors, false)
  ).toBeTruthy();
  expect(
    parameterConstraint(movie2Class.actors, constraint1Class.actors, false)
  ).toBeFalsy();
  expect(
    parameterConstraint(movie1Class.actors, constraint2Class.actors, false)
  ).toBeFalsy();
  expect(
    parameterConstraint(movie2Class.actors, constraint2Class.actors, false)
  ).toBeFalsy();
  expect(
    parameterConstraint(movie1Class.actors, constraint3Class.actors, false)
  ).toBeFalsy();
  expect(
    parameterConstraint(movie2Class.actors, constraint3Class.actors, false)
  ).toBeTruthy();
  expect(
    parameterConstraint(movie1Class.actors, constraint4Class.actors, false)
  ).toBeFalsy();
  expect(
    parameterConstraint(movie2Class.actors, constraint4Class.actors, false)
  ).toBeTruthy();
});

test("Test movie Genre constraints", () => {
  expect(
    parameterConstraint(movie1Class.genre, constraint1Class.genres, false)
  ).toBeFalsy();
  expect(
    parameterConstraint(movie2Class.genre, constraint1Class.genres, false)
  ).toBeTruthy();
  expect(
    parameterConstraint(movie1Class.genre, constraint2Class.genres, false)
  ).toBeFalsy();
  expect(
    parameterConstraint(movie2Class.genre, constraint2Class.genres, false)
  ).toBeFalsy();
  expect(
    parameterConstraint(movie1Class.genre, constraint3Class.genres, false)
  ).toBeTruthy();
  expect(
    parameterConstraint(movie2Class.genre, constraint3Class.genres, false)
  ).toBeTruthy();
  expect(
    parameterConstraint(movie1Class.genre, constraint4Class.genres, false)
  ).toBeFalsy();
  expect(
    parameterConstraint(movie2Class.genre, constraint4Class.genres, false)
  ).toBeFalsy();
});

test("Test movie director constraints", () => {
  expect(
    parameterConstraint(movie1Class.director, constraint1Class.directors, false)
  ).toBeTruthy();
  expect(
    parameterConstraint(movie2Class.director, constraint1Class.directors, false)
  ).toBeFalsy();
  expect(
    parameterConstraint(movie1Class.director, constraint2Class.directors, false)
  ).toBeFalsy();
  expect(
    parameterConstraint(movie2Class.director, constraint2Class.directors, false)
  ).toBeFalsy();
  expect(
    parameterConstraint(movie1Class.director, constraint3Class.directors, false)
  ).toBeTruthy();
  expect(
    parameterConstraint(movie2Class.director, constraint3Class.directors, false)
  ).toBeTruthy();
  expect(
    parameterConstraint(movie1Class.director, constraint4Class.directors, false)
  ).toBeFalsy();
  expect(
    parameterConstraint(movie2Class.director, constraint4Class.directors, false)
  ).toBeTruthy();
});

// Unit tests for yearsConstraint function.
test("Should return true, test movieHasConstraint", () => {
  expect(yearConstraint(movie1Class, constraint1Class, true)).toBeTruthy();
  expect(yearConstraint(movie1Class, constraint1Class, false)).not.toBeTruthy();
});

test("Test movie start year", () => {
  expect(yearConstraint(movie1Class, constraint1Class, false)).toBeFalsy();
  expect(yearConstraint(movie2Class, constraint1Class, false)).toBeFalsy();
  expect(yearConstraint(movie1Class, constraint2Class, false)).toBeTruthy();
  expect(yearConstraint(movie2Class, constraint2Class, false)).toBeFalsy();
  expect(yearConstraint(movie1Class, constraint3Class, false)).toBeTruthy();
  expect(yearConstraint(movie2Class, constraint3Class, false)).toBeTruthy();
});

test("Test movie end year", () => {
  expect(yearConstraint(movie1Class, constraint4Class, false)).toBeFalsy();
  expect(yearConstraint(movie2Class, constraint4Class, false)).toBeTruthy();
});

//unit tests for ratingConstraint.
test("Should return true, test movieHasConstraint", () => {
  expect(ratingConstraint(movie1Class, constraint1Class, true)).toBeTruthy();
  expect(
    ratingConstraint(movie1Class, constraint1Class, false)
  ).not.toBeTruthy();
});

test("Should return true, rating is less than constraint", () => {
  expect(
    ratingConstraint(movie1Class, constraint2Class, false)
  ).not.toBeTruthy();
  expect(ratingConstraint(movie1Class, constraint4Class, false)).toBeTruthy();
});

test("Should return false, rating is higher than constraint", () => {
  expect(ratingConstraint(movie1Class, constraint2Class, false)).toBeFalsy();
  expect(ratingConstraint(movie2Class, constraint2Class, false)).toBeFalsy();
  expect(ratingConstraint(movie1Class, constraint3Class, false)).toBeFalsy();
  expect(ratingConstraint(movie2Class, constraint3Class, false)).toBeFalsy();
  expect(
    ratingConstraint(movie1Class, constraint4Class, false)
  ).not.toBeFalsy();
  expect(ratingConstraint(movie2Class, constraint4Class, false)).toBeFalsy();
});

// Unit test constrain constructor
test("test constraint constructor, gets data correctly.", () => {
  expect(constraint3Class.actors).toEqual(["Elijah Wood", "Ian McKellen"]);
  expect(constraint3Class.directors).toEqual([
    "Peter Jackson",
    "Pete Docter",
    "David Silverman",
  ]);
  expect(constraint3Class.genres).toEqual([
    "Action",
    "Drama",
    "Fantasy",
    "Animation",
  ]);
  expect(constraint3Class.startYear).toBe(2015);
  expect(constraint3Class.endYear).toBe(2021);
  expect(constraint3Class.rating).toBe(7);
  expect(constraint3Class.constraintsTrue).toBe(0);
});
