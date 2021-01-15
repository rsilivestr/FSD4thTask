import RSubject, { Subject } from './RSubject';

export interface Track extends Subject {
  getElement: () => HTMLDivElement;
  getRect: () => any;
  toggleLayout: (isHorizontal: boolean) => void;
}

export default class RSTrack extends RSubject implements Track {
  private isHorizontal: boolean;
  private UItrack: HTMLDivElement = document.createElement('div');

  constructor(isHorizontal: boolean) {
    super();

    this._create(isHorizontal);
  }

  public getElement(): HTMLDivElement {
    return this.UItrack;
  }

  public getRect() {
    const rect = this.UItrack.getBoundingClientRect();

    return {
      trackLength: this.isHorizontal ? rect.right - rect.left : rect.bottom - rect.top,
      trackMin: this.isHorizontal ? rect.left : rect.bottom,
      trackMax: this.isHorizontal ? rect.right : rect.top,
    };
  }

  public toggleLayout(isHorizontal: boolean) {
    this.isHorizontal = isHorizontal;
  }

  private _onMousedown(e: MouseEvent) {
    // Prevent text selection
    e.preventDefault();

    this.notifyObservers(e);
  }

  private _create(isHorizontal: boolean) {
    this.UItrack.className = 'rslider__track';

    this.toggleLayout(isHorizontal);

    this.UItrack.addEventListener('mousedown', (e) => this._onMousedown(e));

    return this.UItrack;
  }
}
