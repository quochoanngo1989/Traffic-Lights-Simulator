# Mock SPAT 10-Second Dataset

## Overview

`mock-spat-10s.json` is a synthetic Signal Phase and Timing (SPAT) dataset created from the decoded SPAT structure found in `its_messages.json`.

It is intended for software development, visualization, playback, parser testing, and integration testing with the MAP intersection data. It is not a real traffic-controller timing plan and must not be used for traffic control or safety decisions.

## Dataset summary

| Property | Value |
| --- | --- |
| File | `mock-spat-10s.json` |
| Format | UTF-8 JSON array |
| Duration | 10 seconds |
| Update frequency | 10 Hz |
| Packet count | 100 |
| First elapsed time | 0.0 seconds |
| Last elapsed time | 9.9 seconds |
| Signal groups per packet | 42 |
| Signal-group range | 1 through 42 |
| Intersection name | `Berlin_03011_03011_MAP` |
| MAP compatibility | Signal-group identifiers match the 42 groups referenced by the MAP lane connections |

Every packet contains a complete SPAT snapshot for all 42 signal groups. A consumer does not need to combine partial updates from different packets.

## Important limitation

The original decoded SPAT packets contain all 42 movement structures, but every original `dsrc.eventState` is `0`, meaning `unavailable`. The original intersection status also reports:

```json
"dsrc.IntersectionStatusObject.noValidSPATisAvailableAtThisTime": "1"
```

The mock file replaces these unavailable values with a deterministic test sequence. The sequence preserves the MAP signal-group identifiers, but it was not obtained from the physical traffic-signal controller. Consequently, it does not prove that the mocked phases are conflict-free for the real intersection.

## Mock timing plan

| Time interval | Signal groups 1–2 | Signal groups 8–10 | Signal groups 3–7 and 11–42 |
| --- | --- | --- | --- |
| 0.0–3.9 s | Protected green | Red | Red |
| 4.0–4.9 s | Protected clearance | Red | Red |
| 5.0–5.9 s | Red | Red | Red |
| 6.0–8.9 s | Red | Protected green | Red |
| 9.0–9.9 s | Red | Protected clearance | Red |

The interval from 5.0 through 5.9 seconds is an all-red transition period.

## Movement event states

The file uses numeric `dsrc.eventState` values from the J2735 `MovementPhaseState` enumeration.

| Value | Added name | Meaning in this mock |
| --- | --- | --- |
| `3` | `stop-And-Remain` | The controlled movement must remain stopped. |
| `6` | `protected-Movement-Allowed` | The controlled movement has protected right-of-way. |
| `8` | `protected-clearance` | The protected movement is ending; this is used as the yellow/clearance state. |

For developer convenience, each event also contains the non-standard descriptive field `dsrc.eventStateName`. Applications should use the standard numeric `dsrc.eventState` field as the authoritative value.

## Top-level JSON structure

The root value is an array of 100 decoded packet objects:

```json
[
  {
    "_index": "mock-spat-10s",
    "_score": null,
    "_mock": {},
    "_source": {
      "layers": {
        "its": {
          "its.ItsPduHeader_element": {},
          "dsrc.SPAT_element": {}
        }
      }
    }
  }
]
```

The layout intentionally follows the decoded Wireshark/Elasticsearch-style structure in `its_messages.json`.

## Packet-level mock metadata

Each packet has an additional `_mock` object:

```json
"_mock": {
  "generated": true,
  "frame": 60,
  "elapsedSeconds": 6,
  "frequencyHz": 10,
  "scenario": "SG 1-2 green 0-4s, yellow 4-5s; all-red 5-6s; SG 8-10 green 6-9s, yellow 9-10s"
}
```

| Field | Description |
| --- | --- |
| `generated` | Indicates that the packet is synthetic. |
| `frame` | Zero-based frame number, from 0 through 99. |
| `elapsedSeconds` | Time elapsed since the start of the mock playback. |
| `frequencyHz` | Nominal packet frequency, always 10. |
| `scenario` | Human-readable summary of the mock phase sequence. |

The `_mock` object is not part of the J2735 SPAT specification. It may be ignored or removed before passing the data to a strict schema validator.

## ITS header

The ITS protocol header is stored at:

```text
packet._source.layers.its["its.ItsPduHeader_element"]
```

The mock preserves the source header values, including SPAT message ID `4`.

## SPAT element

The decoded SPAT payload is stored at:

```text
packet._source.layers.its["dsrc.SPAT_element"]
```

The dataset contains one intersection per packet. Its state is stored at:

```text
packet._source.layers.its["dsrc.SPAT_element"]
  ["dsrc.spatIntersections_tree"]["Item 0"]
  ["dsrc.IntersectionState_element"]
```

Important intersection fields include:

| Field | Description |
| --- | --- |
| `dsrc.name` | Intersection name, `Berlin_03011_03011_MAP`. |
| `dsrc.isId_element` | Intersection identifier structure copied from the source. |
| `dsrc.revision` | Mock revision counter. It advances with the frame and wraps modulo 128. |
| `dsrc.moy` | Minute of the year. The mock uses the source value `1995`. |
| `dsrc.isTimeStamp` | Millisecond within the current minute. It advances from `0` to `9900`. |
| `dsrc.states` | Number of movement states, always `42`. |
| `dsrc.states_tree` | Collection containing one `MovementState` for each signal group. |

The mock marks the intersection as fixed-time and available:

```json
"dsrc.IntersectionStatusObject.fixedTimeOperation": "1",
"dsrc.IntersectionStatusObject.noValidSPATisAvailableAtThisTime": "0"
```

## MovementState structure

Each item under `dsrc.states_tree` contains a `dsrc.MovementState_element`:

```json
{
  "dsrc.MovementState_element": {
    "dsrc.movementName": "8",
    "dsrc.signalGroup": "8",
    "dsrc.state_time_speed": "1",
    "dsrc.state_time_speed_tree": {
      "Item 0": {
        "dsrc.MovementEvent_element": {
          "dsrc.eventState": "6",
          "dsrc.eventStateName": "protected-Movement-Allowed",
          "dsrc.timing_element": {
            "dsrc.minEndTime": "90",
            "dsrc.maxEndTime": "90"
          }
        }
      }
    }
  }
}
```

| Field | Description |
| --- | --- |
| `dsrc.movementName` | Source movement name. In this data it corresponds to the signal-group number. |
| `dsrc.signalGroup` | Logical signal-group identifier used to associate SPAT state with MAP lane connections. |
| `dsrc.state_time_speed` | Number of movement events in the tree, currently one. |
| `dsrc.eventState` | Numeric current movement state. |
| `dsrc.eventStateName` | Mock-only readable state name. |
| `dsrc.timing_element` | Predicted timing information for the current state. |

## Timing fields

Each movement event contains:

```json
"dsrc.timing_element": {
  "per.optional_field_bit": "0",
  "dsrc.minEndTime": "90",
  "dsrc.maxEndTime": "90"
}
```

`minEndTime` and `maxEndTime` use J2735 `TimeMark` units of 0.1 second within the current hour. In this deterministic mock, both fields are equal because the next phase-change time is known exactly.

The values used by the scenario are:

| Transition time | TimeMark value |
| --- | --- |
| 4.0 s | `40` |
| 5.0 s | `50` |
| 6.0 s | `60` |
| 9.0 s | `90` |
| 10.0 s | `100` |

These values are suitable for relative playback beginning at the start of an hour. A production SPAT generator should calculate TimeMark from the actual UTC/controller time and correctly handle hour rollover.

## Relationship with MAP data

MAP provides the static relationship between lanes, lane connections, and signal groups. SPAT provides the changing state of each signal group.

The association is:

```text
MAP lane connection dsrc.signalGroup
                  =
SPAT MovementState dsrc.signalGroup
```

For example, when SPAT signal group 1 reports state `6`, all MAP movements whose connection has `dsrc.signalGroup = 1` can be displayed as protected movement allowed.

The mock includes all signal groups 1 through 42 found in the current MAP data. It does not identify individual physical signal heads, because neither the MAP connections nor SPAT movement states provide a guaranteed one-to-one mapping to physical lamps.

## Reading the mock with JavaScript

```javascript
const fs = require('fs');

const packets = JSON.parse(fs.readFileSync('mock-spat-10s.json', 'utf8'));

function getIntersection(packet) {
  return packet._source.layers.its['dsrc.SPAT_element']
    ['dsrc.spatIntersections_tree']['Item 0']
    ['dsrc.IntersectionState_element'];
}

function getSignalGroups(packet) {
  const tree = getIntersection(packet)['dsrc.states_tree'];

  return Object.values(tree).map(item => {
    const movement = item['dsrc.MovementState_element'];
    const event = movement['dsrc.state_time_speed_tree']['Item 0']
      ['dsrc.MovementEvent_element'];

    return {
      signalGroup: Number(movement['dsrc.signalGroup']),
      eventState: Number(event['dsrc.eventState']),
      eventStateName: event['dsrc.eventStateName'],
      minEndTime: Number(event['dsrc.timing_element']['dsrc.minEndTime']),
      maxEndTime: Number(event['dsrc.timing_element']['dsrc.maxEndTime'])
    };
  });
}

for (const packet of packets) {
  const signalGroups = getSignalGroups(packet);
  const group1 = signalGroups.find(group => group.signalGroup === 1);

  console.log({
    elapsedSeconds: packet._mock.elapsedSeconds,
    signalGroup1: group1
  });
}
```

## Real-time playback example

The following example replays the 100 packets at their intended 10 Hz rate:

```javascript
const fs = require('fs');
const packets = JSON.parse(fs.readFileSync('mock-spat-10s.json', 'utf8'));

let index = 0;
const intervalMilliseconds = 100;

const timer = setInterval(() => {
  if (index >= packets.length) {
    clearInterval(timer);
    console.log('Playback finished');
    return;
  }

  const packet = packets[index++];
  handleSpatPacket(packet);
}, intervalMilliseconds);

function handleSpatPacket(packet) {
  console.log(`SPAT frame ${packet._mock.frame} at ${packet._mock.elapsedSeconds}s`);
}
```

For timing-sensitive applications, calculate playback from `elapsedSeconds` and a monotonic clock instead of assuming that every `setInterval` callback executes exactly on time.

## Using the data with Three.js

A typical visualization flow is:

1. Load the intersection OBJ model.
2. Load `intersection.metadata.json` generated by `build-obj-intersection.js`.
3. Build an index from `metadata.signalGroups`.
4. Read the current SPAT packet.
5. Match each SPAT `dsrc.signalGroup` to `metadata.signalGroups[].signalGroup`.
6. Find the controlled `fromLaneObjectName` values in the Three.js scene.
7. Change the lane or arrow material according to `dsrc.eventState`.

Suggested test colors are:

| Event state | Suggested color |
| --- | --- |
| `3` stop-And-Remain | Red |
| `6` protected-Movement-Allowed | Green |
| `8` protected-clearance | Yellow/amber |
| Other or missing | Gray |

## Validation results

The generated file was validated with the following results:

- JSON parsing succeeds.
- The root contains exactly 100 packets.
- Every packet contains exactly 42 movement states.
- Every packet contains signal groups 1 through 42.
- The signal-group set matches the groups referenced by the MAP metadata.
- `elapsedSeconds` advances in 0.1-second steps.
- The mock duration is 10 seconds at 10 Hz.
- `noValidSPATisAvailableAtThisTime` is cleared in every packet.
- State changes occur at 4, 5, 6, and 9 seconds as specified.

## Production considerations

Before replacing this mock with live SPAT data:

- Obtain the real controller-to-signal-group mapping.
- Confirm conflict groups and legal simultaneous movements.
- Use controller or GNSS-synchronized timestamps.
- Handle missing packets, packet reordering, stale data, and hour rollover.
- Treat state `0` or absent SPAT as unavailable rather than green.
- Apply a timeout so an old green state is never displayed indefinitely.
- Do not infer physical traffic-light count or lamp positions from `signalGroup` alone.
