/* Test file for borda score. */

const {
  calculateBordaScore,
  borda,
} = require("../filteringAlgorithm/middleware/bordaScore");
const User = require("../filteringAlgorithm/middleware/userConstructor");
const Movies = require("../filteringAlgorithm/middleware/movieConstructor");

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

const user3 = {
  username: "Karen",
  movieSelect: "tt0198781, tt1232829, tt0126029, test",
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
  KEY_WORDS: "male friendship,high school,parody,crude humor",
  DIRECTOR: "Phil Lord, Christopher Miller",
  COUNTRY: "",
  DESCRIPTION: "",
  POSTER: "",
};

let user1Class = new User(user1);
let user2Class = new User(user2);
let user3Class = new User(user3);

let movie1Class = new Movies(movie1);
let movie2Class = new Movies(movie2);
let movie3Class = new Movies(movie3);

user1Class.movieScore = [10, 2, 3];
user2Class.movieScore = [10, 2, 1];
user3Class.movieScore = [10, 2, 5];

let userArray = [user1Class, user2Class, user3Class];
let movieArray = [movie1Class, movie2Class, movie3Class];

borda(movieArray, userArray);

// Integration tests for borda score.
test("test usersBordaScore on movie 1", () => {
  expect(movieArray[0].usersBordaScore).toBe(3);
});

test("test usersBordaScore on movie 2", () => {
  expect(movieArray[1].usersBordaScore).toBeCloseTo(1.66667, 5);
});

test("test usersBordaScore on movie 3", () => {
  expect(movieArray[2].usersBordaScore).toBeCloseTo(1.33333, 5);
});

test("test BordaScore for the user object on movie 1", () => {
  expect(userArray[0].bordaScore).toEqual([3, 1, 2]);
});

test("test BordaScore for the user object on movie 2", () => {
  expect(userArray[1].bordaScore).toEqual([3, 2, 1]);
});

test("test BordaScore for the user object on movie 3", () => {
  expect(userArray[2].bordaScore).toEqual([3, 1, 2]);
});
