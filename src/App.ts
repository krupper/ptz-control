// import XboxController from './controller/microsoft-xbox';
import GameController = require('./controller/test-controller.js');
import PanasonicCameraControl from './ptz/panasonic-camera-control';

class App {
  // controller: Controller;
  testController: GameController;
  ptz1 = new PanasonicCameraControl('172.17.121.81');

  constructor() {
    // this.controller = new XboxController();
    this.testController = new GameController();
  }

  async run() {
    this.testController = new GameController();
    await this.testController.init();
    this.testController.on('button', (btn: any) => {
      // console.log(`Button: ${btn} pressed`);
      if (btn === '"TRIGGER_RIGHT"') {
        this.ptz1.setZoomSpeed(-50);
      }

      if (btn === '"TRIGGER_LEFT"') {
        this.ptz1.setZoomSpeed(50);
      }

      if (btn === '"A"') {
        this.ptz1.setZoomSpeed(0);
      }
    });
    this.testController.on('thumbsticks', (val: any) => {
      // console.log(val);

      const temp = val.replace('[', '').replace(']', '').split(',');

      const x = (temp[0] * 100) / 2;
      const y = (temp[1] * 100) / 2;

      // console.log('Pos: x:' + x.toFixed() + ' y: ' + y.toFixed());
      this.ptz1.setPanTiltSpeed(x, y * -1);
    });
  }
}

export default App;
