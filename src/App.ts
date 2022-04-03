import config from 'config';
import StickMotionEvent from './interfaces/IStickMotionEvent';
import Controller from './classes/Controller';
import {
  IConfigCamera,
  IConfigController,
  IConfigDefaultRouting,
} from './interfaces/IConfig.js';
import PtzCameras from './classes/PtzCameras';
import PanasonicCameraControl from './classes/PanasonicCameraControl';
import XboxController from './classes/XBoxController';

class App {
  controller: Controller | XboxController;
  config = {
    controller: config.get('controller') as IConfigController[],
    cameras: config.get('cameras') as IConfigCamera[],
    defaultRouting: config.get('defaultRouting') as IConfigDefaultRouting[],
  };

  cameras: PtzCameras[] = [];

  constructor() {
    this.controller = new XboxController('XBox Controller', 'Microsoft', 1);

    // init cameras from config
    this.config.cameras.forEach(camera => {
      if (camera.vendor === 'Panasonic') {
        const newCamera = new PanasonicCameraControl(
          camera.cameraIdentifier,
          camera.vendor,
          camera.vendor,
          camera.ip
        );
        this.cameras.push(newCamera);
      }
    });
  }

  async run() {
    await this.controller.init();

    this.controller.onLeftStickMotion((data: StickMotionEvent) => {
      console.log(data);
    });
  }
}

export default App;
