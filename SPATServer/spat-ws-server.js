const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");


// =====================================================
// DEFAULT CONFIG
// =====================================================

const DEFAULT_PORT = 8081;

const DEFAULT_INTERVAL_MS = 1000;

const DEFAULT_FILE =
    "mock-spat-data-10s/mock-spat-10s.json";


// =====================================================
// COMMAND LINE ARGUMENTS
//
// Supported:
//
// node spat-ws-server.js
//
// node spat-ws-server.js loop=true
//
// node spat-ws-server.js --loop=true
//
// node spat-ws-server.js --port=8081
//
// node spat-ws-server.js --file=mock-spat-10.json
//
// node spat-ws-server.js --interval=1000
//
// Example:
//
// node spat-ws-server.js \
//     --file=mock-spat-10.json \
//     --port=8081 \
//     --interval=1000 \
//     --loop=true
// =====================================================

function parseArguments() {

    const args = {
        port: DEFAULT_PORT,
        interval: DEFAULT_INTERVAL_MS,
        file: DEFAULT_FILE,
        loop: false
    };


    process.argv
        .slice(2)
        .forEach(argument => {

            const normalized =
                argument.startsWith("--")
                    ? argument.substring(2)
                    : argument;


            const separatorIndex =
                normalized.indexOf("=");


            if (separatorIndex === -1) {

                return;
            }


            const key =
                normalized
                    .substring(
                        0,
                        separatorIndex
                    )
                    .trim();


            const value =
                normalized
                    .substring(
                        separatorIndex + 1
                    )
                    .trim();


            switch (key) {

                case "port":

                    args.port =
                        Number(value);

                    break;


                case "interval":

                    args.interval =
                        Number(value);

                    break;


                case "file":

                    args.file =
                        value;

                    break;


                case "loop":

                    args.loop =
                        value.toLowerCase() ===
                        "true";

                    break;


                default:

                    console.warn(
                        `Unknown argument: ${key}`
                    );

            }

        });


    return args;
}


// =====================================================
// CONFIG
// =====================================================

const config =
    parseArguments();


// =====================================================
// VALIDATE CONFIG
// =====================================================

if (
    !Number.isFinite(config.port) ||
    config.port <= 0
) {

    console.error(
        `Invalid port: ${config.port}`
    );

    process.exit(1);
}


if (
    !Number.isFinite(config.interval) ||
    config.interval <= 0
) {

    console.error(
        `Invalid interval: ${config.interval}`
    );

    process.exit(1);
}


// =====================================================
// LOAD SPAT DATA
// =====================================================

const filePath =
    path.resolve(
        process.cwd(),
        config.file
    );


console.log(
    `Loading SPAT file: ${filePath}`
);


let packets;


try {

    const fileContent =
        fs.readFileSync(
            filePath,
            "utf8"
        );


    packets =
        JSON.parse(
            fileContent
        );

} catch (error) {

    console.error(
        "Failed to load SPAT file:"
    );

    console.error(
        error.message
    );

    process.exit(1);
}


// =====================================================
// VALIDATE DATA
// =====================================================

if (
    !Array.isArray(packets)
) {

    console.error(
        "SPAT JSON root must be an array."
    );

    process.exit(1);
}


if (
    packets.length === 0
) {

    console.error(
        "SPAT file contains no packets."
    );

    process.exit(1);
}


console.log(
    `Loaded ${packets.length} SPAT packets`
);


// =====================================================
// WEBSOCKET SERVER
// =====================================================

const wss =
    new WebSocket.Server({
        port:
            config.port
    });


// =====================================================
// PLAYBACK STATE
// =====================================================

let packetIndex = 0;

let timer = null;

let playbackFinished = false;


// =====================================================
// BROADCAST
// =====================================================

function broadcast(data) {

    const message =
        JSON.stringify(
            data
        );


    let sentCount = 0;


    wss.clients.forEach(
        client => {

            if (
                client.readyState ===
                WebSocket.OPEN
            ) {

                client.send(
                    message
                );

                sentCount++;

            }

        }
    );


    return sentCount;
}


// =====================================================
// SEND NEXT SPAT PACKET
// =====================================================

function sendNextPacket() {

    if (
        packets.length === 0
    ) {

        return;
    }


    // =================================================
    // END OF FILE
    // =================================================

    if (
        packetIndex >=
        packets.length
    ) {

        if (
            config.loop
        ) {

            console.log(
                "End of SPAT file -> loop to beginning"
            );


            packetIndex = 0;

        } else {

            console.log(
                "SPAT playback finished"
            );


            playbackFinished =
                true;


            stopPlayback();


            return;
        }

    }


    // =================================================
    // CURRENT PACKET
    // =================================================

    const packet =
        packets[
            packetIndex
        ];


    const currentIndex =
        packetIndex;


    packetIndex++;


    // =================================================
    // BROADCAST
    // =================================================

    const clientCount =
        broadcast(
            packet
        );


    // =================================================
    // DEBUG INFO
    // =================================================

    const mock =
        packet?._mock;


    const frame =
        mock?.frame ??
        currentIndex;


    const elapsedSeconds =
        mock?.elapsedSeconds ??
        null;


    console.log(
        [
            "[SPAT]",
            `packet=${currentIndex + 1}/${packets.length}`,
            `frame=${frame}`,
            elapsedSeconds !== null
                ? `sourceTime=${elapsedSeconds}s`
                : "",
            `clients=${clientCount}`
        ]
            .filter(Boolean)
            .join(" ")
    );

}


// =====================================================
// START PLAYBACK
// =====================================================

function startPlayback() {

    if (timer) {

        return;
    }


    if (
        playbackFinished &&
        !config.loop
    ) {

        return;
    }


    console.log(
        `Starting playback: 1 packet every ${config.interval} ms`
    );


    /*
     * Send first packet immediately.
     *
     * Nếu muốn packet đầu tiên cũng đợi 1 giây,
     * hãy xóa dòng:
     *
     * sendNextPacket();
     */

    sendNextPacket();


    if (
        playbackFinished
    ) {

        return;
    }


    timer =
        setInterval(
            sendNextPacket,
            config.interval
        );

}


// =====================================================
// STOP PLAYBACK
// =====================================================

function stopPlayback() {

    if (!timer) {

        return;
    }


    clearInterval(
        timer
    );


    timer = null;
}


// =====================================================
// CLIENT CONNECTION
// =====================================================

wss.on(
    "connection",
    (
        socket,
        request
    ) => {

        const clientAddress =
            request.socket
                .remoteAddress;


        console.log(
            `WebSocket client connected: ${clientAddress}`
        );


        console.log(
            `Connected clients: ${wss.clients.size}`
        );


        // =============================================
        // Optional server info message
        // =============================================

        socket.send(
            JSON.stringify({
                type:
                    "spat-replay-info",

                packets:
                    packets.length,

                intervalMs:
                    config.interval,

                loop:
                    config.loop,

                currentPacketIndex:
                    packetIndex
            })
        );


        // =============================================
        // START PLAYBACK ON FIRST CLIENT
        //
        // Server không làm mất dữ liệu nếu chưa có client.
        // =============================================

        if (
            !timer &&
            !playbackFinished
        ) {

            startPlayback();

        }


        // =============================================
        // MESSAGE FROM CLIENT
        // =============================================

        socket.on(
            "message",
            message => {

                console.log(
                    "Message from client:",
                    message.toString()
                );

            }
        );


        // =============================================
        // CLIENT DISCONNECT
        // =============================================

        socket.on(
            "close",
            () => {

                console.log(
                    "WebSocket client disconnected"
                );


                console.log(
                    `Connected clients: ${wss.clients.size}`
                );

            }
        );


        // =============================================
        // CLIENT ERROR
        // =============================================

        socket.on(
            "error",
            error => {

                console.error(
                    "WebSocket client error:",
                    error.message
                );

            }
        );

    }
);


// =====================================================
// SERVER STARTED
// =====================================================

wss.on(
    "listening",
    () => {

        console.log("");
        console.log(
            "=========================================="
        );

        console.log(
            "SPAT WebSocket Replay Server"
        );

        console.log(
            "=========================================="
        );

        console.log(
            `WebSocket: ws://localhost:${config.port}`
        );

        console.log(
            `File:      ${filePath}`
        );

        console.log(
            `Packets:   ${packets.length}`
        );

        console.log(
            `Interval:  ${config.interval} ms`
        );

        console.log(
            `Loop:      ${config.loop}`
        );

        console.log(
            "Waiting for WebSocket client..."
        );

        console.log(
            "=========================================="
        );

        console.log("");

    }
);


// =====================================================
// SERVER ERROR
// =====================================================

wss.on(
    "error",
    error => {

        console.error(
            "WebSocket server error:",
            error
        );

    }
);


// =====================================================
// GRACEFUL SHUTDOWN
// =====================================================

function shutdown() {

    console.log("");
    console.log(
        "Stopping SPAT WebSocket server..."
    );


    stopPlayback();


    wss.clients.forEach(
        client => {

            try {

                client.close();

            } catch (error) {

                // ignore

            }

        }
    );


    wss.close(
        () => {

            console.log(
                "SPAT WebSocket server stopped"
            );

            process.exit(0);

        }
    );

}


process.on(
    "SIGINT",
    shutdown
);


process.on(
    "SIGTERM",
    shutdown
);