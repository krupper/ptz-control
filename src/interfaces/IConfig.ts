export interface IConfigController {
  controllerIdentifier: string;
  vendor: string;
  model: string;
}

export interface IConfigCamera {
  cameraIdentifier: string;
  vendor: string;
  model: string;
  ip: string;
}

export interface IConfigDefaultRouting {
  cameraIdentifier: string;
  controllerIdentifier: string;
}
