import Controller from './Controller';
import Gamepad, {AxisMotionData} from 'sdl2-gamecontroller';
import EventEmitter from 'events';
import StickMotionEvent from '../interfaces/IStickMotionEvent';
class XboxController extends Controller {
  private eventEmitter = new EventEmitter();

  // Left stick
  private leftStickX = 0;
  private leftStickY = 0;
  private lefStickTimestamp = 0;

  // Right stick
  private rightStickX = 0;
  private rightStickY = 0;

  constructor(
    product: string,
    manufacturer: string,
    playerId: number,
    joystickDeviceIndex: number
  ) {
    super(product, manufacturer, playerId, joystickDeviceIndex);

    this.onLeftStickMotion((data: StickMotionEvent) => {
      console.log(data);
    });
  }

  onLeftStickMotion(event: (data: StickMotionEvent) => void) {
    Gamepad.on('leftx', (data: AxisMotionData) => {
      this.leftStickX = data.value;

      if (this.lefStickTimestamp < data.timestamp) {
        const leftStickMotionEvent: StickMotionEvent = {
          x: this.leftStickX,
          y: this.leftStickY,
        };

        this.lefStickTimestamp = data.timestamp;
        event(leftStickMotionEvent);
      }
    });
    Gamepad.on('lefty', (data: AxisMotionData) => {
      this.leftStickY = data.value;

      if (this.lefStickTimestamp < data.timestamp) {
        const leftStickMotionEvent: StickMotionEvent = {
          x: this.leftStickX,
          y: this.leftStickY,
        };

        this.lefStickTimestamp = data.timestamp;
        event(leftStickMotionEvent);
      }
    });
  }
}

export default XboxController;
