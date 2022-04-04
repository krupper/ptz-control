import {AxisMotionData, ButtonPress} from 'sdl2-gamecontroller';
import AppService from '../../AppService';
import PtzCameras from '../cameras/PtzCameras';
abstract class Controller {
  appService: AppService;
  product: string;
  manufacturer: string;
  playerId: number;
  joystickDeviceIndex: number; // also called "which"
  currentCameraNumber: number | undefined;
  currentCameraObject: PtzCameras | undefined;

  constructor(
    appService: AppService,
    product: string,
    manufacturer: string,
    playerId: number,
    joystickDeviceIndex: number
  ) {
    this.appService = appService;
    this.product = product;
    this.manufacturer = manufacturer;
    this.playerId = playerId;
    this.joystickDeviceIndex = joystickDeviceIndex;
    this.currentCameraNumber = 0;

    // select first camera if no camera is selected
    if (this.appService.cameras[this.currentCameraNumber]) {
      this.currentCameraObject =
        this.appService.cameras[this.currentCameraNumber];
    }
  }

  abstract onLeftStickMotion(data: AxisMotionData): void;
  abstract onButtonDown(data: ButtonPress): void;

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
