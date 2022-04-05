import Controller from './Controller';
import {AxisMotionData, ButtonPress} from 'sdl2-gamecontroller';
import StickMotionEvent from '../../interfaces/IStickMotionEvent';
import AppService from '../../AppService';
class XboxController extends Controller {
  // Left stick
  private leftStickX = 0;
  private leftStickY = 0;
  private lefStickTimestamp = 0;

  // Right stick
  private rightStickX = 0;
  private rightStickY = 0;

  // trigger
  private leftTrigger = 0;
  private rightTrigger = 0;

  constructor(
    appService: AppService,
    product: string,
    manufacturer: string,
    controllerId: number,
    joystickDeviceIndex: number
  ) {
    super(appService, product, manufacturer, controllerId, joystickDeviceIndex);
  }

  onButtonDown(data: ButtonPress): void {
    if (data.button === 'dpleft') this.previousCamera();
    if (data.button === 'dpright') this.nextCamera();
    if (
      (data.button === 'dpleft' || data.button === 'dpright') &&
      this.currentCameraNumber !== undefined
    ) {
      console.log('Controller ' + this.controllerId + ' selected camera:');
      console.log(this.appService.cameras[this.currentCameraNumber]);
    }
  }

  proxyLeftStickMotion(data: AxisMotionData) {
    // filter for this controller
    if (data.player === this.controllerId) {
      if (data.button === 'leftx') {
        this.leftStickX = data.value * (100 / 32767);

        if (this.lefStickTimestamp < data.timestamp) {
          const leftStickMotionEvent: StickMotionEvent = {
            x: this.leftStickX,
            y: this.leftStickY,
          };

          this.lefStickTimestamp = data.timestamp;

          // fire the callback function
          if (this.leftStickMotionCallback) {
            this.leftStickMotionCallback(
              leftStickMotionEvent,
              this.currentCameraNumber
            );
          }
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

          // fire the callback function
          if (this.leftStickMotionCallback) {
            this.leftStickMotionCallback(
              leftStickMotionEvent,
              this.currentCameraNumber
            );
          }
        }
      }
      // send event to camera
      this.currentCameraObject?.setPanTiltSpeed(
        this.leftStickX,
        this.leftStickY * -1
      );
    }
  }

  onRightStickMotion(data: AxisMotionData): void {
    console.log(data);
  }
  onLeftTriggerMotion(data: AxisMotionData): void {
    this.leftTrigger = data.value * (100 / 32767);
    // send event to camera
    this.currentCameraObject?.setZoomSpeed(this.leftTrigger * -1);
  }
  onRightTriggerMotion(data: AxisMotionData): void {
    this.rightTrigger = data.value * (100 / 32767);
    this.currentCameraObject?.setZoomSpeed(this.rightTrigger);
  }

  onLeftShoulderButton(data: ButtonPress): void {
    console.log(data);
    this.currentCameraObject?.stepIris('down', 100);
  }

  onRightShoulderButton(data: ButtonPress): void {
    console.log(data);
    this.currentCameraObject?.stepIris('up', 100);
  }
}

export default XboxController;
