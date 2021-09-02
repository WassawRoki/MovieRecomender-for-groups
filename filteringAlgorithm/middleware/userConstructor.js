class User {
  constructor(users) {
    this.name = users.username;
    //this.id = this.stringToArray(users.Film);
    //this.sessionId = sessionId;
    this.movieID = this.arrPop(this.removeWhitespace(users.movieSelect));
    this.isHost = users.isHost;
    this.includeSelectedMovies = users.includeSelectedMovies;
    this.genre = [];
    this.actors = [];
    this.keyWords = [];
    this.AvgImdbScore = 0;
    this.movieScore = [];
    this.bordaScore = [];

    // Constraints.
    this.movieConstraints = [];
    this.genreConstraints = [];
    this.actorConstraints = [];
    this.keyWordConstraints = [];
  }

  removeWhitespace(string) {
    let array = this.stringToArray(string);
    for (let i = 0; i < array.length; i++) {
      array[i] = array[i].trim();
    }
    return array;
  }

  //Receives a string and returns an array, seperates by ','.
  stringToArray(string) {
    return string.split(',');
  }

  arrPop(arr) {
    arr.pop();
    return arr;
  }
}

module.exports = User;
