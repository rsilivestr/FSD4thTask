// Interface import
import Slider from './interface/Slider';
import SliderOptions from './interface/SliderOptions';
// Class import
import RSModel from './rslider.model';
import RSView from './rslider.view';
import RSController from './rslider.controller';
import RSPanel from './rslider.panel';
import RScale from './rslider.scale';
// Styles import
import '../styles/rslider.sass';

export function create(selector: string, options: SliderOptions = {}) {
  const container: HTMLElement = document.querySelector(selector);

  const model = new RSModel(options);

  const view = new RSView(model, container, options);

  const controller = new RSController(model, view);

  const slider: Slider = {
    container,
    model,
    view,
    controller,
    getOptions() {
      const modelOptions = this.model.getOptions();
      const viewOptions = this.view.getOptions();

      return { ...modelOptions, ...viewOptions };
    },
    setOptions(o = {}) {
      const modelOptions = this.model.setOptions(o);
      const viewOptions = this.view.setOptions(o);

      return { ...modelOptions, ...viewOptions };
    },
    getValue(index = 0) {
      return this.model.getValues()[index];
    },
    getValues() {
      return this.model.getValues();
    },
    setValue(value, index = 0) {
      return this.model.updateValue(index, value);
    },
    addPanel() {
      return new RSPanel(this);
    },
    addScale() {
      return new RScale(this);
    },
  };

  return slider;
}
