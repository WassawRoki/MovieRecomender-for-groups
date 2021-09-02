/* Test for the file parameterPush */

const {
  parameterPush,
  pushParams,
} = require("../filteringAlgorithm/middleware/parameterPush");
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

let userArray = [user1Class, user2Class, user3Class];
let movieArray = [movie1Class, movie2Class, movie3Class];

// This is supposed to change the user array, which we will test here.
parameterPush(movieArray, userArray);

// Integration tests parameterPush
test("test parameterPush for pushing of genre", () => {
  expect(userArray[0].genre).toEqual([
    "Animation",
    "Adventure",
    "Comedy",
    "Romance",
  ]);
  expect(userArray[1].genre).toEqual([
    "Animation",
    "Adventure",
    "Comedy",
    "Action",
    "Crime",
  ]);
  expect(userArray[2].genre).toEqual([
    "Animation",
    "Adventure",
    "Comedy",
    "Action",
    "Crime",
    "Romance",
  ]);
});

test("test parameterPush for pushing of actors", () => {
  expect(userArray[0].actors).toEqual([
    "John Goodman",
    "Billy Crystal",
    "Mary Gibbs",
    "Mike Myers",
    "Eddie Murphy",
    "Cameron Diaz",
  ]);
  expect(userArray[1].actors).toEqual([
    "John Goodman",
    "Billy Crystal",
    "Mary Gibbs",
    "Jonah Hill",
    "Channing Tatum",
    "Brie Larson",
    "Dave",
  ]);
  expect(userArray[2].actors).toEqual([
    "John Goodman",
    "Billy Crystal",
    "Mary Gibbs",
    "Jonah Hill",
    "Channing Tatum",
    "Brie Larson",
    "Dave",
    "Mike Myers",
    "Eddie Murphy",
    "Cameron Diaz",
  ]);
});

test("test parameterPush for pushing of keyWords", () => {
  expect(userArray[0].keyWords).toEqual([
    "monster",
    "infant",
    "energy supply",
    "magic",
    "liberation",
    "lordship",
    "castle",
    "robin hood",
  ]);
  expect(userArray[1].keyWords).toEqual([
    "monster",
    "infant",
    "energy supply",
    "male friendship",
    "high school",
    "parody",
    "crude humor",
  ]);
  expect(userArray[2].keyWords).toEqual([
    "monster",
    "infant",
    "energy supply",
    "male friendship",
    "high school",
    "parody",
    "crude humor",
    "magic",
    "liberation",
    "lordship",
    "castle",
    "robin hood",
  ]);
});

// Unit tests
test("Takes element and pushes it to array", () => {
  expect(pushParams([10, 2, 4], [5])).toEqual([10, 2, 4, 5]);
  expect(pushParams([], [5])).toEqual([5]);
  expect(pushParams(["param1", "param2"], ["param3"])).toEqual([
    "param1",
    "param2",
    "param3",
  ]);
  expect(pushParams([], ["param3"])).toEqual(["param3"]);
  expect(pushParams(["param1", "param2"], [""])).toEqual([
    "param1",
    "param2",
    "",
  ]);
});
