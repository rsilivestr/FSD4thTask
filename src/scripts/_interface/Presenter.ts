import Model from './Model';
import View from './View';

export default interface Presenter {
  model: Model;
  view: View;

  update(sender: View | Model): void;
}
