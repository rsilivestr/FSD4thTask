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
    this.view.notifyPresenter = this.setModelValue.bind(this);

    // Set view options
    const modelOptions = this.model.config();
    this.view.setModelOptions(modelOptions);

    // Render view
    this.view.render();
    // Add and notify observer
    this.model.addObserver(this.update.bind(this));
    this.model.notifyObservers();
    this.view.update();
  }

  public setModelValue(index: number, value: number) {
    return this.model.setValue(index, value);
  }

  public getValues() {
    return this.model.getValues();
  }

  public update(v: number[]): void {
    this.view.setValues(v);

    this.view.update();
  }
}
