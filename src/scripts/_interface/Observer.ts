import Presenter from './Presenter';

export default interface Observer {
  presenter: Presenter;
  update(values: number[]): number[];
}
