# Pan-Tilt-Zoom camera control app for gamepads
This app allows to steer PTZ cameras with controllers like gamepads and joysticks.

## Compatible cameras and gamepads
1. PTZ cameras:
   - Panasonic AW-UN14
   - Panasonic AW-UE150
   - Panasonic AK-UB300
   - Panasonic AW-HR140
   - Panasonic AW-UE70
   - Panasonic AW-HE40
   - Panasonic AW-HE42
   - Panasonic AW-HE50
   - Panasonic AW-HE60
   - Panasonic AW-HE120
   - Panasonic AW-HE130
2. Gamepads
   1. XBOX Wireless Gamepad

# Getting started
1. Install SDL2 as described in the [Readme of SDL2 package](https://github.com/IBM/sdl2-gamecontroller)

For Linux **Ubuntu**:

```sh
sudo apt install -y build-essential cmake libsdl2-dev
```

2. Copy the demo configuration file to your own configuration file:
```
cp config/default.demo.ts config/default.ts
```  
4. Edit your `config/default.ts` file according to the demo file and your configuration.
5. Install dependencies with
```
npm install
```  
5. Start application
```
npm run start
```

## Setup on pine64
1. Install [latest Armbian](https://wiki.pine64.org/index.php/Pine_A64_Software_Release) ubuntu via balenaEtcher
2. Install Node Version Manager
```
sudo apt install curl 
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.profile
nvm install node
```
4. Install PM2
```
npm install pm2@latest -g

```
6. Configure XBox Controller
  ```
  # Install driver
  sudo apt-get install xboxdrv
  # If ERTM is enabled, the controller won't pair with the Pi. To disable the ERTM, run the following command: 
  echo 'options bluetooth disable_ertm=Y' | sudo tee -a /etc/modprobe.d/bluetooth.conf
  ```
