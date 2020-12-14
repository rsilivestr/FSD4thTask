import Presenter from './_interface/Presenter';
import View from './_interface/View';
import ViewOptions from './_interface/ViewOptions';
import SliderOptions from './_interface/SliderOptions';
import ModelOptions from './_interface/ModelOptions';

export default class RSView implements View {
  public el: HTMLElement;
  public options: ViewOptions = {};
  public modelOptions: ModelOptions;
  public presenter: Presenter;

  constructor(el: HTMLElement, o: SliderOptions) {
    // Initialize root element
    this.el = el;
    // Initialize options
    this._configure(o);
  }

  private _configure(o: ViewOptions) {
    const { isHorizontal, handlerRadius, tooltip } = o;

    if (typeof isHorizontal === 'boolean') {
      // Set value
      this.options.isHorizontal = isHorizontal;
    } else if (this.options.isHorizontal === undefined) {
      // Default value
      this.options.isHorizontal = true;
    }

    if (typeof handlerRadius === 'number' && !isNaN(handlerRadius)) {
      // Set value
      this.options.handlerRadius = handlerRadius;
    } else if (this.options.handlerRadius === undefined) {
      // Default value
      this.options.handlerRadius = 8;
    }

    if (typeof tooltip === 'boolean') {
      // Set value
      this.options.tooltip = tooltip;
    } else if (this.options.tooltip === undefined) {
      // Default value
      this.options.tooltip = true;
    }

    return this.options;
  }

  public config(o?: ViewOptions) {
    if (o) return this._configure(o);

    return this.options;
  }

  public setModelOptions(o: ModelOptions) {
    this.modelOptions = o;

    return this.modelOptions;
  }

  notify() {
    this.presenter.update(this);
  }
}
