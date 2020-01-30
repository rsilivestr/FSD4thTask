export class View {


  renderSquare(selector: string) {
    const square = document.createElement('div');
    square.className = 'square';
    document.querySelector(selector)?.appendChild(square);
  }
}