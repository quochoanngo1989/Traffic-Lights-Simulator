/* Version for obj version*/
import React, {
    memo,
    useMemo,
    useEffect,
    useState,
    useRef,
    useCallback
} from "react";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useLoader } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Coordinates } from "react-three-map";
import { IntersectionMiniMap } from "./intersection-mini-map";
import { SpatWebSocketPanel } from "./spat-websocket-panel";
import { TrafficLightsInfrastructure } from './traffic-lights-infrastructure';
import { TrafficLight3D,TRAFFIC_LIGHT_TYPE } from './traffic-light-3Dcomponent';
import "./road-component.css";

// =====================================================
// COLORS
// =====================================================

// mouse hover 
const COLOR_HOVER_LANE = 0x00d4ff;
const COLOR_HOVER_ARROW = 0xffffff;

// Connected lanes
const COLOR_HOVER_INGRESS = 0x22c55e; // green
const COLOR_HOVER_EGRESS = 0x3471eb;  // blue

// Arrow of connected lanes
const COLOR_HOVER_INGRESS_ARROW = 0x86efac;
const COLOR_HOVER_EGRESS_ARROW = 0xfdba74;

const COLOR_ARROW = 0x000000;           // black
const COLOR_PED_BIKE = 0xff8c00;        // orange

//external highlight 
const COLOR_HIGHLIGHT_LANE = 0x00aaff;  // blue
const COLOR_HIGHLIGHT_ARROW = 0x34eb67; // green



// =====================================================
// ROAD
// =====================================================
const fixedFullscreenHtmlPosition = (
    _object,
    _camera,
    size
) => {

    return [
        size.width / 2,
        size.height / 2
    ];
};

function calculateRemainingSeconds(
    endTime,
    elapsedSeconds
) {

    if (
        endTime === null ||
        endTime === undefined ||
        elapsedSeconds === null ||
        elapsedSeconds === undefined
    ) {
        return null;
    }

    /*
     * SPAT TimeMark:
     * 1 unit = 0.1 second
     *
     * Example:
     *
     * endTime = 40
     * means 4.0 seconds
     */

    const currentTimeMark =
        Number(elapsedSeconds) * 10;

    const remainingTimeMark =
        Number(endTime) -
        currentTimeMark;

    return Math.max(
        0,
        remainingTimeMark / 10
    );
}

function extractSpatSignalGroups(
    packet
) {

    const spat =
        packet
            ?._source
            ?.layers
            ?.its
            ?.[
                "dsrc.SPAT_element"
            ];


    const intersection =
        spat
            ?.[
                "dsrc.spatIntersections_tree"
            ]
            ?.[
                "Item 0"
            ]
            ?.[
                "dsrc.IntersectionState_element"
            ];


    const statesTree =
        intersection
            ?.[
                "dsrc.states_tree"
            ];


    if (!statesTree) {

        return [];
    }


    return Object
        .values(
            statesTree
        )
        .map(item => {

            const movement =
                item
                    ?.[
                        "dsrc.MovementState_element"
                    ];


            const event =
                movement
                    ?.[
                        "dsrc.state_time_speed_tree"
                    ]
                    ?.[
                        "Item 0"
                    ]
                    ?.[
                        "dsrc.MovementEvent_element"
                    ];


            if (
                !movement ||
                !event
            ) {

                return null;
            }


            const timing =
                event
                    ?.[
                        "dsrc.timing_element"
                    ];


            return {

                    signalGroup:
                        Number(
                            movement[
                                "dsrc.signalGroup"
                            ]
                        ),

                    eventState:
                        Number(
                            event[
                                "dsrc.eventState"
                            ]
                        ),

                    eventStateName:
                        event[
                            "dsrc.eventStateName"
                        ],

                    minEndTime:
                        Number(
                            timing[
                                "dsrc.minEndTime"
                            ]
                        ),

                    maxEndTime:
                        Number(
                            timing[
                                "dsrc.maxEndTime"
                            ]
                        ),

                    remainingSeconds:
                        calculateRemainingSeconds(
                            timing[
                                "dsrc.minEndTime"
                            ],
                            packet
                                ?._mock
                                ?.elapsedSeconds
                        )

                    };

        })
        .filter(Boolean);
}
export function Road({
    model,
    metadata,
    svg,

    longitude,
    latitude,

    yaw,

    viewState

    //highlightedSignalGroupIds = []
}) {
    
    // ================================================
    // LATEST RAW SPAT MESSAGE
    // ================================================

    const [
        latestSpatMessage,
        setLatestSpatMessage
    ] = useState(null);

    const spatSignalGroups =
    useMemo(
        () => {

            return extractSpatSignalGroups(
                latestSpatMessage
            );

        },
        [
            latestSpatMessage
        ]
    );
    // ================================================
    // Filter protected-Movement-Allowed (eventState==6)
    // ================================================    
    
    const highlightedSignalGroupIds=spatSignalGroups.filter(g=>g.eventState==6).map(g=>g.signalGroup);  
    return (
        <>
        {/* =========================================
                3D TrafficLights
            ========================================= */}
            <TrafficLightsInfrastructure 
                spatSignalGroups={spatSignalGroups} 
                lightSignalGroupConfig={[
                    {
                        id:"lightCluster1",
                        coordinates:{longitude:13.306388402582591,latitude:52.500802095809206},//Berlin intersection GPS
                        yPosition:3, // Lightcluster is placed at 3 meters in height
                        yaw:Math.PI, // Lightcluster model is rotated 180 degree around Y axis
                        trafficLightSignal3DConfig:{
                            lightType:TRAFFIC_LIGHT_TYPE.VERTICAL,
                            scale:[0.0001,0.0001,0.0001],
                            visible2D:true,size2D:30,
                            maxVisibleDistance2D:100},
                        controledSignalGroups:[1,2] // SignalGroup is controled by this lightcluster
                    },
                    {
                        id:"lightCluster2",
                        coordinates:{longitude:13.306727,latitude:52.499824 },//Berlin intersection GPS
                        yPosition:3, // Lightcluster is placed at 3 meters in height
                        yaw:1*Math.PI/2, // Lightcluster model is rotated 180 degree around Y axis
                        trafficLightSignal3DConfig:{
                            lightType:TRAFFIC_LIGHT_TYPE.VERTICAL,
                            scale:[0.0001,0.0001,0.0001],
                            visible2D:true,size2D:30,
                            maxVisibleDistance2D:100},
                        controledSignalGroups:[8,9,10] // SignalGroup is controled by this lightcluster
                    }
                    ]} ></TrafficLightsInfrastructure>
            {/* =========================================
                3D ROAD
                ========================================= */}

            <Coordinates
                longitude={longitude}
                latitude={latitude}
            >

                <object3D
                    rotation={[
                        0,
                        yaw,
                        0
                    ]}
                >

                    <hemisphereLight
                        args={[
                            "#fffeee",
                            "#60666C"
                        ]}
                        position={[
                            0,
                            100,
                            0
                        ]}
                    />

                    <ambientLight
                        intensity={1}
                    />


                    <RoadModel
                        id="roadmodel"

                        model={model}
                        metadata={metadata}

                        position={[
                            0,
                            0.01,
                            0
                        ]}

                        rotation={[
                            0,
                            0,
                            0
                        ]}

                        scale={[
                            1,
                            1,
                            1
                        ]}

                        highlightedSignalGroupIds={
                            highlightedSignalGroupIds
                        }
                    />

                </object3D>

            </Coordinates>


            {/* =========================================
                2D INTERSECTION OVERLAY
                ========================================= */}

            <Html
                fullscreen

                calculatePosition={
                    fixedFullscreenHtmlPosition
                }

                style={{
                    pointerEvents:
                        "none"
                }}
            >

                {/* =========================================
                    INTERSECTION MINI MAP
                    ========================================= */}

                <IntersectionMiniMap

                    svgUrl={
                        svg
                    }

                    metadataUrl={
                        metadata
                    }

                    viewBearing={
                        viewState?.bearing ?? 0
                    }

                    modelYaw={
                        yaw
                    }

                    highlightedSignalGroupIds={
                        highlightedSignalGroupIds
                    }

                    spatSignalGroups={
                        spatSignalGroups
                    }
                />


                {/* =========================================
                    SPAT WEBSOCKET CLIENT
                    ========================================= */}

                <SpatWebSocketPanel

                    defaultUrl={
                        "ws://localhost:8081"
                    }

                    onSpatMessage={
                        setLatestSpatMessage
                    }
                />

            </Html>

        </>
    );
}


// =====================================================
// ROAD MODEL
// =====================================================

export const RoadModel = memo(({
    id,
    model,
    metadata,
    scale,
    position,
    rotation,
    highlightedSignalGroupIds  = []
}) => {

    const groupRef = useRef();
    // hover tooltip
    const [hoverTooltip, setHoverTooltip] = useState(null);

    // Tooltip state
    const [selectedLane, setSelectedLane] = useState(null);

    // Loaded metadata JSON
    const [metadataData, setMetadataData] = useState(null);
    // Hovered Lane
    const [hoveredLaneId, setHoveredLaneId] = useState(null);
    // =================================================
    // LOAD OBJ
    // =================================================

    const originalObj = useLoader(
        OBJLoader,
        model
    );


    // =================================================
    // LOAD METADATA
    //
    // metadata = "/intersection.metadata.json"
    // =================================================

    useEffect(() => {

        if (!metadata) {
            setMetadataData(null);
            return;
        }

        const controller = new AbortController();

        fetch(metadata, {
            signal: controller.signal
        })
            .then(response => {

                if (!response.ok) {
                    throw new Error(
                        `Cannot load metadata: ${response.status}`
                    );
                }

                return response.json();
            })
            .then(data => {

                console.log(
                    "Road metadata loaded:",
                    data
                );

                setMetadataData(data);

            })
            .catch(error => {

                if (error.name !== "AbortError") {

                    console.error(
                        "Failed to load road metadata:",
                        error
                    );
                }

            });

        return () => {
            controller.abort();
        };

    }, [metadata]);


    // =================================================
    // CLONE OBJ + MATERIAL
    // =================================================

    const obj = useMemo(() => {

        const cloned = originalObj.clone(true);

        cloned.traverse(child => {

            if (!child.isMesh) {
                return;
            }

            child.castShadow = true;
            child.receiveShadow = true;


            // Clone materials
            if (Array.isArray(child.material)) {

                child.material = child.material.map(
                    material => material.clone()
                );

            } else if (child.material) {

                child.material =
                    child.material.clone();
            }


            // Save original colors
            if (
                child.material &&
                !Array.isArray(child.material) &&
                child.material.color
            ) {

                child.userData.originalColor =
                    child.material.color.clone();

            } else if (
                Array.isArray(child.material)
            ) {

                child.userData.originalColors =
                    child.material.map(material =>

                        material.color
                            ? material.color.clone()
                            : null
                    );
            }

        });

        return cloned;

    }, [originalObj]);


    // =================================================
    // BUILD:
    //
    // objectName -> lane metadata
    //
    // Arrow_Lane_001_INGRESS
    //       ↓
    // Lane 1 metadata
    //
    // Lane_001_....
    //       ↓
    // Lane 1 metadata
    // =================================================

    const objectToLaneMap = useMemo(() => {

        const map = new Map();

        if (!metadataData?.lanes) {
            return map;
        }

        metadataData.lanes.forEach(lane => {

            // Lane mesh
            if (lane.objectName) {

                map.set(
                    lane.objectName,
                    lane
                );
            }

            // Arrow mesh
            if (lane.arrowObjectName) {

                map.set(
                    lane.arrowObjectName,
                    lane
                );
            }

        });

        return map;

    }, [metadataData]);


    const laneByIdMap = useMemo(() => {

        const map = new Map();

        if (!metadataData?.lanes) {
            return map;
        }

        metadataData.lanes.forEach(lane => {

            map.set(
                Number(lane.laneId),
                lane
            );

        });

        return map;

    }, [metadataData]);

    // =================================================
    // BUILD MOVEMENT INDEX
    //
    // laneId -> outgoing movements
    // laneId -> incoming movements
    //
    // Metadata:
    //
    // signalGroups [
    //   {
    //      signalGroup: 8,
    //      movements: [...]
    //   }
    // ]
    // =================================================

    const movementIndex = useMemo(() => {

        const outgoing = new Map();
        const incoming = new Map();

        if (!metadataData?.signalGroups) {

            return {
                outgoing,
                incoming
            };
        }


        metadataData.signalGroups.forEach(
            signalGroupData => {

                const signalGroup =
                    signalGroupData.signalGroup;


                (
                    signalGroupData.movements || []
                ).forEach(movement => {

                    // Add signalGroup to movement
                    const movementData = {

                        ...movement,

                        signalGroup
                    };


                    // ----------------------------
                    // FROM lane
                    // ----------------------------

                    if (
                        !outgoing.has(
                            movement.fromLaneId
                        )
                    ) {

                        outgoing.set(
                            movement.fromLaneId,
                            []
                        );
                    }

                    outgoing
                        .get(movement.fromLaneId)
                        .push(movementData);


                    // ----------------------------
                    // TO lane
                    // ----------------------------

                    if (
                        !incoming.has(
                            movement.toLaneId
                        )
                    ) {

                        incoming.set(
                            movement.toLaneId,
                            []
                        );
                    }

                    incoming
                        .get(movement.toLaneId)
                        .push(movementData);

                });

            }
        );


        return {
            outgoing,
            incoming
        };

    }, [metadataData]);

    const hoverRelatedLaneSets = useMemo(() => {

    const ingressLaneIds = new Set();
    const egressLaneIds = new Set();

    if (hoveredLaneId === null) {

        return {
            ingressLaneIds,
            egressLaneIds
        };
    }


    const laneId =
        Number(hoveredLaneId);


    // =============================================
    // Collect all connected lanes
    // =============================================

    const connectedLaneIds =
        new Set();


    // ---------------------------------------------
    // Movements INTO hovered lane
    //
    // fromLane -> hoveredLane
    // ---------------------------------------------

    const incomingMovements =
        movementIndex.incoming.get(
            laneId
        ) || [];

    incomingMovements.forEach(
        movement => {

            if (
                movement.fromLaneId !== null &&
                movement.fromLaneId !== undefined
            ) {

                connectedLaneIds.add(
                    Number(
                        movement.fromLaneId
                    )
                );
            }

        }
    );


    // ---------------------------------------------
    // Movements FROM hovered lane
    //
    // hoveredLane -> toLane
    // ---------------------------------------------

    const outgoingMovements =
        movementIndex.outgoing.get(
            laneId
        ) || [];

        outgoingMovements.forEach(
            movement => {

                if (
                    movement.toLaneId !== null &&
                    movement.toLaneId !== undefined
                ) {

                    connectedLaneIds.add(
                        Number(
                            movement.toLaneId
                        )
                    );
                }

            }
        );


        // Không tính chính lane đang hover
        connectedLaneIds.delete(
            laneId
        );


        // =============================================
        // Classify by actual metadata direction
        // =============================================

        connectedLaneIds.forEach(
            connectedLaneId => {

                const connectedLane =
                    laneByIdMap.get(
                        connectedLaneId
                    );

                if (!connectedLane) {
                    return;
                }


                if (
                    connectedLane.direction ===
                    "INGRESS"
                ) {

                    ingressLaneIds.add(
                        connectedLaneId
                    );

                } else if (
                    connectedLane.direction ===
                    "EGRESS"
                ) {

                    egressLaneIds.add(
                        connectedLaneId
                    );
                }

            }
        );


        return {
            ingressLaneIds,
            egressLaneIds
        };

    }, [
        hoveredLaneId,
        movementIndex,
        laneByIdMap
    ]);
    // =================================================
    // HIGHLIGHT SET
    // =================================================

    const highlightedSignalGroupSet = useMemo(() => {

    return new Set(
        highlightedSignalGroupIds.map(
            id => Number(id)
        )
    );

    }, [highlightedSignalGroupIds]);


    const highlightedLaneIdSet = useMemo(() => {

        const laneIds = new Set();

        if (!metadataData?.signalGroups) {
            return laneIds;
        }

        metadataData.signalGroups.forEach(group => {

            const signalGroupId =
                Number(group.signalGroup);

            // Chỉ xử lý signal group đang selected
            if (
                !highlightedSignalGroupSet.has(
                    signalGroupId
                )
            ) {
                return;
            }

            (group.movements || []).forEach(
                movement => {

                    // FROM lane
                    if (
                        movement.fromLaneId !== null &&
                        movement.fromLaneId !== undefined
                    ) {
                        laneIds.add(
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
                        laneIds.add(
                            Number(
                                movement.toLaneId
                            )
                        );
                    }

                }
            );

        });

        return laneIds;

    }, [
        metadataData,
        highlightedSignalGroupSet
    ]);
    // =================================================
    // UPDATE COLORS
    // =================================================

    useEffect(() => {

        obj.traverse(child => {

            if (!child.isMesh) {
                return;
            }


            const name =
                child.name || "";


            const lane =
                objectToLaneMap.get(name);


            const laneId =
                lane?.laneId !== undefined
                    ? Number(lane.laneId)
                    : null;


            // =============================================
            // HOVERED LANE
            // =============================================

            const isHovered =
                laneId !== null &&
                hoveredLaneId !== null &&
                laneId ===
                    Number(hoveredLaneId);


            // =============================================
            // CONNECTED INGRESS
            // =============================================

            const isRelatedIngress =
                laneId !== null &&
                hoverRelatedLaneSets
                    .ingressLaneIds
                    .has(laneId);


            // =============================================
            // CONNECTED EGRESS
            // =============================================

            const isRelatedEgress =
                laneId !== null &&
                hoverRelatedLaneSets
                    .egressLaneIds
                    .has(laneId);


            // =============================================
            // EXTERNAL SIGNAL GROUP HIGHLIGHT
            //
            // Nếu bạn đang dùng logic:
            // highlightedSignalGroupIds
            // -> highlightedLaneIdSet
            // =============================================

            const isSignalGroupHighlighted =
                laneId !== null &&
                highlightedLaneIdSet?.has(
                    laneId
                );


            // =================================================
            // ARROW
            // =================================================

            if (
                name.startsWith("Arrow_")
            ) {

                // 1. Chính lane đang hover
                if (isHovered) {

                    setMeshColor(
                        child,
                        COLOR_HOVER_ARROW
                    );

                }

                // 2. Connected INGRESS
                else if (
                    isRelatedIngress
                ) {

                    setMeshColor(
                        child,
                        COLOR_HOVER_INGRESS_ARROW
                    );

                }

                // 3. Connected EGRESS
                else if (
                    isRelatedEgress
                ) {

                    setMeshColor(
                        child,
                        COLOR_HOVER_EGRESS_ARROW
                    );

                }

                // 4. External selected SG
                else if (
                    isSignalGroupHighlighted
                ) {

                    setMeshColor(
                        child,
                        COLOR_HIGHLIGHT_ARROW
                    );

                }

                // 5. Default
                else {

                    setMeshColor(
                        child,
                        COLOR_ARROW
                    );
                }

                return;
            }


            // =================================================
            // HOVERED LANE
            // =================================================

            if (
                name.startsWith("Lane_") &&
                isHovered
            ) {

                setMeshColor(
                    child,
                    COLOR_HOVER_LANE
                );

                return;
            }


            // =================================================
            // CONNECTED INGRESS
            // =================================================

            if (
                name.startsWith("Lane_") &&
                isRelatedIngress
            ) {

                setMeshColor(
                    child,
                    COLOR_HOVER_INGRESS
                );

                return;
            }


            // =================================================
            // CONNECTED EGRESS
            // =================================================

            if (
                name.startsWith("Lane_") &&
                isRelatedEgress
            ) {

                setMeshColor(
                    child,
                    COLOR_HOVER_EGRESS
                );

                return;
            }


            // =================================================
            // EXTERNAL SIGNAL GROUP HIGHLIGHT
            // =================================================

            if (
                name.startsWith("Lane_") &&
                isSignalGroupHighlighted
            ) {

                setMeshColor(
                    child,
                    COLOR_HIGHLIGHT_LANE
                );

                return;
            }


            // =================================================
            // PEDESTRIAN / BIKE
            // =================================================

            if (
                name.includes(
                    "Gehweg_oder_Radweg"
                )
            ) {

                setMeshColor(
                    child,
                    COLOR_PED_BIKE
                );

                return;
            }


            // =================================================
            // DEFAULT
            // =================================================

            restoreOriginalColor(
                child
            );

        });

    }, [
        obj,
        objectToLaneMap,
        hoveredLaneId,
        hoverRelatedLaneSets,
        highlightedLaneIdSet
    ]);

    // =================================================
    // CLICK HANDLER
    // =================================================

    const handleModelClick = useCallback(
        event => {

            event.stopPropagation();


            // Object intersected by raycaster
            let clickedObject =
                event.object;

            let lane = null;
            let matchedObjectName = null;


            // Usually event.object itself is the mesh.
            // Walking up parent tree makes this more robust.
            while (clickedObject) {

                if (
                    clickedObject.name &&
                    objectToLaneMap.has(
                        clickedObject.name
                    )
                ) {

                    lane =
                        objectToLaneMap.get(
                            clickedObject.name
                        );

                    matchedObjectName =
                        clickedObject.name;

                    break;
                }

                clickedObject =
                    clickedObject.parent;
            }


            // Clicked something unrelated to a lane
            if (!lane) {

                setSelectedLane(null);

                return;
            }


            // =================================================
            // Convert mouse intersection WORLD position
            // into local position of RoadModel
            // =================================================

            const tooltipPosition =
                event.point.clone();

            if (groupRef.current) {

                groupRef.current.worldToLocal(
                    tooltipPosition
                );
            }


            // Move tooltip slightly above road
            tooltipPosition.y += 1.5;


            const outgoingMovements =
                movementIndex.outgoing.get(
                    lane.laneId
                ) || [];

            const incomingMovements =
                movementIndex.incoming.get(
                    lane.laneId
                ) || [];


            setSelectedLane({

                lane,

                clickedObjectName:
                    matchedObjectName,

                clickedType:
                    matchedObjectName ===
                    lane.arrowObjectName
                        ? "Arrow"
                        : "Lane",

                position: tooltipPosition,

                outgoingMovements,

                incomingMovements

            });

        },
        [
            objectToLaneMap,
            movementIndex
        ]
    );


    // =================================================
    // CURSOR
    // =================================================

    const handlePointerOver = useCallback(
    (event) => {

        event.stopPropagation();

        const objectName =
            event.object?.name;

        if (!objectName) {
            return;
        }

        const lane =
            objectToLaneMap.get(
                objectName
            );

        if (!lane) {
            return;
        }

        // -----------------------------------------
        // Highlight lane + arrow
        // -----------------------------------------

        setHoveredLaneId(
            lane.laneId
        );


        // -----------------------------------------
        // Cursor
        // -----------------------------------------

        document.body.style.cursor =
            "pointer";


        // -----------------------------------------
        // Tooltip position
        // -----------------------------------------

        const tooltipPosition =
            event.point.clone();

        if (groupRef.current) {

            groupRef.current.worldToLocal(
                tooltipPosition
            );
        }

        // Nâng tooltip lên một chút
        tooltipPosition.y += 0.8;


        // -----------------------------------------
        // Show tooltip immediately
        // -----------------------------------------

        setHoverTooltip({
            lane,
            position: tooltipPosition
        });

        },
        [objectToLaneMap]
    );


    const handlePointerOut = useCallback(
    (event) => {

        event.stopPropagation();

        // Remove hover highlight
        setHoveredLaneId(null);

        // Hide tooltip immediately
        setHoverTooltip(null);

        document.body.style.cursor =
            "default";

        },
        []
    );

    const handlePointerMove = useCallback(
    (event) => {

        if (!hoveredLaneId) {
            return;
        }

        const objectName =
            event.object?.name;

        if (!objectName) {
            return;
        }

        const lane =
            objectToLaneMap.get(
                objectName
            );

        if (!lane) {
            return;
        }


        const tooltipPosition =
            event.point.clone();

        if (groupRef.current) {

            groupRef.current.worldToLocal(
                tooltipPosition
            );
        }

        tooltipPosition.y += 5.0;


        setHoverTooltip({
            lane,
            position: tooltipPosition
        });

        },
        [
            hoveredLaneId,
            objectToLaneMap
        ]
    );
    // =================================================
    // RENDER
    // =================================================

    return (

        <object3D
            ref={groupRef}
            scale={scale}
            position={position}
            rotation={rotation}
        >

            <primitive
                object={obj}

                onClick={
                    handleModelClick
                }

                onPointerOver={
                    handlePointerOver
                }

                onPointerMove={
                    handlePointerMove
                }

                onPointerOut={
                    handlePointerOut
                }
            />


            {hoverTooltip && !selectedLane && (

                <LaneHoverTooltip
                    data={hoverTooltip}
                />

            )}

            {selectedLane && (

                <RoadLaneTooltip
                    data={selectedLane}

                    onClose={() =>
                        setSelectedLane(null)
                    }
                />

            )}

        </object3D>
    );
});

function LaneHoverTooltip({
    data
}) {

    const {
        lane,
        position
    } = data;


    return (

        <Html
            position={position}

            center

            zIndexRange={[
                1200,
                0
            ]}

            style={{
                pointerEvents: "none"
            }}
        >

            <div className="lane-hover-tooltip">

                Lane {lane.laneId}:
                {" "}
                {lane.name};
                {" "}
                {lane.direction};
                {" "}
                width {lane.widthMeters} m

            </div>

        </Html>
    );
}


// =====================================================
// TOOLTIP
// =====================================================

function RoadLaneTooltip({
    data,
    onClose
}) {

    const {
        lane,
        clickedType,
        position,
        outgoingMovements,
        incomingMovements
    } = data;


    return (

        <Html
            position={position}
            center
            zIndexRange={[1000, 0]}
        >

            <div
                className="road-tooltip"

                onPointerDown={event =>
                    event.stopPropagation()
                }

                onClick={event =>
                    event.stopPropagation()
                }
            >

                {/* HEADER */}

                <div className="road-tooltip__header">

                    <div>

                        <div className="road-tooltip__title">
                            Lane {lane.laneId}
                        </div>

                        <div className="road-tooltip__subtitle">
                            {lane.name}
                        </div>

                    </div>


                    <button
                        className="road-tooltip__close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                {/* GENERAL INFO */}

                <div className="road-tooltip__info">

                    <InfoItem
                        label="Direction"
                        value={lane.direction}
                    />

                    <InfoItem
                        label="Selected"
                        value={clickedType}
                    />

                </div>


                {/* SIGNAL GROUP */}

                <div className="road-tooltip__section">

                    <div className="road-tooltip__section-title">
                        Signal Groups
                    </div>


                    <div className="road-tooltip__badges">

                        {lane.signalGroups?.length > 0
                            ? lane.signalGroups.map(
                                signalGroup => (

                                    <span
                                        key={signalGroup}
                                        className="road-tooltip__signal"
                                    >
                                        SG {signalGroup}
                                    </span>

                                )
                            )

                            : (
                                <span className="road-tooltip__empty">
                                    No signal group
                                </span>
                            )
                        }

                    </div>

                </div>


                {/* OUTGOING */}

                {outgoingMovements.length > 0 && (

                    <MovementSection
                        title="Outgoing Movements"
                        movements={
                            outgoingMovements
                        }
                    />

                )}


                {/* INCOMING */}

                {incomingMovements.length > 0 && (

                    <MovementSection
                        title="Incoming Movements"
                        movements={
                            incomingMovements
                        }
                    />

                )}

            </div>

        </Html>
    );
}

function InfoItem({
    label,
    value
}) {

    return (

        <div className="road-tooltip__info-item">

            <span className="road-tooltip__label">
                {label}
            </span>

            <span className="road-tooltip__value">
                {value || "—"}
            </span>

        </div>
    );
}
// =====================================================
// MOVEMENT TOOLTIP ITEM
// =====================================================
function MovementSection({
    title,
    movements
}) {

    return (

        <div className="road-tooltip__section">

            <div className="road-tooltip__section-title">
                {title}
            </div>


            <div className="road-tooltip__movements">

                {movements.map(
                    movement => (

                        <MovementInfo

                            key={
                                `${title}-${movement.signalGroup}-${movement.connectionId}`
                            }

                            movement={
                                movement
                            }
                        />

                    )
                )}

            </div>

        </div>
    );
}
function MovementInfo({
    movement
}) {

    return (

        <div className="road-tooltip__movement">

            <div className="road-tooltip__movement-top">

                <span className="road-tooltip__signal-small">

                    SG {
                        movement.signalGroup
                    }

                </span>


                <span className="road-tooltip__connection">

                    #{movement.connectionId}

                </span>

            </div>


            <div className="road-tooltip__route">

                <span>
                    Lane {
                        movement.fromLaneId
                    }
                </span>

                <span className="road-tooltip__arrow">
                    →
                </span>

                <span>
                    Lane {
                        movement.toLaneId
                    }
                </span>

            </div>


            {movement.maneuvers?.length > 0 && (

                <div className="road-tooltip__maneuver">

                    {movement.maneuvers.map(
                        maneuver => (

                            <span
                                key={maneuver}
                                className="road-tooltip__maneuver-badge"
                            >
                                {
                                    formatManeuver(
                                        maneuver
                                    )
                                }
                            </span>

                        )
                    )}

                </div>

            )}

        </div>
    );
}
function formatManeuver(
    maneuver
) {

    switch (maneuver) {

        case "maneuverStraightAllowed":
            return "↑ Straight";

        case "maneuverLeftAllowed":
            return "← Left";

        case "maneuverRightAllowed":
            return "→ Right";

        case "maneuverUTurnAllowed":
            return "↶ U-Turn";

        default:

            return maneuver
                .replace("maneuver", "")
                .replace("Allowed", "");
    }
}

// =====================================================
// Extract lane ID
//
// Lane_001_xxx
// Arrow_Lane_001_xxx
//
// => "001"
// =====================================================

function getLaneIdFromName(name) {

    const match =
        name.match(/Lane_(\d+)/);

    if (!match) {
        return null;
    }

    return normalizeLaneId(
        match[1]
    );
}


// =====================================================
// Normalize lane ID
// =====================================================

function normalizeLaneId(id) {

    return String(id)
        .padStart(3, "0");
}


// =====================================================
// SET COLOR
// =====================================================

function setMeshColor(
    mesh,
    color
) {

    if (!mesh.material) {
        return;
    }


    if (
        Array.isArray(
            mesh.material
        )
    ) {

        mesh.material.forEach(
            material => {

                if (material.color) {

                    material.color.setHex(
                        color
                    );
                }

                material.needsUpdate =
                    true;
            }
        );

        return;
    }


    if (mesh.material.color) {

        mesh.material.color.setHex(
            color
        );
    }

    mesh.material.needsUpdate =
        true;
}


// =====================================================
// RESTORE ORIGINAL COLOR
// =====================================================

function restoreOriginalColor(
    mesh
) {

    if (!mesh.material) {
        return;
    }


    // Multiple materials
    if (
        Array.isArray(mesh.material) &&
        mesh.userData.originalColors
    ) {

        mesh.material.forEach(
            (material, index) => {

                const originalColor =
                    mesh.userData
                        .originalColors[index];

                if (
                    material.color &&
                    originalColor
                ) {

                    material.color.copy(
                        originalColor
                    );
                }

                material.needsUpdate =
                    true;
            }
        );

        return;
    }


    // Single material
    if (
        mesh.material.color &&
        mesh.userData.originalColor
    ) {

        mesh.material.color.copy(
            mesh.userData.originalColor
        );

        mesh.material.needsUpdate =
            true;
    }
}
/* Version for FBX version
import React,{memo,useRef,useMemo,useState,useEffect} from "react";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useLoader,useFrame } from '@react-three/fiber';
import { Html} from '@react-three/drei';
import * as THREE from "three";
import { Coordinates,coordsToVector3 } from "react-three-map";

export function Road({ longitude,latitude,yaw}){
   
    useEffect(()=>{
    })
    useFrame((state) => {
        
    })
    return <Coordinates longitude={longitude} latitude={latitude}>
    <object3D rotation={[0,yaw,0]}>  
        <hemisphereLight
        args={["#fffeee", "#60666C"]}
        position={[0, 100, 0]}/>
        <ambientLight intensity={1} />
        <RoadModel id={"roadmodel"} position={[0+2-2,-8+8.01,0]} rotation={[0,0,0]} scale={[0.001*1000,0.001*1000,0.001*1000]}></RoadModel>
    </object3D>
    </Coordinates>
}


export const RoadModel=memo(({id,scale,position,rotation})=>{
    //29-0530_Finland_merge
    //let originalFbx =useMemo(() =>  useLoader(FBXLoader, '/25-0619_Finland.fbx'), []);
    //intersection in Berlin
    let originalFbx =useMemo(() =>  useLoader(FBXLoader, '/intersection.fbx'), []); 
    let fbx = originalFbx.clone();
    useEffect(() => {
     // console.log({id,scale,position,rotation});
     // console.log(fbx);
    }, [fbx]);
    return<>
        <object3D scale={scale} position={position} rotation={rotation}>  
          <mesh castShadow receiveShadow>
          <primitive object={fbx} />
          </mesh>
          </object3D>
        </> 
})


*/