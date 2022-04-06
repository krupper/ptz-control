import Controller from './Controller';
import {AxisMotionData, ButtonPress} from 'sdl2-gamecontroller';
import StickMotionEvent from '../../interfaces/IStickMotionEvent';
import AppService from '../../AppService';
class XboxController extends Controller {
  // maximum stick motion driver value
  private maxStickMotionValue = 32767;

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
    controllerId: number
  ) {
    super(appService, product, manufacturer, controllerId);

    this.maxStickMotionValue = this.cubicInEasing(this.maxStickMotionValue);
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
    if (data.button === 'leftx') {
      this.leftStickX = this.normalizeValue(
        this.easeValue(data.value, 'cubic'),
        this.maxStickMotionValue
      );

      // detect related events
      if (this.leftStickTimestamp === data.timestamp) {
        const leftStickMotionEvent: StickMotionEvent = {
          x: this.leftStickX,
          y: this.leftStickY,
        };

        // fire the callback function
        if (this.leftStickMotionCallback) {
          this.leftStickMotionCallback(
            leftStickMotionEvent,
            this.currentCameraNumber,
            this.appService
          );
        }
      }

      this.leftStickTimestamp = data.timestamp;
    }
    if (data.button === 'lefty') {
      this.leftStickY = this.normalizeValue(
        this.easeValue(data.value, 'cubic'),
        this.maxStickMotionValue
      );

      // detect related events
      if (this.leftStickTimestamp === data.timestamp) {
        const leftStickMotionEvent: StickMotionEvent = {
          x: this.leftStickX,
          y: this.leftStickY,
        };

        // fire the callback function
        if (this.leftStickMotionCallback) {
          this.leftStickMotionCallback(
            leftStickMotionEvent,
            this.currentCameraNumber,
            this.appService
          );
        }
      }

      this.leftStickTimestamp = data.timestamp;
    }
  }

  proxyRightStickMotion(data: AxisMotionData): void {
    if (data.button === 'rightx') {
      this.rightStickX = this.normalizeValue(
        this.easeValue(data.value, 'cubic'),
        this.maxStickMotionValue
      );

      // detect related events
      if (this.rightStickTimestamp === data.timestamp) {
        const rightStickMotionEvent: StickMotionEvent = {
          x: this.rightStickX,
          y: this.rightStickY,
        };

        // fire the callback function
        if (this.rightStickMotionCallback) {
          this.rightStickMotionCallback(
            rightStickMotionEvent,
            this.currentCameraNumber,
            this.appService
          );
        }
      }
      this.rightStickTimestamp = data.timestamp;
    }
    if (data.button === 'righty') {
      this.rightStickY = this.normalizeValue(
        this.easeValue(data.value, 'cubic'),
        this.maxStickMotionValue
      );

      // detect related events
      if (this.rightStickTimestamp === data.timestamp) {
        const rightStickMotionEvent: StickMotionEvent = {
          x: this.rightStickX,
          y: this.rightStickY,
        };

        // fire the callback function
        if (this.rightStickMotionCallback) {
          this.rightStickMotionCallback(
            rightStickMotionEvent,
            this.currentCameraNumber,
            this.appService
          );
        }
      }
      this.leftStickTimestamp = data.timestamp;
    }
  }
  proxyLeftTriggerMotion(data: AxisMotionData): void {
    this.leftTrigger = data.value * (100 / this.maxStickMotionValue);

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
    this.rightTrigger = data.value * (100 / this.maxStickMotionValue);
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

  private cubicInEasing(value: number): number {
    return value * value * value;
  }
}

export default XboxController;
