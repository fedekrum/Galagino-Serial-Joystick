import { SERIAL_CONFIG, UI_TEXTS } from './config.js';

export class UI {
  constructor() {
    this.elements = {
      portInfo: document.getElementById('portInfo'),
      btnConnect: document.getElementById('btnConnect'),
      btnRequestPermission: document.getElementById('btnRequestPermission'),
      keyStateDisplay: document.getElementById('keyState'),
      settingsDialog: document.getElementById('settingsDialog'),
      btnSettings: document.getElementById('btnSettings'),
      btnCloseSettings: document.getElementById('btnCloseSettings'),
      selBaud: document.getElementById('selBaud'),
      svgContainer: document.getElementById('svg-container')
    };
    this.isConnected = false;
    this.currentCapture = null;
    this.svgLoaded = false;

    // Load SVG
    this.loadSVG();
  }

  async loadSVG() {
    try {
      const response = await fetch('assets/pad.svg');
      const svg = await response.text();
      this.elements.svgContainer.innerHTML = svg;
      this.svgLoaded = true;

      // Initialize elements that depend on SVG
      this.elements.disconnectedIndicator = document.querySelector('#disconnected');
    } catch (error) {
      console.error('Error loading SVG:', error);
    }
  }

  updatePortInfo(info) {
    if (!info) {
      this.elements.portInfo.textContent = UI_TEXTS.NO_PORT;
      return;
    }
    this.elements.portInfo.textContent = `Port ${info.usbVendorId ? `VID:${info.usbVendorId}` : ''} ${info.usbProductId ? `PID:${info.usbProductId}` : ''}`.trim();
  }

  updateConnectionState(isConnected) {
    this.isConnected = isConnected;

    // Toggle button style and color
    const btnConnect = this.elements.btnConnect;
    if (isConnected) {
      btnConnect.classList.remove('bg-green-500', 'hover:bg-green-600');
      btnConnect.classList.add('bg-red-500', 'hover:bg-red-600');
    } else {
      btnConnect.classList.remove('bg-red-500', 'hover:bg-red-600');
      btnConnect.classList.add('bg-green-500', 'hover:bg-green-600');
    }

    // Toggle icons
    btnConnect.querySelector('.connect-icon').classList.toggle('hidden', isConnected);
    btnConnect.querySelector('.disconnect-icon').classList.toggle('hidden', !isConnected);

    this.elements.btnRequestPermission.disabled = isConnected;

    // Update disconnected indicator
    if (this.svgLoaded) {
      const disconnectedIndicator = document.querySelector('#disconnected');
      if (disconnectedIndicator) {
        disconnectedIndicator.style.display = isConnected ? 'none' : 'block';
      }
    }

    // Reset visual state when disconnected
    if (!isConnected) {
      this.updateKeyState(0);
      this.elements.keyStateDisplay.textContent = '';
    }
  }

  updateKeyState(state) {
    if (!this.isConnected) return;

    this.elements.keyStateDisplay.textContent = `KeyState: ${state}`;
    this.updateSvgColors(state);
  }

  updateSvgColors(state) {
    if (!this.isConnected) {
      // Reset all buttons to white when disconnected
      const elements = ['left', 'right', 'up', 'down', 'a', 'b', 'select', 'start'];
      elements.forEach(id => {
        const element = document.querySelector(`#${id} .cls-1`);
        if (element) {
          element.style.fill = '#fff';
        }
      });
      return;
    }

    const elements = {
      left: 0x01,
      right: 0x02,
      up: 0x04,
      down: 0x08,
      a: 0x10,
      b: 0x20,
      select: 0x40,
      start: 0x80
    };

    for (const [id, mask] of Object.entries(elements)) {
      const element = document.querySelector(`#${id} .cls-1`);
      if (element) {
        element.style.fill = (state & mask) ? 'red' : '#fff';
      }
    }
  }

  setError(message) {
    this.elements.portInfo.textContent = message;
  }

  enableConnectButton(enabled) {
    this.elements.btnConnect.disabled = !enabled;
  }

  getBaudRate() {
    return parseInt(this.elements.selBaud.value);
  }

  initSettingsHandlers(onSettingsChange, keyHandler) {
    this.elements.btnSettings.onclick = async () => {
      this.elements.settingsDialog.showModal();
    };
    this.elements.btnCloseSettings.onclick = () => this.elements.settingsDialog.close();
    this.elements.selBaud.onchange = () => onSettingsChange(this.getBaudRate());

    // Key mapping functionality
    const keyMappingsContainer = document.getElementById('keyMappings');
    const template = document.getElementById('keyMappingTemplate');
    const keyCaptureModal = document.getElementById('keyCaptureModal');
    const captureTitle = document.getElementById('captureTitle');
    const captureKey = document.getElementById('captureKey');
    const btnCancelCapture = document.getElementById('btnCancelCapture');
    const btnResetKeys = document.getElementById('btnResetKeys');

    // Store references for use in methods
    this.keyHandler = keyHandler;
    this.keyCaptureModal = keyCaptureModal;
    this.captureTitle = captureTitle;
    this.captureKey = captureKey;

    // Reset key mappings
    btnResetKeys.onclick = () => {
      keyHandler.resetKeyMappings();
      this.updateKeyMappingDisplay(keyHandler.getKeyMappings());
    };

    // Initialize key mapping display
    this.updateKeyMappingDisplay(keyHandler.getKeyMappings());

    // Key capture handling
    this.keyCapture = (e) => {
      e.preventDefault();
      if (e.code === 'Escape') {
        this.stopCapture();
        return;
      }
      if (this.currentCapture) {
        this.keyHandler.updateKeyMapping(this.currentCapture, e.code);
        this.updateKeyMappingDisplay(this.keyHandler.getKeyMappings());
        this.stopCapture();
      }
    };

    btnCancelCapture.onclick = () => this.stopCapture();
  }

  startCapture(button) {
    this.currentCapture = button;
    this.keyCaptureModal.classList.remove('hidden');
    this.captureTitle.textContent = `Press a key for ${this.keyHandler.getKeyMappings()[button].label}`;
    this.captureKey.textContent = 'Waiting for input...';
    document.addEventListener('keydown', this.keyCapture.bind(this));
  }

  stopCapture() {
    this.currentCapture = null;
    this.keyCaptureModal.classList.add('hidden');
    document.removeEventListener('keydown', this.keyCapture);
  }

  updateKeyMappingDisplay(mappings) {
    const container = document.getElementById('keyMappings');
    const template = document.getElementById('keyMappingTemplate');
    container.innerHTML = '';

    // Define the order of keys
    const keyOrder = ['up', 'down', 'left', 'right', 'a', 'b', 'select', 'start'];

    // Create elements in the specified order
    keyOrder.forEach(button => {
      const mapping = mappings[button];
      const element = template.content.cloneNode(true);
      const row = element.querySelector('div');
      row.dataset.button = button;

      row.querySelector('span').textContent = mapping.label;
      row.querySelector('code').textContent = this.getKeyDisplayName(mapping.code);

      row.querySelector('.change-key-btn').onclick = () => {
        this.startCapture(button);
      };

      container.appendChild(element);
    });
  }

  getKeyDisplayName(code) {
    // Convert key codes to friendly names
    const keyNames = {
      'ArrowLeft': '←',
      'ArrowRight': '→',
      'ArrowUp': '↑',
      'ArrowDown': '↓',
      'Space': 'Space',
      'Enter': 'Enter',
      'Escape': 'Esc'
    };

    if (code.startsWith('Key')) {
      return code.slice(3);
    }
    if (code.startsWith('Digit')) {
      return code.slice(5);
    }
    return keyNames[code] || code;
  }
} 