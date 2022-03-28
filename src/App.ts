import XboxController from './controller/microsoft-xbox';
import Controller from './interfaces/Controller';
import GameController = require('./controller/test-controller.js');

class App {
  controller: Controller;
  testController: GameController;
  constructor() {
    this.controller = new XboxController();
    this.testController = new GameController();
  }

  async run() {
    this.testController = new GameController();
    await this.testController.init();
    this.testController.on('button', (btn: any) =>
      console.log(`Button: ${btn} pressed`)
    );
    this.testController.on('thumbsticks', (val: any) => {
      console.log(val);

      const temp = val.replace('[', '').replace(']', '').split(',');

      const x = temp[0] * 100;
      const y = temp[1] * 100;

      console.log('Pos: x:' + x.toFixed() + ' y: ' + y.toFixed());
    });
  }
}

export default App;
