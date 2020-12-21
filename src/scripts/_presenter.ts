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

    this.model.addObserver(this.view);

    // Set view options
    const modelOptions = this.model.config();
    this.view.setModelOptions(modelOptions);

    // Notify observers about the model changes
    this.model.notifyObservers();

    // Render view
    this.view.render();
  }

  public moveHandler(id: number, coord: number) {
    return this.model.setValueByCoord(id, coord);
  }

  public getValues() {
    return this.model.getValues();
  }

  public update(sender: Model | View) {
    console.log(sender);
  }
}
