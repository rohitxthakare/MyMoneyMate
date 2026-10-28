const { TextEncoder, TextDecoder } = require("node:util");

const {
  TransformStream,
  ReadableStream,
  WritableStream,
} = require("node:stream/web");

const JSDOMEnvironment =
  require("jest-environment-jsdom").TestEnvironment;

class CustomJSDOMEnvironment extends JSDOMEnvironment {
  async setup() {
    await super.setup();

    Object.assign(this.global, {
      TextEncoder,
      TextDecoder,
      TransformStream,
      ReadableStream,
      WritableStream,
      BroadcastChannel: globalThis.BroadcastChannel,
      fetch: globalThis.fetch,
      Request: globalThis.Request,
      Response: globalThis.Response,
      Headers: globalThis.Headers,
      FormData: globalThis.FormData,
      AbortController: globalThis.AbortController,
      AbortSignal: globalThis.AbortSignal,
    });
  }
}

module.exports = CustomJSDOMEnvironment;