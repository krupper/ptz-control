import PanasonicCameraControl from './ptz/panasonic-camera-control';

class App {
  //   constructor() {

  //   }

  run() {
    console.log('Hello World');
    const ptz1 = new PanasonicCameraControl('172.17.121.84');
    // ptz1.stepIris('up', 10);
    // ptz1.stepIris('up', 10);
    // ptz1.stepIris('up', 10);
    ptz1.setPanTiltSpeed(100, 100);
    ptz1.setPanTiltSpeed(-100, -100);
    ptz1.setPanTiltSpeed(100, 100);
    setTimeout(() => {
      // ptz1.stepIris('up', 10);
      ptz1.setPanTiltSpeed(0, 0);
    }, 1000);
  }
}

export default App;
