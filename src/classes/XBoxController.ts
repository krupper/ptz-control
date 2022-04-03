import Controller from './Controller';
import {AxisMotionData, ButtonPress} from 'sdl2-gamecontroller';
import EventEmitter from 'events';
import StickMotionEvent from '../interfaces/IStickMotionEvent';
import AppService from '../AppService';
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
    appService: AppService,
    product: string,
    manufacturer: string,
    playerId: number,
    joystickDeviceIndex: number
  ) {
    super(appService, product, manufacturer, playerId, joystickDeviceIndex);
  }

  onButtonDown(data: ButtonPress): void {
    if (data.button === 'dpleft') this.previousCamera();
    if (data.button === 'dpright') this.nextCamera();
    if (this.currentCameraNumber !== undefined) {
      console.log('Player ' + this.playerId + ' selected camera:');
      console.log(this.appService.cameras[this.currentCameraNumber]);
    }
  }

  onLeftStickMotion(data: AxisMotionData) {
    // filter for this controller
    if (data.player === this.playerId) {
      if (data.button === 'leftx') {
        this.leftStickX = data.value * (100 / 32767);

        if (this.lefStickTimestamp < data.timestamp) {
          const leftStickMotionEvent: StickMotionEvent = {
            x: this.leftStickX,
            y: this.leftStickY,
          };

          this.lefStickTimestamp = data.timestamp;
          console.log(leftStickMotionEvent);
        }
      }
      if (data.button === 'lefty') {
        // filter for this controller
        this.leftStickY = data.value * (100 / 32767);

        if (this.lefStickTimestamp < data.timestamp) {
          const leftStickMotionEvent: StickMotionEvent = {
            x: this.leftStickX,
            y: this.leftStickY,
          };

          this.lefStickTimestamp = data.timestamp;
          console.log(leftStickMotionEvent);
        }
      }
      // send event to camera
      this.currentCameraObject?.setPanTiltSpeed(
        this.leftStickX,
        this.leftStickY
      );
    }
  }
}

export default XboxController;
