// default.ts
export default {
  // add all connected controller to this array
  controller: [
    {
      controllerIdentifier: 'Controller 1', // choose a unique name
      vendor: 'Microsoft',
      model: 'XBOX Wireless',
    },
  ],

  // add all connected cameras to this array
  cameras: [
    {
      cameraIdentifier: 'Camera 1', // choose a unique name
      vendor: 'Panasonic',
      model: 'AW-HE130',
      ip: '192.168.1.100',
    },
  ],

  // select the default routing between controller and cameras
  defaultRouting: [
    {
      cameraIdentifier: 'Camera 1',
      controllerIdentifier: 'Controller 1',
    },
  ],
};
