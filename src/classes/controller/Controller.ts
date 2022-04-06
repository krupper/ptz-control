import {AxisMotionData, ButtonPress, ButtonType} from 'sdl2-gamecontroller';
import AppService from '../../AppService';
import StickMotionEvent from '../../interfaces/IStickMotionEvent';
import PtzCameras from '../cameras/PtzCameras';
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
        contect: AppService
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
        contect: AppService
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
        contect: AppService
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
      context: AppService
    ) => void
  ): void {
    this.buttonDownCallback = callback;
  }
  buttonDownCallback:
    | ((
        button: ButtonType,
        currentCameraNumber: number,
        contect: AppService
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
        contect: AppService
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
        contect: AppService
      ) => void)
    | undefined;

  protected nextCamera() {
    if (this.currentCameraNumber !== undefined) {
      if (this.currentCameraNumber + 1 >= this.appService.cameras.length) {
        this.selectCamera(0);
      } else {
        this.selectCamera(this.currentCameraNumber + 1);
      }
    }
  }

  protected previousCamera() {
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
}

export default Controller;
