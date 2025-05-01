# Galagino Serial Joystick

A web interface for controlling a joystick through serial communication, specifically designed for use with the Galagino emulator.

https://fedekrum.github.io/Galagino-Serial-Joystick/

## Features

- **Intuitive User Interface**

  - Real-time joystick state visualization
  - Connection status indicator
  - Accessible settings panel
  - Current key state display

- **Key Configuration**

  - Customizable key mapping for each button
  - Automatic configuration saving in browser
  - Option to reset to default settings
  - Visual interface for key assignment

- **Serial Communication**

  - Support for multiple baud rates (1200 to 921600)
  - Automatic reconnection to previous port
  - Robust connection error handling
  - Visual connection status indicators

- **Data Optimization**
  - Efficient transmission using a single byte for all button states
  - Updates only when key states change
  - Non-blocking asynchronous communication
  - Efficient resource management

## Default Key Configuration

- **Directional Pad**

  - Left: Left Arrow
  - Right: Right Arrow
  - Up: Up Arrow
  - Down: Down Arrow

- **Buttons**
  - A: A Key
  - B: S Key
  - Select: 5 Key
  - Start: 1 Key

## Requirements

- Chromium-based browser (Chrome, Edge, or Opera)
- Available serial port
- Web Serial API compatible device

## Installation

1. Clone this repository
2. Open `index.html` in a compatible browser
3. Connect your serial device
4. Select the port and baud rate
5. Ready to use!

## Usage

1. Click the port selection button
2. Choose your device's serial port
3. Adjust baud rate if necessary
4. Use the configured keys to control the joystick
5. To change key configuration, click the settings icon

## Project Structure

- `index.html` - Main user interface
- `assets/`
  - `pad.svg` - Joystick graphics
- `css/`
  - `style.css` - Interface styles
- `js/`
  - `config.js` - Configurations and constants
  - `keyhandler.js` - Keyboard input handler
  - `serial.js` - Serial communication
  - `ui.js` - User interface

## Technical Notes

- Joystick state is transmitted as a single byte where each bit represents a button
- Configurations are saved in browser's local storage
- Interface is optimized for smooth user experience
- Full support for device connection/disconnection events

## License

This project is licensed under the MIT License. See the LICENSE file for details.
