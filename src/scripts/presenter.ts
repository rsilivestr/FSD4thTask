import Model from './interface/Model';
import Presenter from './interface/Presenter';
import View from './interface/View';

export default class RSPresenter implements Presenter {
  private model: Model;

  private view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;

    this._init();
  }

  public getValues() {
    return this.model.getValues();
  }

  public setModelValue(index: number, value: number) {
    return this.model.setValue(index, value);
  }

  public update(v: number[]): void {
    this.view.setValues(v);

    this.view.update();
  }

  private _init(): void {
    this.view.addObserver(this.setModelValue.bind(this));

    // Set view options
    const modelOptions = this.model.getConfig();
    this.view.setModelOptions(modelOptions);

    // Render view
    this.view.render();
    // Add and notify observer
    this.model.addObserver(this.update.bind(this));
    this.model.notifyObservers();
    // Update view
    this.view.update();
  }
}
