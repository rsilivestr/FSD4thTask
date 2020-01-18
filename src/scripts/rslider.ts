class Rslider {
  container: object | null;

  constructor(selector: string = '.rslider') {
    this.container = document.querySelector(selector);
  }
}