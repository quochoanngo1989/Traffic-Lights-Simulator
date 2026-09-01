import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import "./intersection-mini-map.css";


const MIN_SIZE = 180;
const MAX_SIZE = 650;
const DEFAULT_SIZE = 300;
const PANEL_MARGIN = 12;


function clamp(value, min, max) {

    return Math.min(
        Math.max(value, min),
        max
    );
}


export const IntersectionMiniMap = memo(({

    svgUrl,

    metadataUrl,

    // Mapbox viewState.bearing
    // degree - thay đổi khi user rotate map
    viewBearing = 0,

    // yaw cố định để align 3D intersection model
    // radians
    modelYaw = 0,

    highlightedSignalGroupIds = [],

    spatSignalGroups=[]

}) => {

    //console.log(spatSignalGroups)
    // =====================================================
    // REFS
    // =====================================================
    
    const panelRef =
        useRef(null);

    const svgContainerRef =
        useRef(null);

    const dragRef =
        useRef(null);

    const resizeRef =
        useRef(null);


    // =====================================================
    // PANEL STATE
    //
    // x = null:
    // panel chưa bị drag -> sử dụng right: 16px
    //
    // sau lần drag đầu:
    // sử dụng left/top
    // =====================================================

    const [
        panel,
        setPanel
    ] = useState({

        x: null,

        y: 16,

        size: DEFAULT_SIZE

    });


    // =====================================================
    // DATA STATE
    // =====================================================

    const [
        svgContent,
        setSvgContent
    ] = useState("");


    const [
        metadataData,
        setMetadataData
    ] = useState(null);


    // =====================================================
    // LOAD SVG
    // =====================================================

    useEffect(() => {

        if (!svgUrl) {

            setSvgContent("");

            return;
        }


        const controller =
            new AbortController();


        fetch(
            svgUrl,
            {
                signal:
                    controller.signal
            }
        )
            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        `Cannot load intersection SVG: ${response.status}`
                    );
                }

                return response.text();

            })
            .then(svgText => {

                setSvgContent(
                    svgText
                );

            })
            .catch(error => {

                if (
                    error.name !==
                    "AbortError"
                ) {

                    console.error(
                        "Failed to load intersection SVG:",
                        error
                    );
                }

            });


        return () => {

            controller.abort();

        };

    }, [svgUrl]);


    // =====================================================
    // LOAD METADATA
    // =====================================================

    useEffect(() => {

        if (!metadataUrl) {

            setMetadataData(null);

            return;
        }


        // metadata object truyền trực tiếp
        if (
            typeof metadataUrl ===
            "object"
        ) {

            setMetadataData(
                metadataUrl
            );

            return;
        }


        const controller =
            new AbortController();


        fetch(
            metadataUrl,
            {
                signal:
                    controller.signal
            }
        )
            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        `Cannot load intersection metadata: ${response.status}`
                    );
                }

                return response.json();

            })
            .then(data => {

                setMetadataData(
                    data
                );

            })
            .catch(error => {

                if (
                    error.name !==
                    "AbortError"
                ) {

                    console.error(
                        "Failed to load intersection metadata:",
                        error
                    );
                }

            });


        return () => {

            controller.abort();

        };

    }, [metadataUrl]);


    // =====================================================
    // SIGNAL GROUP SET
    // =====================================================

    const highlightedSignalGroupSet =
        useMemo(() => {

            return new Set(

                (
                    highlightedSignalGroupIds ||
                    []
                ).map(
                    id =>
                        Number(id)
                )

            );

        }, [
            highlightedSignalGroupIds
        ]);


    // =====================================================
    // SIGNAL GROUP -> FROM + TO LANES
    // =====================================================

    const highlightedLaneIds =
        useMemo(() => {

            const result =
                new Set();


            if (
                !metadataData
                    ?.signalGroups
            ) {

                return result;
            }


            metadataData
                .signalGroups
                .forEach(
                    group => {

                        const signalGroupId =
                            Number(
                                group.signalGroup
                            );


                        if (
                            !highlightedSignalGroupSet
                                .has(
                                    signalGroupId
                                )
                        ) {

                            return;
                        }


                        (
                            group.movements ||
                            []
                        ).forEach(
                            movement => {


                                // FROM lane

                                if (
                                    movement.fromLaneId !== null &&
                                    movement.fromLaneId !== undefined
                                ) {

                                    result.add(
                                        Number(
                                            movement.fromLaneId
                                        )
                                    );
                                }


                                // TO lane

                                if (
                                    movement.toLaneId !== null &&
                                    movement.toLaneId !== undefined
                                ) {

                                    result.add(
                                        Number(
                                            movement.toLaneId
                                        )
                                    );
                                }

                            }
                        );

                    }
                );


            return result;

        }, [
            metadataData,
            highlightedSignalGroupSet
        ]);


    // =====================================================
    // APPLY SIGNAL GROUP HIGHLIGHT
    // =====================================================

    const highlightCss = useMemo(() => {

    if (
        !highlightedLaneIds ||
        highlightedLaneIds.size === 0
    ) {
        return "";
    }

    const selectors = Array
        .from(highlightedLaneIds)
        .map(
            laneId =>
                `.intersection-mini-map__svg .lane[data-lane-id="${laneId}"]`
        );


    const lanePathSelectors =
        selectors
            .map(
                selector =>
                    `${selector} .lane-path`
            )
            .join(",\n");


    const arrowSelectors =
        selectors
            .map(
                selector =>
                    `${selector} .direction-arrow`
            )
            .join(",\n");


    return `
        ${lanePathSelectors} {
            stroke: #00d4ff !important;
            opacity: 1 !important;
            filter:
                drop-shadow(
                    0 0 1.5px
                    rgba(0, 212, 255, 0.9)
                ) !important;
        }

        ${arrowSelectors} {
            fill: #ffffff !important;
            stroke: #00d4ff !important;
            opacity: 1 !important;
        }
        `;

    }, [
        highlightedLaneIds
    ]);


    // =====================================================
    // SVG ROTATION
    // =====================================================

    const modelYawDegrees =
        (
            Number(modelYaw) ||
            0
        ) *
        180 /
        Math.PI;


    /*
     * Chỉ SVG rotate.
     *
     * Panel KHÔNG rotate.
     */

    const svgRotation =
        -(
            (
                Number(
                    viewBearing
                ) ||
                0
            ) +
            modelYawDegrees
        );


    // =====================================================
    // GET PANEL PARENT BOUNDS
    //
    // Đây chính là Html fullscreen container.
    // =====================================================

    const getParentBounds =
        useCallback(() => {

            const element =
                panelRef.current;


            if (!element) {

                return null;
            }


            const parent =
                element.offsetParent ||
                element.parentElement;


            if (!parent) {

                return null;
            }


            return parent
                .getBoundingClientRect();

        }, []);


    // =====================================================
    // NORMALIZE CURRENT POSITION
    //
    // Nếu panel đang dùng:
    //
    // right: 16px
    //
    // thì khi bắt đầu drag/resize,
    // convert sang x/y thật.
    // =====================================================

    const getCurrentPanelPosition =
        useCallback(() => {

            if (!panelRef.current) {

                return {
                    x: 0,
                    y: 0
                };
            }


            const panelRect =
                panelRef.current
                    .getBoundingClientRect();


            const parentBounds =
                getParentBounds();


            if (!parentBounds) {

                return {
                    x: panelRect.left,
                    y: panelRect.top
                };
            }


            return {

                x:
                    panelRect.left -
                    parentBounds.left,

                y:
                    panelRect.top -
                    parentBounds.top

            };

        }, [
            getParentBounds
        ]);


    // =====================================================
    // DRAG START
    // =====================================================

    const handleDragStart =
        useCallback(
            event => {

                // button không dùng để drag
                if (
                    event.target.closest(
                        "button"
                    )
                ) {

                    return;
                }


                event.preventDefault();
                event.stopPropagation();


                const position =
                    getCurrentPanelPosition();


                const parentBounds =
                    getParentBounds();


                if (!parentBounds) {

                    return;
                }


                dragRef.current = {

                    pointerId:
                        event.pointerId,

                    startMouseX:
                        event.clientX,

                    startMouseY:
                        event.clientY,

                    startX:
                        position.x,

                    startY:
                        position.y,

                    parentWidth:
                        parentBounds.width,

                    parentHeight:
                        parentBounds.height

                };


                // chuyển từ right -> left
                setPanel(
                    previous => ({

                        ...previous,

                        x:
                            position.x,

                        y:
                            position.y

                    })
                );


                event.currentTarget
                    .setPointerCapture(
                        event.pointerId
                    );

            },
            [
                getCurrentPanelPosition,
                getParentBounds
            ]
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


                const deltaX =
                    event.clientX -
                    drag.startMouseX;


                const deltaY =
                    event.clientY -
                    drag.startMouseY;


                setPanel(
                    previous => {

                        const maxX =
                            Math.max(
                                PANEL_MARGIN,
                                drag.parentWidth -
                                previous.size -
                                PANEL_MARGIN
                            );


                        const maxY =
                            Math.max(
                                PANEL_MARGIN,
                                drag.parentHeight -
                                previous.size -
                                PANEL_MARGIN
                            );


                        return {

                            ...previous,

                            x:
                                clamp(
                                    drag.startX +
                                    deltaX,

                                    PANEL_MARGIN,
                                    maxX
                                ),

                            y:
                                clamp(
                                    drag.startY +
                                    deltaY,

                                    PANEL_MARGIN,
                                    maxY
                                )

                        };

                    }
                );

            },
            []
        );


    // =====================================================
    // DRAG END
    // =====================================================

    const handleDragEnd =
        useCallback(
            event => {

                if (!dragRef.current) {

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
    // RESIZE START
    // =====================================================

    const handleResizeStart =
        useCallback(
            event => {

                event.preventDefault();
                event.stopPropagation();


                const position =
                    getCurrentPanelPosition();


                const parentBounds =
                    getParentBounds();


                if (!parentBounds) {

                    return;
                }


                resizeRef.current = {

                    pointerId:
                        event.pointerId,

                    startMouseX:
                        event.clientX,

                    startMouseY:
                        event.clientY,

                    startSize:
                        panel.size,

                    x:
                        position.x,

                    y:
                        position.y,

                    parentWidth:
                        parentBounds.width,

                    parentHeight:
                        parentBounds.height

                };


                setPanel(
                    previous => ({

                        ...previous,

                        x:
                            position.x,

                        y:
                            position.y

                    })
                );


                event.currentTarget
                    .setPointerCapture(
                        event.pointerId
                    );

            },
            [
                panel.size,
                getCurrentPanelPosition,
                getParentBounds
            ]
        );


    // =====================================================
    // RESIZE MOVE
    // =====================================================

    const handleResizeMove =
        useCallback(
            event => {

                const resize =
                    resizeRef.current;


                if (!resize) {

                    return;
                }


                event.preventDefault();
                event.stopPropagation();


                const deltaX =
                    event.clientX -
                    resize.startMouseX;


                const deltaY =
                    event.clientY -
                    resize.startMouseY;


                /*
                 * Chọn axis mà user kéo nhiều nhất.
                 *
                 * Giữ minimap hình vuông.
                 */

                const delta =
                    Math.abs(deltaX) >
                    Math.abs(deltaY)

                        ? deltaX
                        : deltaY;


                const availableWidth =
                    resize.parentWidth -
                    resize.x -
                    PANEL_MARGIN;


                const availableHeight =
                    resize.parentHeight -
                    resize.y -
                    PANEL_MARGIN;


                const availableSize =
                    Math.min(
                        availableWidth,
                        availableHeight,
                        MAX_SIZE
                    );


                const nextSize =
                    clamp(
                        resize.startSize +
                        delta,

                        MIN_SIZE,

                        Math.max(
                            MIN_SIZE,
                            availableSize
                        )
                    );


                setPanel(
                    previous => ({

                        ...previous,

                        size:
                            nextSize

                    })
                );

            },
            []
        );


    // =====================================================
    // RESIZE END
    // =====================================================

    const handleResizeEnd =
        useCallback(
            event => {

                if (!resizeRef.current) {

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


                resizeRef.current =
                    null;

            },
            []
        );


    // =====================================================
    // RESIZE BUTTON + / -
    // =====================================================

    const resizePanel =
        useCallback(
            amount => {

                setPanel(
                    previous => {

                        const nextSize =
                            clamp(
                                previous.size +
                                amount,

                                MIN_SIZE,
                                MAX_SIZE
                            );


                        return {

                            ...previous,

                            size:
                                nextSize

                        };

                    }
                );

            },
            []
        );


    // =====================================================
    // STOP MAP EVENTS
    // =====================================================

    const stopMapEvent =
        useCallback(
            event => {

                event.stopPropagation();

            },
            []
        );


    // =====================================================
    // PANEL POSITION STYLE
    // =====================================================

    const panelPositionStyle =
        panel.x === null

            ? {

                top:
                    `${panel.y}px`,

                right:
                    "16px"

            }

            : {

                top:
                    `${panel.y}px`,

                left:
                    `${panel.x}px`

            };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div
            ref={panelRef}

            className={
                "intersection-mini-map"
            }

            style={{

                ...panelPositionStyle,

                width:
                    `${panel.size}px`,

                height:
                    `${panel.size}px`

            }}

            onPointerDown={
                stopMapEvent
            }

            onClick={
                stopMapEvent
            }

            onWheel={
                stopMapEvent
            }
        >
        <style>
            {highlightCss}
        </style>


            {/* =================================================
                HEADER / DRAG HANDLE
                ================================================= */}

            <div
                className={
                    "intersection-mini-map__header"
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
                        "intersection-mini-map__title"
                    }
                >

                    Intersection

                </div>


                <div
                    className={
                        "intersection-mini-map__toolbar"
                    }
                >

                    <span
                        className={
                            "intersection-mini-map__bearing"
                        }
                    >

                        {Math.round(
                            Number(
                                viewBearing
                            ) || 0
                        )}°

                    </span>


                    <button
                        type="button"

                        className={
                            "intersection-mini-map__button"
                        }

                        title="Smaller"

                        onPointerDown={
                            event =>
                                event.stopPropagation()
                        }

                        onClick={
                            event => {

                                event.stopPropagation();

                                resizePanel(
                                    -40
                                );
                            }
                        }
                    >
                        −
                    </button>


                    <button
                        type="button"

                        className={
                            "intersection-mini-map__button"
                        }

                        title="Larger"

                        onPointerDown={
                            event =>
                                event.stopPropagation()
                        }

                        onClick={
                            event => {

                                event.stopPropagation();

                                resizePanel(
                                    40
                                );
                            }
                        }
                    >
                        +
                    </button>

                </div>

            </div>


            {/* =================================================
                VIEWPORT
                ================================================= */}

            <div
                className={
                    "intersection-mini-map__viewport"
                }
            >


                {/* =============================================
                    SVG ROTATOR

                    Đây là phần DUY NHẤT rotate.
                    ============================================= */}

                <div
                    className={
                        "intersection-mini-map__svg-rotator"
                    }

                    style={{

                        transform:
                            `rotate(${svgRotation}deg)`

                    }}
                >

                    <div
                        ref={
                            svgContainerRef
                        }

                        className={
                            "intersection-mini-map__svg"
                        }

                        dangerouslySetInnerHTML={{
                            __html:
                                svgContent
                        }}
                    />

                </div>


                {/* =============================================
                    CENTER DEBUG MARKER

                    Không rotate.
                    Có thể xóa nếu không cần.
                    ============================================= */}

                <div
                    className={
                        "intersection-mini-map__center"
                    }
                />

            </div>


            {/* =================================================
                RESIZE HANDLE
                ================================================= */}

            <div
                className={
                    "intersection-mini-map__resize-handle"
                }

                title={
                    "Drag to resize"
                }

                onPointerDown={
                    handleResizeStart
                }

                onPointerMove={
                    handleResizeMove
                }

                onPointerUp={
                    handleResizeEnd
                }

                onPointerCancel={
                    handleResizeEnd
                }
            />

        </div>

    );
});


IntersectionMiniMap.displayName =
    "IntersectionMiniMap";