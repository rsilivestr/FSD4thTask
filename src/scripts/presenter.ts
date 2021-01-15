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

  // Invoked on view change (Observer)
  public setModelValue(index: number, value: number) {
    return this.model.setValue(index, value);
  }

  // Invoked on model change (Observer)
  public update(v: number[]): void {
    this.view.setValues(v);
  }

  private _init(): void {
    this.view.addObserver(this.setModelValue.bind(this));

    // Add and notify observer
    this.model.addObserver(this.update.bind(this));

    // ? TODO add public model notify method to call withous params

    const modelValues = this.model.getValues();
    this.model.notifyObservers(modelValues);
  }
}
