import Model from './_interface/Model';
import Observer from './_interface/Observer';
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

    // Render view
    this.view.render();
    // Add and notify observer
    this.model.addObserver(this.view.update.bind(this.view));
  }

  public setModelValue(index: number, value: number) {
    return this.model.setValue(index, value);
  }

  public getValues() {
    return this.model.getValues();
  }

  public addSender(s: Observer) {
    s.presenter = this;
    // Add observer to model
    this.model.addObserver(s.update.bind(s));
    // Update added observer
    this.model.notifyObservers();
  }

  // public update(v: any): any {}
}
