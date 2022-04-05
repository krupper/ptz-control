import config from 'config';
import Gamepad from 'sdl2-gamecontroller';
import Controller from './classes/controller/Controller';
import {IConfigCamera} from './interfaces/IConfig.js';
import PtzCameras from './classes/cameras/PtzCameras';
import PanasonicCameraControl from './classes/cameras/PanasonicCameraControl';
import XboxController from './classes/controller/XBoxController';
import StickMotionEvent from './interfaces/IStickMotionEvent';

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
          camera.model,
          camera.ip
        );
        this.cameras.push(newCamera);
      }
    });
  }

  private mapLeftStickMotion(
    data: StickMotionEvent,
    currentCameraNumber: number,
    appService: AppService
  ) {
    console.log('Stick motion event:', data, ' on ', currentCameraNumber);
    console.log(appService.cameras[currentCameraNumber]);
  }

  run() {
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

          // add controller mapping
          newController.onLeftStickMotion(this.mapLeftStickMotion);

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
          this.controllers[data.player].proxyLeftStickMotion(data);
      });
      Gamepad.on('lefty', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].proxyLeftStickMotion(data);
      });

      // button down methods
      Gamepad.on('a:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].onButtonDown(data);
      });
      Gamepad.on('b:down', data => {
        Gamepad.rumble(60000, 40000, 100, data.player);
        console.log('rumble');
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].onButtonDown(data);
      });
      Gamepad.on('x:down', data => {
        console.log('rumbleTriggers');
        Gamepad.rumbleTriggers(40000, 40000, 100, data.player);
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
      Gamepad.on('leftshoulder:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].onLeftShoulderButton(data);
      });
      Gamepad.on('rightshoulder:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].onRightShoulderButton(data);
      });
      Gamepad.on('lefttrigger', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].onLeftTriggerMotion(data);
      });
      Gamepad.on('righttrigger', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].onRightTriggerMotion(data);
      });
      Gamepad.on('error', data => {
        console.error(data);
      });
      Gamepad.on('warning', data => {
        console.warn(data);
      });
    });
  }
}

export default AppService;
