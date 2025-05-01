import { DEFAULT_KEY_MAPPING, STORAGE_CONFIG } from './config.js';

export class KeyHandler {
  constructor(onKeyStateChange) {
    this.keyState = 0;
    this.lastKeyState = 0;
    this.onKeyStateChange = onKeyStateChange;
    this.keyMappings = this.loadKeyMappings();
    this.pressedKeys = new Set();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  init() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  loadKeyMappings() {
    const stored = localStorage.getItem(STORAGE_CONFIG.KEY_MAPPINGS);
    return stored ? JSON.parse(stored) : { ...DEFAULT_KEY_MAPPING };
  }

  saveKeyMappings() {
    localStorage.setItem(STORAGE_CONFIG.KEY_MAPPINGS, JSON.stringify(this.keyMappings));
  }

  updateKeyMapping(button, code) {
    this.keyMappings[button].code = code;
    this.saveKeyMappings();
  }

  resetKeyMappings() {
    this.keyMappings = { ...DEFAULT_KEY_MAPPING };
    this.saveKeyMappings();
  }

  getMaskForKey(code) {
    for (const [_, mapping] of Object.entries(this.keyMappings)) {
      if (mapping.code === code) {
        return mapping.mask;
      }
    }
    return 0;
  }

  handleKeyDown(event) {
    const mask = this.getMaskForKey(event.code);
    if (mask) {
      event.preventDefault();
      this.pressedKeys.add(event.code);
      this.updateKeyState();
    }
  }

  handleKeyUp(event) {
    const mask = this.getMaskForKey(event.code);
    if (mask) {
      event.preventDefault();
      this.pressedKeys.delete(event.code);
      this.updateKeyState();
    }
  }

  updateKeyState() {
    let newState = 0;
    for (const code of this.pressedKeys) {
      newState |= this.getMaskForKey(code);
    }

    if (newState !== this.keyState) {
      this.keyState = newState;
      if (typeof this.onKeyStateChange === 'function') {
        this.onKeyStateChange(this.keyState);
      }
    }
  }

  getCurrentState() {
    return this.keyState;
  }

  getKeyMappings() {
    return this.keyMappings;
  }
} 