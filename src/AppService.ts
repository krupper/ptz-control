import config from 'config';
import Gamepad from 'sdl2-gamecontroller';
import Controller from './classes/Controller';
import {IConfigCamera} from './interfaces/IConfig.js';
import PtzCameras from './classes/PtzCameras';
import PanasonicCameraControl from './classes/PanasonicCameraControl';
import XboxController from './classes/XBoxController';

class AppService {
  controllers: Controller[] = [];
  readonly config = {
    cameras: config.get('cameras') as IConfigCamera[],
  };

  readonly cameras: PtzCameras[] = [];

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
            this,
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
          this.controllers[data.player] = newController;
        }
      });

      // removed controller
      Gamepad.on('controller-device-removed', data => {
        // remove controller from array
        this.controllers = this.controllers.filter(controller => {
          return controller.joystickDeviceIndex !== data.which;
        });
      });

      // leftstick methods
      Gamepad.on('leftx', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].onLeftStickMotion(data);
      });
      Gamepad.on('lefty', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].onLeftStickMotion(data);
      });

      // button down methods
      Gamepad.on('a:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].onButtonDown(data);
      });
      Gamepad.on('b:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].onButtonDown(data);
      });
      Gamepad.on('x:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].onButtonDown(data);
      });
      Gamepad.on('y:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].onButtonDown(data);
      });
      Gamepad.on('dpup:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].onButtonDown(data);
      });
      Gamepad.on('dpdown:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].onButtonDown(data);
      });
      Gamepad.on('dpleft:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].onButtonDown(data);
      });
      Gamepad.on('dpright:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].onButtonDown(data);
      });
    });
  }
}

export default AppService;
