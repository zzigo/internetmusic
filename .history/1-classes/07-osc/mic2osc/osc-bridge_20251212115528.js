/*
  OSC bridge (Bun):
  - Receives WebSocket JSON messages from the browser.
  - Emits OSC over UDP to TouchDesigner.

  TouchDesigner expects OSC over UDP (OSC In CHOP / OSC Out CHOP).  [oai_citation:3‡Derivative](https://derivative.ca/UserGuide/OSC_In_CHOP?utm_source=chatgpt.com)
  Bun WebSocket server uses Bun.serve().  [oai_citation:4‡bun.com](https://bun.com/docs/runtime/http/websockets?utm_source=chatgpt.com)
  osc.js UDPPort handles OSC packing + UDP send.  [oai_citation:5‡npm](https://www.npmjs.com/package/osc?activeTab=readme&utm_source=chatgpt.com)
*/

import * as osc from "osc";

const WS_PORT = Number(process.env.WS_PORT ?? 57121);

// TouchDesigner machine + port (OSC In CHOP “Network Port”)
const TD_HOST = process.env.TD_HOST ?? "127.0.0.1";
const TD_PORT = Number(process.env.TD_PORT ?? 9000);

// UDP port for sending OSC to TouchDesigner
const udp = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 0, // let OS pick
  remoteAddress: TD_HOST,
  remotePort: TD_PORT,
  metadata: true
});

udp.open();

udp.on("ready", () => {
  console.log(`OSC UDP ready → ${TD_HOST}:${TD_PORT}`);
  console.log(`WebSocket listening on ws://localhost:${WS_PORT}`);
});

function sendToTD({ address, v01, db }) {
  // Send main value
  udp.send({
    address: address ?? "/mic/level",
    args: [{ type: "f", value: Number(v01) }]
  });

  // Optional second channel for debugging in TD
  udp.send({
    address: "/mic/db",
    args: [{ type: "f", value: Number(db) }]
  });
}

Bun.serve({
  port: WS_PORT,

  fetch(req, server) {
    // Upgrade all requests to WebSocket
    const ok = server.upgrade(req);
    if (ok) return;

    return new Response("OSC bridge running.\n", { status: 200 });
  },

  websocket: {
    open(ws) {
      ws.send(JSON.stringify({ ok: true, msg: "bridge connected" }));
    },

    message(ws, message) {
      try {
        const data = JSON.parse(message.toString());

        // Expecting { address, v01, db }
        sendToTD(data);
      } catch (err) {
        ws.send(JSON.stringify({ ok: false, error: "bad json" }));
      }
    }
  }
});