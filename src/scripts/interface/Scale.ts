import Observer from './Observer';
import Slider from './Slider';

export default interface Scale extends Observer {
  slider: Slider;
  scaleMarks: HTMLElement[];
  markValues: number[];

  update(): void;
}
