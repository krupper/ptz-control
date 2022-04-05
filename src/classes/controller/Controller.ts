import {AxisMotionData, ButtonPress} from 'sdl2-gamecontroller';
import AppService from '../../AppService';
import StickMotionEvent from '../../interfaces/IStickMotionEvent';
import PtzCameras from '../cameras/PtzCameras';
abstract class Controller {
  appService: AppService;
  product: string;
  manufacturer: string;
  controllerId: number;
  joystickDeviceIndex: number; // also called "which"
  currentCameraNumber: number;
  currentCameraObject: PtzCameras | undefined;

  constructor(
    appService: AppService,
    product: string,
    manufacturer: string,
    controllerId: number,
    joystickDeviceIndex: number
  ) {
    this.appService = appService;
    this.product = product;
    this.manufacturer = manufacturer;
    this.controllerId = controllerId;
    this.joystickDeviceIndex = joystickDeviceIndex;
    this.currentCameraNumber = 0;

    // select first camera if no camera is selected
    if (this.appService.cameras[this.currentCameraNumber]) {
      this.currentCameraObject =
        this.appService.cameras[this.currentCameraNumber];
    }
  }

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

  abstract onRightStickMotion(data: AxisMotionData): void;
  abstract onLeftTriggerMotion(data: AxisMotionData): void;
  abstract onRightTriggerMotion(data: AxisMotionData): void;
  abstract onButtonDown(data: ButtonPress): void;
  abstract onLeftShoulderButton(data: ButtonPress): void;
  abstract onRightShoulderButton(data: ButtonPress): void;

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
