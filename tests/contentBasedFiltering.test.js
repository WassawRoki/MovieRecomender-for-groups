/* Test file for contentBasedFiltering */

const {
  contentBasedFiltering,
  findIntersection,
  findTotalIntersection,
  calcAvgMovieScore,
  calculateTotalValue,
  intersectionScalar,
} = require("../filteringAlgorithm/middleware/contentBasedFiltering.js");
const User = require("../filteringAlgorithm/middleware/userConstructor");
const Movies = require("../filteringAlgorithm/middleware/movieConstructor");

// Because of sql movieselect, always has one element to much, which is popped.
const user1 = {
  username: "Kenneth",
  movieSelect: "tt0198781, tt0126029, test",
  isHost: 1,
};

const user2 = {
  username: "John",
  movieSelect: "tt0198781, tt1232829, test",
  isHost: 0,
};

const movie1 = {
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
  POSTER: "",
};

const movie2 = {
  ORIGINAL_TITLE: "Shrek",
  IMDB_TITLE_ID: "tt0126029",
  YEAR: "2001",
  DURATION: "90",
  AVG_VOTE: "7.8",
  GENRE: "Animation, Adventure, Comedy, Romance",
  ACTORS: "Mike Myers, Eddie Murphy, Cameron Diaz",
  KEY_WORDS: "magic,liberation,lordship,castle,robin hood",
  DIRECTOR: "Andrew Adamson, Vicky Jenson",
  COUNTRY: "",
  DESCRIPTION: "",
  POSTER: "",
};

const movie3 = {
  ORIGINAL_TITLE: "21 Jump Street",
  IMDB_TITLE_ID: "tt1232829",
  YEAR: "2012",
  DURATION: "109",
  AVG_VOTE: "7.2",
  GENRE: "Action, Comedy, Crime",
  ACTORS: "Jonah Hill, Channing Tatum, Brie Larson, Dave",
  KEY_WORDS: "friendship,high school,parody,crude humor",
  DIRECTOR: "Phil Lord, Christopher Miller",
  COUNTRY: "",
  DESCRIPTION: "",
  POSTER: "",
};

let user1Class = new User(user1);
let user2Class = new User(user2);

let movie1Class = new Movies(movie1);
let movie2Class = new Movies(movie2);
let movie3Class = new Movies(movie3);

user1Class.genre = ["Animation", "Adventure", "Comedy", "Romance"];
user1Class.actors = [
  "John Goodman",
  "Billy Crystal",
  "Mary Gibbs",
  "Mike Myers",
  "Eddie Murphy",
  "Cameron Diaz",
];
user1Class.keyWords = [
  "monster",
  "infant",
  "energy supply",
  "magic",
  "liberation",
  "lordship",
  "castle",
  "robin hood",
];
user1Class.movieScore = [0.2, 0.5, 1.0];

user2Class.genre = ["Animation", "Adventure", "Comedy", "Action", "Crime"];
user2Class.actors = [
  "John Goodman",
  "Billy Crystal",
  "Mary Gibbs",
  "Jonah Hill",
  "Channing Tatum",
  "Brie Larson",
  "Dave",
];
user2Class.keyWords = [
  "monster",
  "infant",
  "energy supply",
  "friendship",
  "high school",
  "parody",
  "crude humor",
];
user2Class.movieScore = [0.4, 0.5, 0.7];

let userArr = [user1Class, user2Class];
let movieArr = [movie1Class, movie2Class, movie3Class];

// contentBasedFiltering tests
contentBasedFiltering(movieArr, userArr);

test("Should return 0.3, movie 1", () => {
  expect(movieArr[0].usersAvgScore).toBeCloseTo(0.3, 5);
});

test("Should return 0.5, movie 2", () => {
  expect(movieArr[1].usersAvgScore).toBeCloseTo(0.5, 5);
});

test("Should return 0.85, movie 3", () => {
  expect(movieArr[2].usersAvgScore).toBeCloseTo(0.85, 5);
});

// intersectionScalar tests.
test("should return 4", () => {
  expect(intersectionScalar(9, 9)).toBe(4);
  expect(intersectionScalar(6, 6)).toBe(4);
  expect(intersectionScalar(8, 5)).not.toBe(4);
  expect(intersectionScalar(5, 8)).not.toBe(4);
});

test("should return 1", () => {
  expect(intersectionScalar(2, 7)).toBe(1);
  expect(intersectionScalar(5, 8)).toBe(1);
  expect(intersectionScalar(2, 6)).not.toBe(1);
});

test("should return 3", () => {
  expect(intersectionScalar(9, 5)).toBe(3);
  expect(intersectionScalar(9, 6)).not.toBe(3);
  expect(intersectionScalar(5, 6)).toBe(3);
});

// findTotalIntersection tests
test("Should return the scalled intersection", () => {
  expect(findTotalIntersection(movie1Class, user1Class)).toBe(31.5);
  expect(findTotalIntersection(movie2Class, user1Class)).toBe(40.5);
  expect(findTotalIntersection(movie3Class, user1Class)).toBe(6);
  expect(findTotalIntersection(movie1Class, user2Class)).toBe(31.5);
  expect(findTotalIntersection(movie2Class, user2Class)).toBe(18);
  expect(findTotalIntersection(movie3Class, user2Class)).toBe(36);
});

// findIntersection tests
test("Should return size of intersection between two arrays", () => {
  expect(findIntersection([1, 2, 3, 4, 5, 6, 7], [2, 4, 6, 8, 10])).toEqual(3);
  expect(findIntersection([1, 25, 1, 52, 3], [])).toEqual(0);
  expect(findIntersection([], [])).toEqual(0);
  expect(
    findIntersection([1, 2, 1, 2, 5, 2, 5], [1, 1, 2, 2, 3, 4, 5, 5])
  ).toEqual(3);
  expect(
    findIntersection(["action", "comedy", "", "adventure"], ["", "action"])
  ).toEqual(2);
  expect(
    findIntersection(["action", "comedy", "", "adventure"], ["", "aCtion"])
  ).not.toEqual(2);
});

// calculateTotalValue tests
test("Test calculateTotalValue returns the total numerical value", () => {
  expect(calculateTotalValue(movie1Class, user1Class)).toBe(27);
  expect(calculateTotalValue(movie2Class, user1Class)).toBe(30);
  expect(calculateTotalValue(movie3Class, user1Class)).toBe(29);
  expect(calculateTotalValue(movie1Class, user2Class)).toBe(28);
  expect(calculateTotalValue(movie2Class, user2Class)).toBe(31);
  expect(calculateTotalValue(movie3Class, user2Class)).toBe(30);
});

// calcAvgMovieScore tests
test("Should return average movie score for a movie based on all users", () => {
  expect(calcAvgMovieScore(userArr, 0)).toBeCloseTo(0.3, 5);
  expect(calcAvgMovieScore(userArr, 1)).toBeCloseTo(0.5, 5);
  expect(calcAvgMovieScore(userArr, 2)).toBeCloseTo(0.85, 5);
});
