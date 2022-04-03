import config from 'config';
import Gamepad from 'sdl2-gamecontroller';
import Controller from './classes/Controller';
import {IConfigCamera} from './interfaces/IConfig.js';
import PtzCameras from './classes/PtzCameras';
import PanasonicCameraControl from './classes/PanasonicCameraControl';
import XboxController from './classes/XBoxController';

class App {
  controllers: Controller[] = [];
  config = {
    cameras: config.get('cameras') as IConfigCamera[],
  };

  cameras: PtzCameras[] = [];

  constructor() {
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
    // Wait until SDL2 is initialized
    Gamepad.on('sdl-init', () => {
      console.log('Wait until an controller connects');

      // add new controller
      Gamepad.on('controller-device-added', data => {
        console.log('Yeaha! Found an', data.name);

        if (!data.player) {
          console.log('No Player ID for controller found');
          return;
        }

        let newController: Controller | undefined = undefined;

        // if controller is: Xbox Series X Controller
        if (data.vendor_id === 1118 && data.product_id === 2835) {
          newController = new XboxController(
            'XBox Controller',
            'Microsoft',
            data.player,
            data.which
          );
        }

        // store new controller
        if (newController) {
          console.log(
            'Created new controller object with player id: ' +
              data.player +
              ' and joystickDeviceIndex: ' +
              data.which
          );
          this.controllers.push(newController);
        }
      });

      // removed controller
      Gamepad.on('controller-device-removed', data => {
        console.log(data.message);
        console.log('To be done: remove object & event emitter');

        // remove controller from array
        // this.controllers = this.controllers.filter(controller => {
        //   return controller.joystickDeviceIndex !== data.which;
        // });
      });
    });
  }
}

export default App;
