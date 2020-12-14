import ModelOptions from './interface/ModelOptions';
import Model from './_interface/Model';
import RSModel from './_model';

export function create(selector: string, options: ModelOptions) {
  const el: HTMLElement = document.querySelector(selector);
  const model: Model = new RSModel(el, options);

  return {
    model,
    getOptions() {
      return model.getOptions();
    },
    addPanel() {
      console.log('Add panel');
    },
    addScale() {
      console.log('Add scale');
    },
  };
}
