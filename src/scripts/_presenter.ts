import Model from './_interface/Model';
import Presenter from './_interface/Presenter';
import View from './_interface/View';

export default class RSPresenter implements Presenter {
  model: Model;
  view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;

    this._init();
  }

  private _init(): void {
    this.model.presenter = this;
    this.view.presenter = this;

    // Set view options
    const modelOptions = this.model.config();
    this.view.setModelOptions(modelOptions);
    // Set view values (and coords)
    const values = this.model.getValues();
    this.view.setValues(values);
    // Render view
    this.view.render();
  }

  public update(sender: Model | View) {
    console.log(sender);
  }
}
