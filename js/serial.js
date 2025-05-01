import { UI_TEXTS } from './config.js';

export class SerialHandler {
  constructor(onConnectionChange, onDataReceived) {
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.isConnected = false;
    this.onConnectionChange = onConnectionChange;
    this.onDataReceived = onDataReceived;
  }

  async requestPort() {
    try {
      this.port = await navigator.serial.requestPort();
      return {
        success: true,
        port: this.port
      };
    } catch (e) {
      console.error('Permission request error:', e);
      return {
        success: false,
        error: e
      };
    }
  }

  async connect(baudRate) {
    if (!this.port) {
      throw new Error(UI_TEXTS.NO_PORT);
    }

    try {
      await this.port.open({ baudRate });
      this.writer = this.port.writable.getWriter();
      this.reader = this.port.readable.getReader();
      this.isConnected = true;
      this.onConnectionChange(true);
      this.startReading();
    } catch (e) {
      console.error('Connection error:', e);
      throw e;
    }
  }

  async disconnect() {
    try {
      if (this.reader) {
        await this.reader.cancel();
        this.reader = null;
      }
      if (this.writer) {
        await this.writer.close();
        this.writer = null;
      }
      if (this.port) {
        await this.port.close();
      }
      this.isConnected = false;
      this.onConnectionChange(false);
    } catch (e) {
      console.error('Disconnection error:', e);
      throw e;
    }
  }

  async write(data) {
    if (!this.writer) return;

    try {
      await this.writer.write(data);
    } catch (e) {
      console.error('Write error:', e);
      throw e;
    }
  }

  /**
   * Envía el estado de las teclas como un solo byte.
   * @param {number} state - Máscara de bits de estado de teclas.
   */
  sendKeyState(state) {
    this.write(Uint8Array.of(state));
  }

  async startReading() {
    while (this.isConnected) {
      try {
        const { value, done } = await this.reader.read();
        if (done) break;

        if (value) {
          const values = Array.from(value);
          this.onDataReceived(values);
        }
      } catch (e) {
        console.error('Read error:', e);
        break;
      }
    }
  }

  static async getAvailablePorts() {
    return await navigator.serial.getPorts();
  }
} 