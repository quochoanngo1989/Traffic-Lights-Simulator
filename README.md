# Traffic Lights Simulator

Traffic Lights Simulator visualizes the topology and live traffic-light signals of an ITS junction. The project runs as two services that are started together with Docker Compose.

## Services

| Service | Description | Address |
|---|---|---|
| `simulation-of-traffic-light` | ReactJS visualizer that renders the junction, lanes, maneuvers, traffic-light poles, and signal states on a 3D map. See the [SimulationOfTrafficLight README](./SimulationOfTrafficLight/README.md) for more details. | `http://localhost:8082` |
| `spat-server` | WebSocket replay server that broadcasts SPAT messages at 10 Hz with loop playback. See the [SPATServer README](./SPATServer/README.md) for configuration and usage details. | `ws://localhost:8081` |

Both services are required to visualize the junction together with its changing traffic-light signals. The visualizer can still display the junction topology when the SPAT server is not connected.

## Requirements

- Docker Desktop, or Docker Engine with Docker Compose.
- Internet access during the first build so Docker can download the base images and project dependencies.

Node.js and npm do not need to be installed on the host machine. They are included in the Docker images, and all npm dependencies are installed while the images are built.

## Configure Mapbox

The 3D visualizer requires a public Mapbox access token. Copy `.env.example` to `.env` and set the token before starting the containers:

```text
MAPBOX_ACCESS_TOKEN=pk.your_public_token
```

Do not use or commit a secret Mapbox token. The `.env` file is ignored by Git.

## Run the containers

From the repository root, build the images and start both services:

```bash
docker compose up --build
```

After the first successful build, the containers can be started again with:

```bash
docker compose up
```

Wait until the frontend log reports that Webpack compiled successfully and the SPAT server reports that it is waiting for a WebSocket client.

## Open the visualizer

Open a browser and navigate to:

```text
http://localhost:8082
```

To display the live traffic-light states:

1. Open the **SPAT WebSocket** panel in the visualizer.
2. Keep or enter the default WebSocket address:

   ```text
   ws://localhost:8081
   ```

3. Select **Connect**.

The SPAT server runs with `npm run start:10hz`, broadcasts one message every 100 milliseconds, and loops back to the first message after reaching the end of the replay data.

## Run in the background

To start both containers in detached mode:

```bash
docker compose up --build -d
```

View their status and logs with:

```bash
docker compose ps
docker compose logs -f
```

## Stop the containers

If the containers are running in the foreground, press `Ctrl + C`. Remove the stopped containers and project network with:

```bash
docker compose down
```
