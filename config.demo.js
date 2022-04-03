const config = {};

// add all connected controller to this array
config.controller = [
  {
    controllerIdentifier: 'Controller 1', // choose a unique name
    vendor: 'Microsoft',
    model: 'XBOX Wireless',
  },
];

// add all connected cameras to this array
config.cameras = [
  {
    cameraIdentifier: 'Camera 1', // choose a unique name
    vendor: 'Panasonic',
    model: 'AW-HE130',
    ip: '192.168.1.100',
  },
];

// select the default routing between controller and cameras
config.defaultRouting = [
  {
    cameraIdentifier: 'Camera 1',
    controllerIdentifier: 'Controller 1',
  },
];

module.exports = config;
