import Observer from './Observer';
import Slider from './Slider';
import Subject from './Subject';

export default interface Panel extends Subject, Observer {
  slider: Slider;
}
