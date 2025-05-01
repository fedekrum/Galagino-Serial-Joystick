// Default key mapping configuration
export const DEFAULT_KEY_MAPPING = {
  left: { code: 'ArrowLeft', mask: 0x01, label: 'Left' },
  right: { code: 'ArrowRight', mask: 0x02, label: 'Right' },
  up: { code: 'ArrowUp', mask: 0x04, label: 'Up' },
  down: { code: 'ArrowDown', mask: 0x08, label: 'Down' },
  a: { code: 'KeyA', mask: 0x10, label: 'Button A' },
  b: { code: 'KeyS', mask: 0x20, label: 'Button B' },
  select: { code: 'Digit5', mask: 0x40, label: 'Select' },
  start: { code: 'Digit1', mask: 0x80, label: 'Start' }
};

// Storage configuration
export const STORAGE_CONFIG = {
  KEY_MAPPINGS: 'galagino_key_mappings'
};

// Serial configuration
export const SERIAL_CONFIG = {
  BAUD_RATES: [
    1200, 2400, 4800, 9600, 19200,
    38400, 57600, 115200, 230400,
    460800, 921600
  ]
};

// UI text configuration
export const UI_TEXTS = {
  NO_PORT: 'No port selected',
  CONNECT: 'Connect',
  DISCONNECT: 'Disconnect',
  DEVICE_DISCONNECTED: 'Device disconnected',
  CONNECTION_ERROR: 'Connection error',
  WRITE_ERROR: 'Write error',
  PRESS_KEY: 'Press any key...'
}; 