import {AxisMotionData, ButtonPress, ButtonType} from 'sdl2-gamecontroller';
import AppService from '../../AppService';
import StickMotionEvent from '../../interfaces/IStickMotionEvent';
import PtzCameras from '../cameras/PtzCameras';
import BezierEasing from 'bezier-easing';
abstract class Controller {
  appService: AppService;
  product: string;
  manufacturer: string;
  controllerId: number;
  currentCameraNumber: number;
  currentCameraObject: PtzCameras | undefined;

  constructor(
    appService: AppService,
    product: string,
    manufacturer: string,
    controllerId: number
  ) {
    this.appService = appService;
    this.product = product;
    this.manufacturer = manufacturer;
    this.controllerId = controllerId;
    this.currentCameraNumber = 0;

    // select first camera if no camera is selected
    if (this.appService.cameras[this.currentCameraNumber]) {
      this.currentCameraObject =
        this.appService.cameras[this.currentCameraNumber];
    }
  }

  //
  // left-stick motion
  //
  abstract proxyLeftStickMotion(data: AxisMotionData): void;
  onLeftStickMotion(
    callback: (
      data: StickMotionEvent,
      currentCameraNumber: number,
      context: AppService
    ) => void
  ): void {
    this.leftStickMotionCallback = callback;
  }
  leftStickMotionCallback:
    | ((
        data: StickMotionEvent,
        currentCameraNumber: number,
        context: AppService
      ) => void)
    | undefined;

  //
  // right-stick motion
  //
  abstract proxyRightStickMotion(data: AxisMotionData): void;
  onRightStickMotion(
    callback: (
      data: StickMotionEvent,
      currentCameraNumber: number,
      context: AppService
    ) => void
  ): void {
    this.rightStickMotionCallback = callback;
  }
  rightStickMotionCallback:
    | ((
        data: StickMotionEvent,
        currentCameraNumber: number,
        context: AppService
      ) => void)
    | undefined;

  //
  // left-trigger motion
  //
  abstract proxyLeftTriggerMotion(data: AxisMotionData): void;
  onLeftTriggerMotion(
    callback: (
      value: number,
      currentCameraNumber: number,
      context: AppService
    ) => void
  ): void {
    this.leftTriggerMotionCallback = callback;
  }
  leftTriggerMotionCallback:
    | ((
        value: number,
        currentCameraNumber: number,
        context: AppService
      ) => void)
    | undefined;

  //
  // right-trigger motion
  //
  abstract proxyRightTriggerMotion(data: AxisMotionData): void;
  onRightTriggerMotion(
    callback: (
      value: number,
      currentCameraNumber: number,
      context: AppService
    ) => void
  ): void {
    this.rightTriggerMotionCallback = callback;
  }
  rightTriggerMotionCallback:
    | ((
        value: number,
        currentCameraNumber: number,
        context: AppService
      ) => void)
    | undefined;

  //
  // button down
  //
  abstract proxyButtonDown(data: ButtonPress): void;
  onButtonDown(
    callback: (
      button: ButtonType,
      currentCameraNumber: number,
      context: AppService,
      controller: Controller
    ) => void
  ): void {
    this.buttonDownCallback = callback;
  }
  buttonDownCallback:
    | ((
        button: ButtonType,
        currentCameraNumber: number,
        context: AppService,
        controller: Controller
      ) => void)
    | undefined;

  //
  // left-shoulder button
  //
  abstract proxyLeftShoulderButton(data: ButtonPress): void;
  onLeftShoulderButton(
    callback: (
      button: ButtonType,
      currentCameraNumber: number,
      context: AppService
    ) => void
  ): void {
    this.leftShoulderButtonCallback = callback;
  }
  leftShoulderButtonCallback:
    | ((
        button: ButtonType,
        currentCameraNumber: number,
        context: AppService
      ) => void)
    | undefined;

  //
  // right-shoulder button
  //
  abstract proxyRightShoulderButton(data: ButtonPress): void;
  onRightShoulderButton(
    callback: (
      button: ButtonType,
      currentCameraNumber: number,
      context: AppService
    ) => void
  ): void {
    this.rightShoulderButtonCallback = callback;
  }
  rightShoulderButtonCallback:
    | ((
        button: ButtonType,
        currentCameraNumber: number,
        context: AppService
      ) => void)
    | undefined;

  public nextCamera() {
    if (this.currentCameraNumber !== undefined) {
      if (this.currentCameraNumber + 1 >= this.appService.cameras.length) {
        this.selectCamera(0);
      } else {
        this.selectCamera(this.currentCameraNumber + 1);
      }
    }
  }

  public previousCamera() {
    if (this.currentCameraNumber !== undefined) {
      if (this.currentCameraNumber - 1 < 0) {
        this.selectCamera(this.appService.cameras.length - 1);
      } else {
        this.selectCamera(this.currentCameraNumber - 1);
      }
    }
  }

  private selectCamera(cameraNumber: number) {
    this.currentCameraNumber = cameraNumber;
    if (this.appService.cameras[cameraNumber])
      this.currentCameraObject = this.appService.cameras[cameraNumber];
  }

  protected easeValue(
    value: number,
    easingFunction:
      | 'quadratic'
      | 'cubic'
      | 'quartic'
      | 'quintic'
      | 'cubic-bezier'
  ): number {
    let postive = 1;
    if (value < 0) {
      value *= -1;
      postive = -1;
    }

    if (easingFunction === 'quadratic') {
      return this.normalizeValue(value * value, 100 * 100) * postive;
    }

    if (easingFunction === 'cubic') {
      return (
        this.normalizeValue(value * value * value, 100 * 100 * 100) * postive
      );
    }

    if (easingFunction === 'quartic') {
      return (
        this.normalizeValue(
          value * value * value * value,
          100 * 100 * 100 * 100
        ) * postive
      );
    }

    if (easingFunction === 'quintic') {
      return (
        this.normalizeValue(
          value * value * value * value * value,
          100 * 100 * 100 * 100 * 100
        ) * postive
      );
    }

    if (easingFunction === 'cubic-bezier') {
      const easing = BezierEasing(0.46, 0, 1, 1);
      return this.normalizeValue(easing(value / 100), easing(1)) * postive;
    }

    return value;
  }

  private normalizeValue(value: number, maximum: number): number {
    return (value / maximum) * 100;
  }
}

export default Controller;
