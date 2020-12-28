// import ModelOptions from './interface/ModelOptions';
import Model from './_interface/Model';
import Panel from './_interface/Panel';
import Presenter from './_interface/Presenter';
import RSModel from './_model';
import RSPresenter from './_presenter';
import RSView from './_view';
import Slider from './_interface/Slider';
import SliderOptions from './_interface/SliderOptions';
import View from './_interface/View';

import '../styles/rslider.sass';
import RSPanel from './_panel';
import RScale from './_scale';
import Scale from './_interface/Scale';

export function create(selector: string, options: SliderOptions = {}) {
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
    addPanel() {
      // const modelOptions = this.model.config();
      const options = this.config();
      // Create panel
      const panel: Panel = new RSPanel(this.el, options);
      // Add panel as observer, notify
      this.model.addObserver(panel.update.bind(panel));
      this.model.notifyObservers();
      // Add presenter method
      panel.notifyPresenter = this.presenter.setModelValue.bind(presenter);

      return panel;
    },
    addScale() {
      const options = this.config();
      const scale: Scale = new RScale(this.el, options);

      scale.notifyPresenter = this.presenter.setModelValue.bind(presenter);

      return scale;
    },
  };

  return slider;
}
