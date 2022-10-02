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

2. Copy the `config/default.demo.ts` file and rename it to `config/default.ts`.
3. Edit your `config/default.ts` file according to the demo file and your configuration.
4. Install xone as described [here](https://github.com/medusalix/xone)
5. Install dependencies with
```
npm install
```  
5. Start application
```
npm run start
```
