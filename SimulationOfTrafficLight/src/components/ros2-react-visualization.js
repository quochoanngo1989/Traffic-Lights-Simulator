import React from 'react';
import { OverlayMapSetting} from './vehicle-component-helper/overlay-map-setting';
import { OverlayMapCamera } from './vehicle-component-helper/overlay-map-camera';
import { OverlayMapGraph } from './vehicle-component-helper/overlay-map-graph';
import {BlocklyQuery} from './blockly-query';
import { KnowledgeGraphViewer } from './vehicle-component-helper/knowledge-graph-viewer';
import { PlayBackControl } from './vehicleDriverView/play-back-control-component';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker, NavigationControl,Popup,Source, Layer, useMap } from 'react-map-gl';
import {MAPBOX_TOKEN} from "../constants";
import { StreamConverter } from '../roslibjs-module/converters/stream-converter';
import { WorldMap } from './vehicleDriverView/world-map';
import { BuildingMapLayer } from './vehicle-component-helper/mapbox-load-functions';

import { StreamBuffer } from './vehicleDriverView/streams-buffer';
import { getViewPortCoordinate,getLngLatCoordinate } from './vehicleDriverView/helpers/helper-function';
import { WorldSimulation } from './vehicleDriverView/world-simulation';

const initialMapConfig={
  lightPreset:"night",
  showPlaceLabels:false,
  showPOILabels:false,
  showRoadLabels:false,
  showTransitLabels:false,
  mapStyle:"mapbox://styles/mapbox/standard",
  showBuildings:true,
  //mapStyle:"mapbox://styles/mapbox/streets-v12"
}
const initialViewState={
  //Hensinki 
  //longitude: 24.920452,
  //latitude: 60.164149,
  //Berlin traffic light ref point
  longitude:13.3064561, 
  latitude:52.5000634,

  //60.165032, 24.957911
  
  //longitude:24.957911 ,
  //latitude: 60.165032,
  zoom: 17.19918571720056,
  pitch: 50,
  bearing: -90.60000000000025,
  offsetX:0,
  offsetY:0
};

export class Ros2ReactVisualization extends React.PureComponent {
    constructor(props){
      super(props)
      //this.rosSubscriber=new Ros2Subscriber(ROS_XVIZ_TOPIC_CONFIG);
      //this.rosSubscriber.subscribe();
      //this.streamConverter=new StreamConverter();
      //this.streamConverter.initialize();
      this.state = {
        assets:this.props.assets,
        viewState:initialViewState,
        mapConfig:initialMapConfig,
        mapWeatherCondition:"sunny",
        mapView:true,
        frame:null
      };
      this.mapRef=React.createRef();
      this.animationFrameId = null;
    }
    async componentDidMount() {
    }
    componentWillUnmount() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
    }
    _changeState=(state)=>{
      this.setState({...state});
    }
    _visualizeRenderingFrame=(renderingFrame)=>{
      //update viewport here;
      //get new viewstate from rendering Frame
      const viewState= {...this.state.viewState};
      /**{
      "longitude": 13.377802451308355,
      "latitude": 52.516757363267715,
      "zoom": 16.865166198078875,
      "pitch": 49.99999999999999,
      "bearing": -90.60000000000025,
      "padding": {
        "top": 0,
        "bottom": 0,
        "left": 0,
        "right": 0}
      } */

      /**
       * {
        "longitude": 24.92143881369799,
        "latitude": 60.16468870003826,
        "altitude": null,
        "roll": 0.0013987181173888523,
        "pitch": -0.006716780511083047,
        "yaw": 1.5168307108316013,
        "header": {
            "stamp": {
                "sec": 1706615233,
                "nanosec": 675196935
            },
            "frame_id": "gps"
        },
        "timestamp": 1706615233.675197}
       */
      /*if(renderingFrame){
        const trackedPosition= renderingFrame.streams["/vehicle_pose"].stream.message;
        const viewportDimension={width:this.mapRef.current.getContainer().offsetWidth,height:this.mapRef.current.getContainer().offsetHeight};
        const lngLat= getLngLatCoordinate({
          ...viewState,
          ...viewportDimension, 
          longitude:trackedPosition.longitude,
          latitude:trackedPosition.latitude},
          {x:this.state.viewState.offsetX,y:this.state.viewState.offsetY});
        viewState.longitude=lngLat[0];
        viewState.latitude=lngLat[1];
      }*/
      
      this.setState({frame:renderingFrame
        //,viewState:viewState
      });
    }
    _setConfigProperty=(updatedConfig)=>{
      const updateConfig={...this.state.mapConfig,...updatedConfig};
      this.setState({mapConfig:{...updateConfig}});
      this._changeMapConfig(updateConfig);
    }
    _setMapWeatherProperty=(weatherCondition)=>{
      this.setState({mapWeatherCondition:weatherCondition});
      this._changeMapWeatherCondition(weatherCondition);
    }
    _changeMapConfig=(mapConfig)=>{
      if(this.mapRef.current){
        Object.keys(mapConfig).forEach(property => {
          this.mapRef.current.setConfigProperty('basemap', property, mapConfig[property]);
        })
      }
    }
    _changeMapWeatherCondition=(weatherCondition)=>{
      const map=this.mapRef.current;
      const zoomBasedReveal = (value) => {
        return ['interpolate', ['linear'], ['zoom'], 11, 0.0, 13, value];
      };
      switch (weatherCondition) {
        case "rain":
          //map.setStyle('mapbox://styles/mapbox/standard');
          map.setRain({
            density: zoomBasedReveal(0.5),
            intensity: 1.0,
            color: '#a8adbc',
            opacity: 0.7,
            vignette: zoomBasedReveal(1.0),
            'vignette-color': '#464646',
            direction: [0, 80],
            'droplet-size': [2.6, 18.2],
            'distortion-strength': 0.7,
            'center-thinning': 0 // Rain to be displayed on the whole screen area
          });
          break;
        case "snow":
          //map.setStyle('mapbox://styles/mapbox/standard');
          map.setSnow({
            density: zoomBasedReveal(0.85),
            intensity: 1.0,
            'center-thinning': 0.1,
            direction: [0, 50],
            opacity: 1.0,
            color: `#ffffff`,
            'flake-size': 0.71,
            vignette: zoomBasedReveal(0.3),
            'vignette-color': `#ffffff`
          });
          break;
        default:
          //map.setStyle('mapbox://styles/mapbox/standard');
          break;
      }
    }
    handleMove = (event) => {
      if (this.animationFrameId) return; // Prevents multiple updates in the same frame
      this.animationFrameId = requestAnimationFrame(() => {
        this.setState({ viewState: event.viewState });
        this.animationFrameId = null; // Reset for next update
      });
    };
    render() {
      const {log,assets} = this.state;
      //console.log("Ros2 React Visualization");
      return (
        <>
        {//<BlocklyQuery log={log} onSettingsChange={this._onSettingsChange} getServerNames={this.getServerNames} highlightObject={this.highlightObject}  queryPanelStatus={null}></BlocklyQuery>
        }
        <div id="container">
          <div id="log-panel">
            {!this.state.mapView&&<div id="graph-view">
              <KnowledgeGraphViewer frame={this.state.frame}></KnowledgeGraphViewer>
            </div>}
            {this.state.mapView&&<div id="map-view">
              <Map
                    ref={this.mapRef}
                    reuseMap={true}
                    style={{
                        width: "100%",
                        height: "100%"
                    }}

                    onMove={this.handleMove}

                    onMoveEnd={(evt) => {
                        this.setState({
                            viewState: evt.viewState
                        });
                    }}

                    antialias

                    viewState={this.state.viewState}

                    onLoad={(evt) => {

                        const map = evt.target;

                        this._changeMapConfig(
                            this.state.mapConfig
                        );

                        this._changeMapWeatherCondition(
                            "sunny"
                        );


                        // =====================================
                        // Hide shops / restaurants / cafes ...
                        // =====================================

                        map.setConfigProperty(
                            "basemap",
                            "showPointOfInterestLabels",
                            false
                        );

                    }}

                    mapStyle={
                        this.state.mapConfig.mapStyle
                    }

                    mapboxAccessToken={
                        MAPBOX_TOKEN
                    }
                >

                    <BuildingMapLayer
                        mapConfig={
                            this.state.mapConfig
                        }
                    />

                    <WorldSimulation    viewState={this.state.viewState} />

                </Map>
                
               {false&&<OverlayMapSetting mapConfig={this.state.mapConfig} setConfigProperty={this._setConfigProperty} mapWeatherCondition={this.state.mapWeatherCondition} setMapWeatherProperty={this._setMapWeatherProperty}></OverlayMapSetting>}
               {false&&<OverlayMapCamera frame={this.state.frame} streamName={"/vehicle-side/camera"} top={0} left={0}></OverlayMapCamera>}
               {false&&<OverlayMapCamera frame={this.state.frame} streamName={"V_2/vehicle-side/camera"} top={350} left={0}></OverlayMapCamera>}
               {false&&<OverlayMapGraph frame={this.state.frame}></OverlayMapGraph>}
            </div>}
            {
              /*<div id="timeline">
                <PlayBackControl {...this.state} changeState={this._changeState} visualizeRenderingFrame={this._visualizeRenderingFrame} cacheLength={30} streamingDuration={99999} frequency={100} ></PlayBackControl>
              </div>*/
            }
            
          </div>
        </div>
        </>
      );
    }
  }