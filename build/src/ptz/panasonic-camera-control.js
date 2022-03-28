"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios');
class PanasonicCameraControl {
    constructor(ip) {
        this.irisMin = 1366;
        this.irisMax = 4094;
        this.ip = ip;
    }
    setPanTiltSpeed(pan, tilt) {
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
    setZoomSpeed(speed) {
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
    setAutoFocus(status) {
        const command = 'D1' + status ? '0' : '1';
        this.sendCommandToPTZ(command);
    }
    setFocusSpeed(speed) {
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
    setAutoIris(status) {
        const command = 'D3' + status ? '0' : '1';
        this.sendCommandToPTZ(command);
    }
    stepIris(direction, stepSize) {
        const get_command = 'AXI';
        this.sendCommandToPTZ(get_command).then(response => {
            // extract value command
            const currentIrisValue = response === null || response === void 0 ? void 0 : response.replace('axi', '');
            console.log('currentIrisValue: ' + currentIrisValue);
            // check if value present
            if (!currentIrisValue) {
                console.log('Could not read current Iris value.');
                return;
            }
            let newIrisValue;
            if (direction === 'down') {
                newIrisValue = this.previousHexStep(currentIrisValue, stepSize, this.irisMin, this.irisMax);
            }
            if (direction === 'up') {
                newIrisValue = this.nextHexStep(currentIrisValue, stepSize, this.irisMin, this.irisMax);
            }
            newIrisValue = newIrisValue === null || newIrisValue === void 0 ? void 0 : newIrisValue.toUpperCase();
            console.log('newIrisValue: ' + newIrisValue);
            const command = 'AXI' + newIrisValue;
            this.sendCommandToPTZ(command);
        });
    }
    playbackPreset(presetNumber) {
        if (presetNumber < 0 || presetNumber > 99) {
            console.log('Focus presetNumber is out of range (-100 to 100). Value: ' +
                presetNumber);
        }
        const command = 'R' + presetNumber;
        this.sendCommandToPTZ(command);
    }
    async sendCommandToPTZ(command) {
        try {
            const data = await axios.get('http://' + this.ip + '/cgi-bin/aw_ptz?cmd=%23' + command + '&res=1');
            return data.data;
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    hexToNumber(hex) {
        return parseInt(hex, 16);
    }
    numberToHex(number) {
        return number.toString(16);
    }
    nextHexStep(hex, step, min, max) {
        let number = this.hexToNumber(hex);
        number = number + step;
        if (number < min || number > max) {
            console.log('Hex value out of range');
            number = max;
        }
        return this.numberToHex(number + step);
    }
    previousHexStep(hex, step, min, max) {
        let number = this.hexToNumber(hex);
        number = number - step;
        if (number < min || number > max) {
            console.log('Hex value out of range');
            number = min;
        }
        return this.numberToHex(number - step);
    }
}
exports.default = PanasonicCameraControl;
