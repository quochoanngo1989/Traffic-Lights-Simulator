import React, {
    memo,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import "./spat-websocket-panel.css";


const PANEL_MARGIN = 12;


/**
 * Floating WebSocket client panel for SPAT messages.
 *
 * Responsibilities:
 *
 * - Connect / disconnect WebSocket
 * - Show connection state
 * - Show received message information
 * - Show latest SPAT message
 * - Send received SPAT packet to parent using onSpatMessage()
 * - Draggable inside Html fullscreen
 */
export const SpatWebSocketPanel = memo(({
    defaultUrl = "ws://localhost:8081",

    onSpatMessage
}) => {


    // =====================================================
    // REFS
    // =====================================================

    const panelRef =
        useRef(null);


    const socketRef =
        useRef(null);


    const dragRef =
        useRef(null);


    // =====================================================
    // CONNECTION STATE
    // =====================================================

    const [
        url,
        setUrl
    ] = useState(
        defaultUrl
    );


    const [
        status,
        setStatus
    ] = useState(
        "disconnected"
    );


    const [
        errorMessage,
        setErrorMessage
    ] = useState(
        ""
    );


    // =====================================================
    // RECEIVED DATA STATE
    // =====================================================

    const [
        messageCount,
        setMessageCount
    ] = useState(0);


    const [
        latestSpatMessage,
        setLatestSpatMessage
    ] = useState(null);


    const [
        serverInfo,
        setServerInfo
    ] = useState(null);


    const [
        lastReceivedAt,
        setLastReceivedAt
    ] = useState(null);


    // =====================================================
    // PANEL POSITION
    // =====================================================

    const [
        position,
        setPosition
    ] = useState({

        x: 16,

        y: 16

    });


    // =====================================================
    // CHECK SPAT MESSAGE
    // =====================================================

    const isSpatMessage =
        useCallback(
            message => {

                return Boolean(

                    message
                        ?._source
                        ?.layers
                        ?.its
                        ?.[
                            "dsrc.SPAT_element"
                        ]

                );

            },
            []
        );


    // =====================================================
    // CONNECT
    // =====================================================

    const connect =
        useCallback(() => {

            const normalizedUrl =
                url.trim();


            if (!normalizedUrl) {

                setErrorMessage(
                    "WebSocket URL is required."
                );

                return;
            }


            // Close old socket if it exists
            if (socketRef.current) {

                try {

                    socketRef.current.close();

                } catch (error) {

                    // ignore

                }

                socketRef.current =
                    null;
            }


            setStatus(
                "connecting"
            );


            setErrorMessage(
                ""
            );


            let socket;


            try {

                socket =
                    new WebSocket(
                        normalizedUrl
                    );

            } catch (error) {

                setStatus(
                    "error"
                );


                setErrorMessage(
                    error.message
                );


                return;
            }


            socketRef.current =
                socket;


            // =============================================
            // OPEN
            // =============================================

            socket.onopen =
                () => {

                    // Ignore event from old socket
                    if (
                        socketRef.current !==
                        socket
                    ) {

                        return;
                    }


                    setStatus(
                        "connected"
                    );


                    setErrorMessage(
                        ""
                    );

                };


            // =============================================
            // MESSAGE
            // =============================================

            socket.onmessage =
                event => {

                    if (
                        socketRef.current !==
                        socket
                    ) {

                        return;
                    }


                    let message;


                    try {

                        message =
                            JSON.parse(
                                event.data
                            );

                    } catch (error) {

                        console.error(
                            "Cannot parse WebSocket message:",
                            error
                        );


                        return;
                    }


                    // -------------------------------------
                    // Server information message
                    // -------------------------------------

                    if (
                        message?.type ===
                        "spat-replay-info"
                    ) {

                        setServerInfo(
                            message
                        );


                        return;
                    }


                    // -------------------------------------
                    // Ignore messages that are not SPAT
                    // -------------------------------------

                    if (
                        !isSpatMessage(
                            message
                        )
                    ) {

                        console.warn(
                            "Received non-SPAT message:",
                            message
                        );


                        return;
                    }


                    // -------------------------------------
                    // Update UI
                    // -------------------------------------

                    setMessageCount(
                        previous =>
                            previous + 1
                    );


                    setLatestSpatMessage(
                        message
                    );


                    setLastReceivedAt(
                        new Date()
                    );


                    // -------------------------------------
                    // Send raw SPAT message to Road
                    // -------------------------------------

                    if (
                        onSpatMessage
                    ) {

                        onSpatMessage(
                            message
                        );
                    }

                };


            // =============================================
            // ERROR
            // =============================================

            socket.onerror =
                () => {

                    if (
                        socketRef.current !==
                        socket
                    ) {

                        return;
                    }


                    setErrorMessage(
                        "WebSocket connection error."
                    );

                };


            // =============================================
            // CLOSE
            // =============================================

            socket.onclose =
                event => {

                    if (
                        socketRef.current ===
                        socket
                    ) {

                        socketRef.current =
                            null;


                        setStatus(
                            "disconnected"
                        );


                        if (
                            !event.wasClean
                        ) {

                            setErrorMessage(
                                `Connection closed unexpectedly (${event.code}).`
                            );
                        }

                    }

                };

        },
        [
            url,
            isSpatMessage,
            onSpatMessage
        ]
    );


    // =====================================================
    // DISCONNECT
    // =====================================================

    const disconnect =
        useCallback(() => {

            const socket =
                socketRef.current;


            if (!socket) {

                setStatus(
                    "disconnected"
                );

                return;
            }


            socketRef.current =
                null;


            try {

                socket.close(
                    1000,
                    "Client disconnect"
                );

            } catch (error) {

                console.error(
                    error
                );

            }


            setStatus(
                "disconnected"
            );

        }, []);


    // =====================================================
    // CLEANUP
    // =====================================================

    useEffect(() => {

        return () => {

            const socket =
                socketRef.current;


            if (socket) {

                try {

                    socket.close();

                } catch (error) {

                    // ignore

                }

            }


            socketRef.current =
                null;

        };

    }, []);


    // =====================================================
    // DRAG START
    // =====================================================

    const handleDragStart =
        useCallback(
            event => {

                /*
                 * Do not start dragging when clicking
                 * input or button.
                 */

                if (
                    event.target.closest(
                        "button"
                    ) ||
                    event.target.closest(
                        "input"
                    )
                ) {

                    return;
                }


                event.preventDefault();
                event.stopPropagation();


                if (
                    !panelRef.current
                ) {

                    return;
                }


                const panelRect =
                    panelRef.current
                        .getBoundingClientRect();


                dragRef.current = {

                    pointerId:
                        event.pointerId,

                    offsetX:
                        event.clientX -
                        panelRect.left,

                    offsetY:
                        event.clientY -
                        panelRect.top

                };


                event.currentTarget
                    .setPointerCapture(
                        event.pointerId
                    );

            },
            []
        );


    // =====================================================
    // DRAG MOVE
    // =====================================================

    const handleDragMove =
        useCallback(
            event => {

                const drag =
                    dragRef.current;


                if (!drag) {

                    return;
                }


                event.preventDefault();
                event.stopPropagation();


                const panel =
                    panelRef.current;


                if (!panel) {

                    return;
                }


                /*
                 * Because the component is inside the fixed
                 * Html fullscreen wrapper, parent bounds are
                 * stable while the Mapbox view changes.
                 */

                const parent =
                    panel.parentElement;


                if (!parent) {

                    return;
                }


                const parentRect =
                    parent
                        .getBoundingClientRect();


                const panelRect =
                    panel
                        .getBoundingClientRect();


                let nextX =
                    event.clientX -
                    parentRect.left -
                    drag.offsetX;


                let nextY =
                    event.clientY -
                    parentRect.top -
                    drag.offsetY;


                const maxX =
                    Math.max(
                        PANEL_MARGIN,

                        parentRect.width -
                        panelRect.width -
                        PANEL_MARGIN
                    );


                const maxY =
                    Math.max(
                        PANEL_MARGIN,

                        parentRect.height -
                        panelRect.height -
                        PANEL_MARGIN
                    );


                nextX =
                    Math.min(
                        Math.max(
                            nextX,
                            PANEL_MARGIN
                        ),
                        maxX
                    );


                nextY =
                    Math.min(
                        Math.max(
                            nextY,
                            PANEL_MARGIN
                        ),
                        maxY
                    );


                setPosition({

                    x:
                        nextX,

                    y:
                        nextY

                });

            },
            []
        );


    // =====================================================
    // DRAG END
    // =====================================================

    const handleDragEnd =
        useCallback(
            event => {

                if (
                    !dragRef.current
                ) {

                    return;
                }


                event.preventDefault();
                event.stopPropagation();


                if (
                    event.currentTarget
                        .hasPointerCapture(
                            event.pointerId
                        )
                ) {

                    event.currentTarget
                        .releasePointerCapture(
                            event.pointerId
                        );
                }


                dragRef.current =
                    null;

            },
            []
        );


    // =====================================================
    // STOP EVENT FROM REACHING MAPBOX
    // =====================================================

    const stopMapEvent =
        useCallback(
            event => {

                event.stopPropagation();


                event.nativeEvent
                    ?.stopImmediatePropagation
                    ?.();

            },
            []
        );


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const statusClass =
        `spat-ws-panel__status spat-ws-panel__status--${status}`;


    // =====================================================
    // MESSAGE INFORMATION
    // =====================================================

    const frame =
        latestSpatMessage
            ?._mock
            ?.frame;


    const elapsedSeconds =
        latestSpatMessage
            ?._mock
            ?.elapsedSeconds;


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div
            ref={
                panelRef
            }

            className={
                "spat-ws-panel"
            }

            style={{

                left:
                    `${position.x}px`,

                top:
                    `${position.y}px`

            }}

            onPointerDown={
                stopMapEvent
            }

            onPointerMove={
                stopMapEvent
            }

            onPointerUp={
                stopMapEvent
            }

            onClick={
                stopMapEvent
            }

            onWheel={
                stopMapEvent
            }
        >


            {/* =========================================
                HEADER / DRAG HANDLE
                ========================================= */}

            <div
                className={
                    "spat-ws-panel__header"
                }

                onPointerDown={
                    handleDragStart
                }

                onPointerMove={
                    handleDragMove
                }

                onPointerUp={
                    handleDragEnd
                }

                onPointerCancel={
                    handleDragEnd
                }
            >

                <div
                    className={
                        "spat-ws-panel__title"
                    }
                >

                    SPAT WebSocket

                </div>


                <div
                    className={
                        statusClass
                    }
                >

                    {status}

                </div>

            </div>


            {/* =========================================
                BODY
                ========================================= */}

            <div
                className={
                    "spat-ws-panel__body"
                }
            >


                {/* URL */}

                <label
                    className={
                        "spat-ws-panel__label"
                    }
                >

                    WebSocket URL

                </label>


                <input
                    type="text"

                    className={
                        "spat-ws-panel__input"
                    }

                    value={
                        url
                    }

                    disabled={
                        status ===
                            "connected" ||
                        status ===
                            "connecting"
                    }

                    onChange={
                        event =>
                            setUrl(
                                event.target.value
                            )
                    }

                    onKeyDown={
                        event => {

                            if (
                                event.key ===
                                    "Enter" &&
                                status ===
                                    "disconnected"
                            ) {

                                connect();
                            }

                        }
                    }
                />


                {/* CONNECTION BUTTONS */}

                <div
                    className={
                        "spat-ws-panel__actions"
                    }
                >

                    <button
                        type="button"

                        className={
                            "spat-ws-panel__button"
                        }

                        disabled={
                            status ===
                                "connected" ||
                            status ===
                                "connecting"
                        }

                        onClick={
                            connect
                        }
                    >

                        Connect

                    </button>


                    <button
                        type="button"

                        className={
                            "spat-ws-panel__button spat-ws-panel__button--secondary"
                        }

                        disabled={
                            status ===
                                "disconnected"
                        }

                        onClick={
                            disconnect
                        }
                    >

                        Disconnect

                    </button>

                </div>


                {/* ERROR */}

                {errorMessage && (

                    <div
                        className={
                            "spat-ws-panel__error"
                        }
                    >

                        {errorMessage}

                    </div>

                )}


                {/* CONNECTION INFO */}

                <div
                    className={
                        "spat-ws-panel__section"
                    }
                >

                    <div
                        className={
                            "spat-ws-panel__section-title"
                        }
                    >

                        Connection

                    </div>


                    <InfoRow
                        label="Status"
                        value={status}
                    />


                    <InfoRow
                        label="Messages"
                        value={messageCount}
                    />


                    <InfoRow
                        label="Last received"

                        value={
                            lastReceivedAt
                                ? lastReceivedAt
                                    .toLocaleTimeString()
                                : "-"
                        }
                    />


                    {serverInfo && (

                        <>

                            <InfoRow
                                label="Packets"

                                value={
                                    serverInfo.packets ??
                                    "-"
                                }
                            />


                            <InfoRow
                                label="Interval"

                                value={
                                    serverInfo.intervalMs !==
                                        undefined
                                        ? `${serverInfo.intervalMs} ms`
                                        : "-"
                                }
                            />


                            <InfoRow
                                label="Loop"

                                value={
                                    String(
                                        Boolean(
                                            serverInfo.loop
                                        )
                                    )
                                }
                            />

                        </>

                    )}

                </div>


                {/* SPAT INFORMATION */}

                <div
                    className={
                        "spat-ws-panel__section"
                    }
                >

                    <div
                        className={
                            "spat-ws-panel__section-title"
                        }
                    >

                        Latest SPAT

                    </div>


                    <InfoRow
                        label="Frame"

                        value={
                            frame ??
                            "-"
                        }
                    />


                    <InfoRow
                        label="Source time"

                        value={
                            elapsedSeconds !==
                                undefined

                                ? `${elapsedSeconds} s`

                                : "-"
                        }
                    />

                </div>


                {/* MESSAGE PREVIEW */}

                <div
                    className={
                        "spat-ws-panel__section"
                    }
                >

                    <div
                        className={
                            "spat-ws-panel__section-title"
                        }
                    >

                        Message preview

                    </div>


                    <pre
                        className={
                            "spat-ws-panel__preview"
                        }
                    >

                        {
                            latestSpatMessage

                                ? JSON.stringify(
                                    latestSpatMessage,
                                    null,
                                    2
                                )

                                : "No SPAT message received."
                        }

                    </pre>

                </div>

            </div>

        </div>
    );
});


SpatWebSocketPanel.displayName =
    "SpatWebSocketPanel";


// =====================================================
// INFO ROW
// =====================================================

function InfoRow({
    label,
    value
}) {

    return (

        <div
            className={
                "spat-ws-panel__info-row"
            }
        >

            <span
                className={
                    "spat-ws-panel__info-label"
                }
            >

                {label}

            </span>


            <span
                className={
                    "spat-ws-panel__info-value"
                }
            >

                {value}

            </span>

        </div>
    );
}