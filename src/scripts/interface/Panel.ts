import Observer from './Observer';
import Slider from './Slider';

export default interface Panel extends Observer {
  slider: Slider;
}
