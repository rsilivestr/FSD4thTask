import ModelOptions from './ModelOptions';
import Presenter from './Presenter';
import ViewOptions from './ViewOptions';

export default interface View {
  options: ViewOptions;
  presenter: Presenter;

  config(o?: ViewOptions): ViewOptions;
  setModelOptions(o: ModelOptions): ModelOptions;
}
