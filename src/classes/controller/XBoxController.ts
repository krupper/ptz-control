import Controller from './Controller';
import {AxisMotionData, ButtonPress} from 'sdl2-gamecontroller';
import StickMotionEvent from '../../interfaces/IStickMotionEvent';
import AppService from '../../AppService';
class XboxController extends Controller {
  // Left stick
  private leftStickX = 0;
  private leftStickY = 0;
  private leftStickTimestamp = 0;

  // Right stick
  private rightStickX = 0;
  private rightStickY = 0;
  private rightStickTimestamp = 0;

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

  proxyButtonDown(data: ButtonPress): void {
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

        if (this.leftStickTimestamp < data.timestamp) {
          const leftStickMotionEvent: StickMotionEvent = {
            x: this.leftStickX,
            y: this.leftStickY,
          };

          this.leftStickTimestamp = data.timestamp;

          // fire the callback function
          if (this.leftStickMotionCallback) {
            this.leftStickMotionCallback(
              leftStickMotionEvent,
              this.currentCameraNumber,
              this.appService
            );
          }
        }
      }
      if (data.button === 'lefty') {
        // filter for this controller
        this.leftStickY = data.value * (100 / 32767);

        if (this.leftStickTimestamp < data.timestamp) {
          const leftStickMotionEvent: StickMotionEvent = {
            x: this.leftStickX,
            y: this.leftStickY,
          };

          this.leftStickTimestamp = data.timestamp;

          // fire the callback function
          if (this.leftStickMotionCallback) {
            this.leftStickMotionCallback(
              leftStickMotionEvent,
              this.currentCameraNumber,
              this.appService
            );
          }
        }
      }
    }
  }

  proxyRightStickMotion(data: AxisMotionData): void {
    // filter for this controller
    if (data.player === this.controllerId) {
      if (data.button === 'rightx') {
        this.rightStickX = data.value * (100 / 32767);

        if (this.rightStickTimestamp < data.timestamp) {
          const rightStickMotionEvent: StickMotionEvent = {
            x: this.rightStickX,
            y: this.rightStickY,
          };

          this.rightStickTimestamp = data.timestamp;

          // fire the callback function
          if (this.rightStickMotionCallback) {
            this.rightStickMotionCallback(
              rightStickMotionEvent,
              this.currentCameraNumber,
              this.appService
            );
          }
        }
      }
      if (data.button === 'righty') {
        // filter for this controller
        this.rightStickY = data.value * (100 / 32767);

        if (this.rightStickTimestamp < data.timestamp) {
          const rightStickMotionEvent: StickMotionEvent = {
            x: this.rightStickX,
            y: this.rightStickY,
          };

          this.leftStickTimestamp = data.timestamp;

          // fire the callback function
          if (this.rightStickMotionCallback) {
            this.rightStickMotionCallback(
              rightStickMotionEvent,
              this.currentCameraNumber,
              this.appService
            );
          }
        }
      }
    }
  }
  proxyLeftTriggerMotion(data: AxisMotionData): void {
    this.leftTrigger = data.value * (100 / 32767);

    // fire the callback function
    if (this.leftTriggerMotionCallback) {
      this.leftTriggerMotionCallback(
        this.leftTrigger,
        this.currentCameraNumber,
        this.appService
      );
    }
  }
  proxyRightTriggerMotion(data: AxisMotionData): void {
    this.rightTrigger = data.value * (100 / 32767);
    // fire the callback function
    if (this.rightTriggerMotionCallback) {
      this.rightTriggerMotionCallback(
        this.rightTrigger,
        this.currentCameraNumber,
        this.appService
      );
    }
  }

  proxyLeftShoulderButton(data: ButtonPress): void {
    if (this.leftShoulderButtonCallback) {
      this.leftShoulderButtonCallback(
        data.button,
        this.currentCameraNumber,
        this.appService
      );
    }
  }

  proxyRightShoulderButton(data: ButtonPress): void {
    if (this.rightShoulderButtonCallback) {
      this.rightShoulderButtonCallback(
        data.button,
        this.currentCameraNumber,
        this.appService
      );
    }
  }
}

export default XboxController;
