import { boundMethod } from 'autobind-decorator';

import Subject from './Subject';
import { TTrack } from './types';

class Track extends Subject implements TTrack {
  private isHorizontal: boolean;

  private UItrack: HTMLElement = document.createElement('div');

  constructor(isHorizontal: boolean) {
    super();

    this.create(isHorizontal);
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
  private onMousedown(e: MouseEvent) {
    // Prevent text selection
    e.preventDefault();

    this.notifyObservers(e);
  }

  private create(isHorizontal: boolean) {
    this.UItrack.className = 'rslider__track';

    this.toggleLayout(isHorizontal);

    this.UItrack.addEventListener('mousedown', this.onMousedown);

    return this.UItrack;
  }
}

export default Track;
