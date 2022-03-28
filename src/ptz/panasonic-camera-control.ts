const axios = require('axios');

export default class PanasonicCameraControl implements PTZ {
  constructor(ip: string) {
    this.ip = ip;
  }
  ip: string;
  private irisMin = 1366;
  private irisMax = 4094;

  setPanTiltSpeed(pan: number, tilt: number) {
    if (pan < -100 || pan > 100) {
      console.log('Pan speed is out of range (-100 to 100). Value: ' + pan);
    }
    if (tilt < -100 || tilt > 100) {
      console.log('Tilt speed is out of range (-100 to 100). Value: ' + tilt);
    }

    // conversion to panasonic scale 0-99
    const panasonic_pan = (0.495 * pan + 49.67)
      .toFixed()
      .toString()
      .padStart(2, '0');
    const panasonic_tilt = (0.495 * pan + 49.67)
      .toFixed()
      .toString()
      .padStart(2, '0');
    const command = 'PTS' + panasonic_pan + panasonic_tilt;

    return this.sendCommandToPTZ(command);
  }

  setZoomSpeed(speed: number) {
    if (speed < -100 || speed > 100) {
      console.log('Zoom speed is out of range (-100 to 100). Value: ' + speed);
    }

    // conversion to panasonic scale 0-99
    const panasonic_zoom = (0.495 * speed + 49.67)
      .toFixed()
      .toString()
      .padStart(2, '0');
    const command = 'Z' + panasonic_zoom;

    return this.sendCommandToPTZ(command);
  }

  setAutoFocus(status: boolean) {
    const command = 'D1' + status ? '0' : '1';
    this.sendCommandToPTZ(command);
  }

  setFocusSpeed(speed: number) {
    if (speed < -100 || speed > 100) {
      console.log('Focus speed is out of range (-100 to 100). Value: ' + speed);
    }

    // conversion to panasonic scale 0-99
    const panasonic_focus = (0.495 * speed + 49.67)
      .toFixed()
      .toString()
      .padStart(2, '0');
    const command = 'Z' + panasonic_focus;

    return this.sendCommandToPTZ(command);
  }

  setAutoIris(status: boolean) {
    const command = 'D3' + status ? '0' : '1';
    this.sendCommandToPTZ(command);
  }

  stepIris(direction: 'up' | 'down', stepSize: number) {
    const get_command = 'AXI';
    this.sendCommandToPTZ(get_command).then(response => {
      // extract value command
      const currentIrisValue = response?.replace('axi', '');
      console.log('currentIrisValue: ' + currentIrisValue);

      // check if value present
      if (!currentIrisValue) {
        console.log('Could not read current Iris value.');
        return;
      }

      let newIrisValue;

      if (direction === 'down') {
        newIrisValue = this.previousHexStep(
          currentIrisValue,
          stepSize,
          this.irisMin,
          this.irisMax
        );
      }

      if (direction === 'up') {
        newIrisValue = this.nextHexStep(
          currentIrisValue,
          stepSize,
          this.irisMin,
          this.irisMax
        );
      }

      newIrisValue = newIrisValue?.toUpperCase();

      console.log('newIrisValue: ' + newIrisValue);

      const command = 'AXI' + newIrisValue;
      this.sendCommandToPTZ(command);
    });
  }

  playbackPreset(presetNumber: number) {
    if (presetNumber < 0 || presetNumber > 99) {
      console.log(
        'Focus presetNumber is out of range (-100 to 100). Value: ' +
          presetNumber
      );
    }
    const command = 'R' + presetNumber;
    this.sendCommandToPTZ(command);
  }

  private async sendCommandToPTZ(command: string): Promise<string | undefined> {
    try {
      const data = await axios.get(
        'http://' + this.ip + '/cgi-bin/aw_ptz?cmd=%23' + command + '&res=1'
      );
      return data.data;
    } catch (error) {
      console.log(error);
      return;
    }
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
    return this.numberToHex(number + step);
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
    return this.numberToHex(number - step);
  }
}
