import PanasonicCameraControl from './ptz/panasonic-camera-control';

class App {
  //   constructor() {

  //   }

  run() {
    console.log('Hello World');
    const ptz1 = new PanasonicCameraControl('172.17.121.84');
  }
}

export default App;
