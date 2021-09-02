class Constraints {
  constructor(constraints) {
    this.actors = this.removeWhitespace(constraints.ACTORS);
    this.directors = this.removeWhitespace(constraints.DIRECTOR);
    this.genres = this.removeWhitespace(constraints.GENRE);
    this.startYear = constraints.startYear;
    this.endYear = constraints.endYear;
    this.rating = constraints.RATING;
    this.constraintsTrue = constraints.constraintsTrue;
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
}

module.exports = Constraints;
