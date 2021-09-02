/* Test file for movieConstructor file */

const Movies = require("../filteringAlgorithm/middleware/movieConstructor");

let moviesTest = {
  ORIGINAL_TITLE: "Monsters, Inc.",
  IMDB_TITLE_ID: "tt0198781",
  YEAR: "2001",
  DURATION: "92",
  AVG_VOTE: "8.0",
  GENRE: "Animation, Adventure, Comedy",
  ACTORS: " John Goodman , Billy Crystal , Mary Gibbs",
  KEY_WORDS: "monster,infant,energy supply",
  DIRECTOR: "Pete Docter, David Silverman",
  COUNTRY: "",
  DESCRIPTION: "",
  POSTER: "https://image.tmdb.org/t/p/w500/sgheSKxZkttIe8ONsf",
};

let moviesClassTest = new Movies(moviesTest);

test("test basic entries to see if a movie as loaded correct", () => {
  expect(moviesClassTest.movieTitle).toEqual(["Monsters, Inc."]);
  expect(moviesClassTest.ImdbId).toEqual("tt0198781");
  expect(moviesClassTest.year).toEqual("2001");
  expect(moviesClassTest.avgVotesImdb).toEqual("8.0");
  expect(moviesClassTest.genre).toEqual(["Animation", "Adventure", "Comedy"]);
  expect(moviesClassTest.actors).toEqual([
    "John Goodman",
    "Billy Crystal",
    "Mary Gibbs",
  ]);
  expect(moviesClassTest.keyWords).toEqual([
    "monster",
    "infant",
    "energy supply",
  ]);
  expect(moviesClassTest.director).toEqual(["Pete Docter", "David Silverman"]);
  expect(moviesClassTest.poster).toEqual(
    "https://image.tmdb.org/t/p/w500/sgheSKxZkttIe8ONsf"
  );
});

test("test if stringToArrayWithNoSplit works properly", () => {
  expect(moviesClassTest.movieTitle).toEqual(["Monsters, Inc."]);
  expect(moviesClassTest.movieTitle).not.toEqual(["Monsters", "Inc."]);
});

test("test if removeWhitespace works properly", () => {
  expect(moviesClassTest.genre).toEqual(["Animation", "Adventure", "Comedy"]);
  expect(moviesClassTest.genre).not.toEqual("Animation, Adventure, Comedy");
  expect(moviesClassTest.genre).not.toEqual([
    " John Goodman , Billy Crystal , Mary Gibbs",
  ]);
});
