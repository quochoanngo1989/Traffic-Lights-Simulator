# SimulationOfTrafficLight

`SimulationOfTrafficLight` is a ReactJS application for visualizing the topology of a road junction described by ITS messages.

The application renders the junction and its lanes on a 3D map. It also visualizes the available maneuvers and identifies the ingress and egress lanes involved in each maneuver.

Traffic-light poles are displayed at their defined positions in the junction. When the application is connected to a SPAT WebSocket server that broadcasts live or replayed signal data for the same junction, it updates the traffic-light states in the 3D view.

## Main features

- Render the junction topology and lanes on a 3D map.
- Distinguish ingress lanes from egress lanes.
- Visualize the lane connections and allowed maneuvers through the junction.
- Display the positions of traffic-light poles.
- Connect to a SPAT WebSocket server and visualize the current traffic-light signals.

## Requirements

- Node.js version greater than 20.
- npm.

Check the installed versions with:

```bash
node --version
npm --version
```

## Install and run

From the repository root, open the sub-project directory:

```bash
cd SimulationOfTrafficLight
```

Install the dependencies:

```bash
npm install
```

Start the ReactJS development server:

```bash
npm start
```

The application is served at:

```text
http://localhost:8082
```

The development server normally opens this address automatically in the default browser.

## Run both services with Docker Compose

Docker Compose starts both the ReactJS application and the SPAT replay server. The SPAT server runs at 10 Hz with loop playback by using `npm run start:10hz`.

Requirements:

- Docker Engine or Docker Desktop.
- Docker Compose.

From the repository root, build and start both services:

```bash
docker compose up
```

After the containers have started, open:

```text
http://localhost:8082
```

The SPAT WebSocket server is available at:

```text
ws://localhost:8081
```

To stop and remove the containers, press `Ctrl + C` and run:

```bash
docker compose down
```

## Connect to a SPAT server

Connecting to a SPAT server is optional; the junction topology can still be viewed without it.

To visualize live traffic-light states:

1. Start a SPAT WebSocket server that broadcasts signals for the junction displayed by this application.
2. Open the **SPAT WebSocket** panel in the application.
3. Enter the server's WebSocket URL. The default value is:

   ```text
   ws://localhost:8081
   ```

4. Select **Connect**.

After valid SPAT messages are received, the application updates the traffic-light signals shown at the junction.

To run the SPAT replay server included in this repository, see [`../SPATServer/README.md`](../SPATServer/README.md).

## Stop the application

Press `Ctrl + C` in the terminal running the development server.
