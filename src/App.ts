import config from 'config';

// import XboxController from './controller/microsoft-xbox';
import GameController = require('./controller/test-controller.js');
import {
  IConfigCamera,
  IConfigController,
  IConfigDefaultRouting,
} from './interfaces/IConfig.js';
import PTZcameras from './interfaces/IPtzCameras.js';
import PanasonicCameraControl from './ptz/panasonic-camera-control';

class App {
  config = {
    controller: config.get('controller') as IConfigController[],
    cameras: config.get('cameras') as IConfigCamera[],
    defaultRouting: config.get('defaultRouting') as IConfigDefaultRouting[],
  };

  controller: GameController[] = [];
  cameras: PTZcameras[] = [];

  constructor() {
    // init controllers from config
    this.config.controller.forEach(controller => {
      const newController = new GameController();
      this.controller.push(newController);
    });

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
    this.cameras[3].stepIris('up', 10);
  }
}

export default App;
