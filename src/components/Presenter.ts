import { TModel, TPresenter, TView } from './types';

class Presenter implements TPresenter {
  private model: TModel;

  private view: TView;

  constructor(model: TModel, view: TView) {
    this.model = model;
    this.view = view;
  }

  public init() {
    this.view.addObserver(this.setModelValue.bind(this));

    // Add and notify observer
    this.model.addObserver(this.update.bind(this));

    const modelValues = this.model.getValues();
    this.model.notifyObservers(modelValues);
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
    const conf = this.model.getConfig();
    this.view.setModelOptions(conf);
    this.view.setValues(v);
  }
}

export default Presenter;