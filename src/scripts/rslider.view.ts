export default class View {
  container: HTMLElement;

  constructor(selector: string) {
    this.container = document.querySelector(selector);
  }

  // container: HTMLElement;

  // track: HTMLElement;

  // handler: HTMLElement;

  // TODO: Add options: vertical, scale, popup hint

  render(selector: string) {
    if (this.container !== null) {
      this.container.innerHTML = `
        <div class='rslider rslider--layout_horizontal'>
          <div class='rslider__track'></div>
          <div class='rslider__handler'></div>
        </div>
      `;
    } else {
      throw new Error(`There is no element matching selector "${selector}"...`);
    }
  }
}
