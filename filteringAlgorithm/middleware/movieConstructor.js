class Movies {
  constructor(movie) {
    this.movieTitle = this.stringToArrayWithNoSplit(movie.ORIGINAL_TITLE);
    this.ImdbId = movie.IMDB_TITLE_ID;
    this.year = movie.YEAR;
    this.duration = movie.DURATION;
    this.avgVotesImdb = movie.AVG_VOTE;
    this.genre = this.removeWhitespace(movie.GENRE);
    this.actors = this.removeWhitespace(movie.ACTORS);
    this.keyWords = this.removeWhitespace(movie.KEY_WORDS);
    this.director = this.removeWhitespace(movie.DIRECTOR);
    this.country = this.stringToArray(movie.COUNTRY);
    this.description = this.formatDes(movie.DESCRIPTION);
    this.poster = movie.POSTER;
    this.usersAvgScore = 0;
    this.usersBordaScore = 0;
  }

  //Receives a string and returns an array, seperates by ','.
  formatDes(string) {
    let newString = string.replace(/["]+/g, '""');
    return newString;
  }

  stringToArray(string) {
    return string.split(",");
  }

  removeWhitespace(string) {
    let array = this.stringToArray(string);
    for (let i = 0; i < array.length; i++) {
      array[i] = array[i].trim();
    }
    return array;
  }

  stringToArrayWithNoSplit(string) {
    let arr = [string];
    return arr;
  }
}

module.exports = Movies;
