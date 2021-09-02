/* Test file for userConstructor */

const User = require("../filteringAlgorithm/middleware/userConstructor.js");

// Because of sql movieselect, always has one element to much, which is popped.
const user = {
  username: "Kenneth",
  movieSelect: "tt0120755, tt0120804 , tt0120912, tt0145487, test",
  isHost: 1,
};

let userClass = new User(user);

userClass.genre.push("Action", "Romance");
userClass.actors.push("John Johnson,Tom Cruise");
userClass.keyWords.push("Action", "Friendship");
userClass.movieScore.push(1, 1.2131);
userClass.bordaScore.push(4, 213.21);

userClass.movieConstraints.push("tt0120804", "tt0120912");
userClass.genreConstraints.push("Action", "Romance");
userClass.actorConstraints.push("John Goodman", "Billy Crystal");
userClass.keyWordConstraints.push("monster", "energy supply");

test("Should get the values from the user object.", () => {
  expect(userClass.name).toEqual("Kenneth");
  expect(userClass.movieID).toEqual([
    "tt0120755",
    "tt0120804",
    "tt0120912",
    "tt0145487",
  ]);
  expect(userClass.movieID).not.toEqual([
    "tt0120755",
    " tt0120804 ",
    " tt0120912",
    " tt0145487",
  ]);
  expect(userClass.isHost).toBe(1);
  expect(userClass.isHost).not.toBe(0);
});

test("Pushing to empty User arrays", () => {
  expect(userClass.genre).toEqual(["Action", "Romance"]);
  expect(userClass.actors).toEqual(["John Johnson,Tom Cruise"]);
  expect(userClass.keyWords).toEqual(["Action", "Friendship"]);
});

test("Pushing average score and borda score to empty array", () => {
  expect(userClass.movieScore).toEqual([1, 1.2131]);
  expect(userClass.bordaScore).toEqual([4, 213.21]);
});

test("Pushing to empty constraints arrays", () => {
  expect(userClass.movieConstraints).toEqual(["tt0120804", "tt0120912"]);
  expect(userClass.genreConstraints).toEqual(["Action", "Romance"]);
  expect(userClass.actorConstraints).toEqual(["John Goodman", "Billy Crystal"]);
  expect(userClass.keyWordConstraints).toEqual(["monster", "energy supply"]);
});

test("Pushing to empty User arrays", () => {
  userClass.genre.push("Adventure", "Comedy");
  userClass.actors.push("John Goodman", "Billy Crystal");
  userClass.keyWords.push("monster", "energy supply");
  expect(userClass.genre).toEqual(["Action", "Romance", "Adventure", "Comedy"]);
  expect(userClass.actors).toEqual([
    "John Johnson,Tom Cruise",
    "John Goodman",
    "Billy Crystal",
  ]);
  expect(userClass.keyWords).toEqual([
    "Action",
    "Friendship",
    "monster",
    "energy supply",
  ]);
});

test("Pushing average score and borda score to nonempty array", () => {
  userClass.movieScore.push(2.133, 5.123);
  userClass.bordaScore.push(655.1, 53.221);
  expect(userClass.movieScore).toEqual([1, 1.2131, 2.133, 5.123]);
  expect(userClass.bordaScore).toEqual([4, 213.21, 655.1, 53.221]);
});
