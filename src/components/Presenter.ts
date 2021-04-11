import { boundMethod } from 'autobind-decorator';
import { TModel, TPresenter } from './types';
import { TView } from './views/types';

class Presenter implements TPresenter {
  private model: TModel;

  private view: TView;

  constructor(model: TModel, view: TView) {
    this.model = model;
    this.view = view;
  }

  public init() {
    this.view.addObserver(this.setModelValue);

    // Add and notify observer
    this.model.addObserver(this.update);

    const modelValues = this.model.getValues();
    this.model.notifyObservers(modelValues);
  }

  public getValues() {
    return this.model.getValues();
  }

  // Invoked on view change (Observer)
  @boundMethod
  public setModelValue(index: number, value: number) {
    return this.model.setValue(index, value);
  }

  // Invoked on model change (Observer)
  @boundMethod
  public update(v: number[]): void {
    const conf = this.model.getConfig();
    this.view.setModelOptions(conf);
    this.view.setValues(v);
  }
}

export default Presenter;
