abstract class PtzCameras {
  ip: string;
  cameraIdentifier: string;
  vendor: string;
  model: string;

  constructor(
    cameraIdentifier: string,
    vendor: string,
    model: string,
    ip: string
  ) {
    this.cameraIdentifier = cameraIdentifier;
    this.vendor = vendor;
    this.model = model;
    this.ip = ip;
  }

  abstract setPanTiltSpeed(pan: number, tilt: number): void;
  abstract setZoomSpeed(speed: number): void;

  abstract setAutoFocus(status: boolean): void;
  abstract setFocusSpeed(speed: number): void;

  abstract setAutoIris(staÍtus: boolean): void;
  abstract stepIris(direction: 'up' | 'down', stepSize: number): void;

  abstract playbackPreset(presetNumber: number): void;
}

export default PtzCameras;
