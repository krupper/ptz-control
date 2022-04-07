import IPtzCameras from './PtzCameras';
import axios, {AxiosError} from 'axios';

export default class PanasonicCameraControl extends IPtzCameras {
  // Iris behaviour:
  //    1366 - 1600 Iris closed
  //    1601 - 4094 Iris open
  private irisMin = 1600;
  private irisMax = 4094;
  private minimalCommandDelayInMs = 130;
  private parameter = {
    panTiltSpeed: {
      command: 'panTilt',
      wasSent: false,
      value: {
        pan: 0,
        tilt: 0,
      },
    },
    zoomSpeed: {
      command: 'zoom',
      wasSent: false,
      value: 0,
    },
    focusSpeed: {
      command: 'focus',
      wasSent: false,
      value: 0,
    },
    autoFocus: {
      command: 'autoFocus',
      wasSent: false,
      value: false,
    },
    iris: {
      command: 'iris',
      wasSent: false,
      value: '',
    },
    autoIris: {
      command: 'autoIris',
      wasSent: false,
      value: false,
    },
    preset: {
      command: 'preset',
      wasSent: false,
      value: 0,
    },
  };

  private currentParameterIndex = 0;
  private maxCommadSendAttempts: number;

  constructor(
    cameraIdentifier: string,
    vendor: string,
    model: string,
    ip: string
  ) {
    super(cameraIdentifier, vendor, model, ip);

    // Specifies the number of attempts to send a command in one interval
    this.maxCommadSendAttempts = Object.keys(this.parameter).length;

    // fetch the current camera parameters
    this.fetchCurrentParametes().then(() => {
      // check for new commands to send
      setInterval(() => {
        this.processCommands();
      }, this.minimalCommandDelayInMs);
    });
  }

  private processCommands(): void {
    // find the current parameter
    // @ToDo: Fix typescript workaround for keyof typeof that.paramter. "this" does not work for a reason
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    type ParameterIndex = keyof typeof that.parameter;
    const name = Object.keys(this.parameter)[
      this.currentParameterIndex
    ] as ParameterIndex;
    const currentParameter = this.parameter[name];

    // skip to next parameter if the current parameter has not changed
    if (currentParameter.wasSent) {
      this.currentParameterIndex =
        (this.currentParameterIndex + 1) % Object.keys(this.parameter).length;

      // limits the number of attempts to prevent an endless loop in case no parameter changes
      if (this.maxCommadSendAttempts >= 0) {
        this.maxCommadSendAttempts--;
        this.processCommands();
      }

      return;
    }

    this.sendCommandInstantToPTZ(currentParameter.command);
    currentParameter.wasSent = true;

    // increase the current index to the next parameter
    this.currentParameterIndex =
      (this.currentParameterIndex + 1) % Object.keys(this.parameter).length;

    // Reset the number of attempts in one interval
    this.maxCommadSendAttempts = Object.keys(this.parameter).length;
  }

  setPanTiltSpeed(pan: number, tilt: number) {
    if (pan < -100 || pan > 100) {
      console.log('Pan speed is out of range (-100 to 100). Value: ' + pan);
      return;
    }
    if (tilt < -100 || tilt > 100) {
      console.log('Tilt speed is out of range (-100 to 100). Value: ' + tilt);
      return;
    }

    // conversion to panasonic scale 01-99
    const panasonic_pan = (0.49 * pan + 50)
      .toFixed()
      .toString()
      .padStart(2, '0');
    const panasonic_tilt = (0.49 * tilt + 50)
      .toFixed()
      .toString()
      .padStart(2, '0');
    const command = 'PTS' + panasonic_pan + panasonic_tilt;

    this.parameter.panTiltSpeed.command = command;
    this.parameter.panTiltSpeed.wasSent = false;
    this.parameter.panTiltSpeed.value.pan = pan;
    this.parameter.panTiltSpeed.value.tilt = tilt;
  }

  setZoomSpeed(speed: number) {
    if (speed < -100 || speed > 100) {
      console.log('Zoom speed is out of range (-100 to 100). Value: ' + speed);
      return;
    }

    // conversion to panasonic scale 01-99
    const panasonic_zoom = (0.49 * speed + 50)
      .toFixed()
      .toString()
      .padStart(2, '0');
    const command = 'Z' + panasonic_zoom;
    console.log(command);

    // return this.sendCommandToPTZ('zoomSpeed', command, false);
    this.parameter.zoomSpeed.command = command;
    this.parameter.zoomSpeed.wasSent = false;
    this.parameter.zoomSpeed.value = speed;
  }

  setAutoFocus(status: boolean) {
    const command = 'D1' + status ? '0' : '1';

    this.parameter.autoFocus.command = command;
    this.parameter.autoFocus.wasSent = false;
    this.parameter.autoFocus.value = status;
  }

  setFocusSpeed(speed: number) {
    if (speed < -100 || speed > 100) {
      console.log('Focus speed is out of range (-100 to 100). Value: ' + speed);
      return;
    }

    // conversion to panasonic scale 01-99
    const panasonic_focus = (0.49 * speed + 50)
      .toFixed()
      .toString()
      .padStart(2, '0');
    const command = 'Z' + panasonic_focus;

    this.parameter.focusSpeed.command = command;
    this.parameter.focusSpeed.wasSent = false;
    this.parameter.focusSpeed.value = speed;
  }

  setAutoIris(status: boolean) {
    const command = 'D3' + status ? '0' : '1';

    this.parameter.autoIris.command = command;
    this.parameter.autoIris.wasSent = false;
    this.parameter.autoIris.value = status;
  }

  stepIris(direction: 'up' | 'down', stepSize: number) {
    let newIrisValue;

    if (direction === 'down') {
      newIrisValue = this.previousHexStep(
        this.parameter.iris.value,
        stepSize,
        this.irisMin,
        this.irisMax
      );
    }

    if (direction === 'up') {
      newIrisValue = this.nextHexStep(
        this.parameter.iris.value,
        stepSize,
        this.irisMin,
        this.irisMax
      );
    }

    newIrisValue = newIrisValue?.toUpperCase();

    console.log('newIrisValue: ' + newIrisValue);

    const command = 'AXI' + newIrisValue;

    this.parameter.iris.command = command;
    this.parameter.iris.wasSent = false;
    this.parameter.iris.value = newIrisValue ? newIrisValue : '';
  }

  playbackPreset(presetNumber: number) {
    if (presetNumber < 0 || presetNumber > 99) {
      console.log(
        'Focus presetNumber is out of range (-100 to 100). Value: ' +
          presetNumber
      );
      return;
    }
    const command = 'R' + presetNumber;

    this.parameter.preset.command = command;
    this.parameter.preset.wasSent = false;
    this.parameter.preset.value = presetNumber;
  }

  private async sendCommandInstantToPTZ(
    command: string
  ): Promise<string | undefined> {
    const url =
      'http://' + this.ip + '/cgi-bin/aw_ptz?cmd=%23' + command + '&res=1';
    console.log(url);
    try {
      const data = await axios.get(url, {timeout: 500});
      return data.data;
    } catch (err) {
      const error = err as Error | AxiosError;
      console.log(
        'Error sending command to camera: ' + error.message + ' ' + url
      );
      return;
    }
  }

  private fetchCurrentParametes(): Promise<void> {
    console.log('-- current camera paramters --');
    const promises: Promise<void>[] = [];
    // iris
    promises[0] = new Promise((resolve, reject) => {
      this.sendCommandInstantToPTZ('AXI').then(response => {
        // extract value command
        const currentIrisValue = response?.replace('axi', '');
        this.parameter.iris.value = currentIrisValue ? currentIrisValue : '';

        // check if value present
        if (!currentIrisValue) {
          console.log('Could not read current Iris value.');

          reject();
          return;
        }
        console.log('currentIrisValue: ' + currentIrisValue);
        resolve();
      });
    });

    // @ToDo: add the other paramters

    return new Promise(resolve => {
      Promise.all(promises)
        .then(() => {
          // all promises are resolved successfully
          resolve();
        })
        .catch(() => {
          // retry to fetch camera parameters because a parameter cannot be fetched before.
          setTimeout(() => {
            this.fetchCurrentParametes().then(() => {
              resolve();
            });
          }, 3000);
        });
    });
  }

  private hexToNumber(hex: string): number {
    return parseInt(hex, 16);
  }

  private numberToHex(number: number): string {
    return number.toString(16);
  }

  private nextHexStep(
    hex: string,
    step: number,
    min: number,
    max: number
  ): string {
    let number = this.hexToNumber(hex);
    number = number + step;
    if (number < min || number > max) {
      console.log('Hex value out of range');
      number = max;
    }
    return this.numberToHex(number);
  }

  private previousHexStep(
    hex: string,
    step: number,
    min: number,
    max: number
  ): string {
    let number = this.hexToNumber(hex);
    number = number - step;
    if (number < min || number > max) {
      console.log('Hex value out of range');
      number = min;
    }
    return this.numberToHex(number);
  }
}
