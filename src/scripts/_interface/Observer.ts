import Presenter from './Presenter';

export default interface Observer {
  presenter: Presenter;
  update(values: any): any;
}
