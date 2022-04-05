import config from 'config';
import Gamepad, {ButtonType} from 'sdl2-gamecontroller';
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

  private mapStickMotion(
    data: StickMotionEvent,
    currentCameraNumber: number,
    appService: AppService
  ) {
    // send event to camera
    appService.cameras[currentCameraNumber]?.setPanTiltSpeed(
      data.x,
      data.y * -1
    );
  }

  private mapButtonDown() {}
  private mapLeftShoulderButton(
    button: ButtonType,
    currentCameraNumber: number,
    appService: AppService
  ) {
    appService.cameras[currentCameraNumber]?.stepIris('down', 100);
  }
  private mapRightShoulderButton(
    button: ButtonType,
    currentCameraNumber: number,
    appService: AppService
  ) {
    appService.cameras[currentCameraNumber]?.stepIris('up', 100);
  }
  private mapLeftTriggerMotion(
    value: number,
    currentCameraNumber: number,
    appService: AppService
  ) {
    // send event to camera
    appService.cameras[currentCameraNumber]?.setZoomSpeed(value * -1);
  }
  private mapRightTriggerMotion(
    value: number,
    currentCameraNumber: number,
    appService: AppService
  ) {
    // send event to camera
    appService.cameras[currentCameraNumber]?.setZoomSpeed(value);
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
          newController.onLeftStickMotion(this.mapStickMotion);
          newController.onRightStickMotion(this.mapStickMotion);
          newController.onButtonDown(this.mapButtonDown);
          newController.onLeftShoulderButton(this.mapLeftShoulderButton);
          newController.onRightShoulderButton(this.mapRightShoulderButton);
          newController.onLeftTriggerMotion(this.mapLeftTriggerMotion);
          newController.onRightTriggerMotion(this.mapRightTriggerMotion);

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

      // rightstick methods
      Gamepad.on('rightx', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].proxyRightStickMotion(data);
      });
      Gamepad.on('righty', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].proxyRightStickMotion(data);
      });

      // button down methods
      Gamepad.on('a:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].proxyButtonDown(data);
      });
      Gamepad.on('b:down', data => {
        Gamepad.rumble(60000, 40000, 100, data.player);
        console.log('rumble');
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].proxyButtonDown(data);
      });
      Gamepad.on('x:down', data => {
        console.log('rumbleTriggers');
        Gamepad.rumbleTriggers(40000, 40000, 100, data.player);
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].proxyButtonDown(data);
      });
      Gamepad.on('y:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].proxyButtonDown(data);
      });
      Gamepad.on('dpup:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].proxyButtonDown(data);
      });
      Gamepad.on('dpdown:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].proxyButtonDown(data);
      });
      Gamepad.on('dpleft:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].proxyButtonDown(data);
      });
      Gamepad.on('dpright:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].proxyButtonDown(data);
      });
      Gamepad.on('leftshoulder:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].proxyLeftShoulderButton(data);
      });
      Gamepad.on('rightshoulder:down', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].proxyRightShoulderButton(data);
      });
      Gamepad.on('lefttrigger', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].proxyLeftTriggerMotion(data);
      });
      Gamepad.on('righttrigger', data => {
        if (data.player && this.controllers[data.player])
          this.controllers[data.player].proxyRightTriggerMotion(data);
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
