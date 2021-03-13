import { boundMethod } from 'autobind-decorator';
import { Track } from './interfaces';
import RSubject from './RSubject';

class RSTrack extends RSubject implements Track {
  private isHorizontal: boolean;

  private UItrack: HTMLElement = document.createElement('div');

  constructor(isHorizontal: boolean) {
    super();

    this._create(isHorizontal);
  }

  public getElement(): HTMLElement {
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

  @boundMethod
  private _onMousedown(e: MouseEvent) {
    // Prevent text selection
    e.preventDefault();

    this.notifyObservers(e);
  }

  private _create(isHorizontal: boolean) {
    this.UItrack.className = 'rslider__track';

    this.toggleLayout(isHorizontal);

    this.UItrack.addEventListener('mousedown', this._onMousedown);

    return this.UItrack;
  }
}

export default RSTrack;
