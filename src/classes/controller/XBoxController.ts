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
  private leftStickSpeedRate = 1.3;

  // Right stick
  private rightStickX = 0;
  private rightStickY = 0;
  private rightStickTimestamp = 0;
  private rightStickSpeedRate = 2;

  // trigger left and right
  private leftTriggerSpeedRate = 1.9;
  private rightTriggerSpeedRate = 1.9;

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
  }

  proxyButtonDown(data: ButtonPress): void {
    const controller = this as Controller;
    if (this.buttonDownCallback) {
      this.buttonDownCallback(
        data.button,
        this.currentCameraNumber,
        this.appService,
        controller
      );
    }
  }

  proxyLeftStickMotion(data: AxisMotionData) {
    data.value = data.value / this.leftStickSpeedRate;

    if (data.button === 'leftx') {
      this.leftStickX = this.easeValue(
        (data.value / this.maxStickMotionValue) * 100,
        'cubic-bezier'
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
      this.leftStickY = this.easeValue(
        (data.value / this.maxStickMotionValue) * 100,
        'cubic-bezier'
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
    data.value = data.value / this.rightStickSpeedRate;

    if (data.button === 'rightx') {
      this.rightStickX = this.easeValue(
        (data.value / this.maxStickMotionValue) * 100,
        'cubic-bezier'
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
      this.rightStickY = this.easeValue(
        (data.value / this.maxStickMotionValue) * 100,
        'cubic-bezier'
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
    data.value = data.value / this.leftTriggerSpeedRate;
    this.leftTrigger = this.easeValue(
      (data.value / this.maxStickMotionValue) * 100,
      'cubic-bezier'
    );

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
    data.value = data.value / this.rightTriggerSpeedRate;
    this.rightTrigger = this.easeValue(
      (data.value / this.maxStickMotionValue) * 100,
      'cubic-bezier'
    );

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
