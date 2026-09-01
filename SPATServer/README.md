# SPAT WebSocket Replay Server

A Node.js WebSocket server that replays SPAT data from a JSON file and sends packets sequentially to all connected WebSocket clients.

## Requirements

- Node.js 16+ recommended
- npm
- `ws` package

## Project Structure

```text
SPATSERVER/
├── spat-ws-server.js
├── mock-spat-data-10s/mock-spat-10s.json
├── package.json
└── README.md
```

> If your SPAT data file has a different name, use the `--file=...` argument when starting the server.

## Installation

Initialize a Node.js project:

```bash
npm init -y
```

## Start the Server

Run the server with the default configuration:

```bash
node spat-ws-server.js
```
or

```bash
npm start
```
or

```bash
npm run start:loop
```
or

```bash
npm run start:10hz
```
or

```bash
npm run start:1hz
```

Default configuration:

```text
port     = 8081
interval = 1000 ms
file     = mock-spat-10.json
loop     = false
```

Default WebSocket endpoint:

```text
ws://localhost:8081
```

## Replay One Message per Second

By default, the server sends one SPAT packet every 1000 ms:

```bash
node spat-ws-server.js --interval=1000
```

The first packet is sent immediately when playback starts. The following packets are sent using the configured interval.

## Enable Loop Playback

To restart from the first packet after the last packet has been sent:

```bash
node spat-ws-server.js loop=true
```

You can also use:

```bash
node spat-ws-server.js --loop=true
```

Full example:

```bash
node spat-ws-server.js --file=mock-spat-data-10s/mock-spat-10s.json --port=8081 --interval=1000 --loop=true
```

When `loop=false`, playback stops after the last packet, but the WebSocket server remains running.

When `loop=true`, playback behaves like this:

```text
packet 1
packet 2
...
packet N
packet 1
packet 2
...
```

## Supported Arguments

| Argument | Default | Description |
|---|---:|---|
| `--file` | `mock-spat-10.json` | JSON file containing the SPAT packet array |
| `--port` | `8081` | WebSocket server port |
| `--interval` | `1000` | Delay between messages in milliseconds |
| `--loop` | `false` | Restart playback from the beginning after the last packet |

Both of these forms are supported:

```bash
node spat-ws-server.js --loop=true
```

and:

```bash
node spat-ws-server.js loop=true
```

## Use a Different SPAT File

For example, if your file is named:

```text
mock-spat-10s.json
```

run:

```bash
node spat-ws-server.js --file=mock-spat-10s.json --loop=true
```

## Replay at 10 Hz

If the dataset was generated at 10 Hz and you want to replay it at its original rate, use a 100 ms interval:

```bash
node spat-ws-server.js --interval=100 --loop=true
```

This sends:

```text
10 messages per second
```

For slower UI testing, use:

```bash
node spat-ws-server.js --interval=1000 --loop=true
```

This sends:

```text
1 message per second
```

## Test from a Browser

Open the browser Developer Tools Console and run:

```javascript
const ws = new WebSocket("ws://localhost:8081");

ws.onopen = () => {
    console.log("WebSocket connected");
};

ws.onmessage = event => {
    const message = JSON.parse(event.data);

    console.log("SPAT message:", message);
};

ws.onerror = error => {
    console.error("WebSocket error:", error);
};

ws.onclose = () => {
    console.log("WebSocket disconnected");
};
```

Once the client connects, the server starts replaying SPAT packets.

## Test with a Node.js Client

Create a file named:

```text
spat-ws-client.js
```

with the following content:

```javascript
const WebSocket = require("ws");

const ws = new WebSocket(
    "ws://localhost:8081"
);

ws.on("open", () => {
    console.log("Connected to SPAT server");
});

ws.on("message", data => {
    const message = JSON.parse(
        data.toString()
    );

    console.log(
        "Received:",
        message
    );
});

ws.on("close", () => {
    console.log("Disconnected");
});

ws.on("error", error => {
    console.error(
        "WebSocket error:",
        error.message
    );
});
```

Run the client:

```bash
node spat-ws-client.js
```

## Server Output

When the server starts, the output should look similar to:

```text
==========================================
SPAT WebSocket Replay Server
==========================================
WebSocket: ws://localhost:8081
File:      /path/to/mock-spat-10.json
Packets:   100
Interval:  1000 ms
Loop:      true
Waiting for WebSocket client...
==========================================
```

During playback:

```text
[SPAT] packet=1/100 frame=0 sourceTime=0s clients=1
[SPAT] packet=2/100 frame=1 sourceTime=0.1s clients=1
[SPAT] packet=3/100 frame=2 sourceTime=0.2s clients=1
```

When the end of the file is reached and `loop=true`:

```text
End of SPAT file -> loop to beginning
```

When the end of the file is reached and `loop=false`:

```text
SPAT playback finished
```

## Stop the Server

Press:

```text
Ctrl + C
```

The server will stop the playback timer, close connected WebSocket clients, and shut down.

## Notes

- The root value of the JSON file must be an array.
- Each array element is sent as one JSON WebSocket message.
- The same packet is broadcast to all connected clients.
- Playback starts when the first WebSocket client connects.
- If no client is connected, playback does not advance.
- `--interval=1000` means 1 message per second.
- `--interval=100` means 10 messages per second.
