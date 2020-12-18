// import ModelOptions from './interface/ModelOptions';
import Model from './_interface/Model';
import Presenter from './_interface/Presenter';
import RSModel from './_model';
import RSPresenter from './_presenter';
import RSView from './_view';
import Slider from './_interface/Slider';
import SliderOptions from './_interface/SliderOptions';
import View from './_interface/View';

import '../styles/rslider.sass';

export function create(selector: string, options: SliderOptions) {
  const el: HTMLElement = document.querySelector(selector);
  const model: Model = new RSModel(options);
  const view: View = new RSView(el, options);
  const presenter: Presenter = new RSPresenter(model, view);

  const slider: Slider = {
    el,
    model,
    view,
    presenter,
    config(o?: SliderOptions) {
      const modelOptions = o ? this.model.config(o) : this.model.config();
      const viewOptions = o ? this.view.config(o) : this.view.config();

      return { ...modelOptions, ...viewOptions };
    },
  };

  return slider;
}
