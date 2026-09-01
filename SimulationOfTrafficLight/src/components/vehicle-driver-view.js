import React from 'react';
import {XVIZStreamLoader} from 'streetscape.gl';
import {getXVIZConfig} from '@xviz/parser';
import {Request_Config} from '../request-config';
import {PlaybackControl} from "../../modules/core/src/index";
import {OverlayMapSetting} from './vehicle-component-helper/overlay-map-setting';
import VehicleDriverContainer from './vehicleDriverView/vehicle-driver-component';
import CameraPanel from './camera-panel';
//import { ParallaxBarrierEffect } from 'three/addons/effects/ParallaxBarrierEffect.js';
//import { AnaglyphEffect } from 'three/addons/effects/AnaglyphEffect.js';

import { useEffect, useRef } from "react";


import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker, NavigationControl,Popup } from 'react-map-gl';
import {MAPBOX_TOKEN} from "../constants";
import { Preload } from '@react-three/drei';

import { VRButton } from "three/examples/jsm/webxr/VRButton";
import { Canvas, useThree } from "@react-three/fiber";

import PopUpsContainer from './vehicleDriverView/helpers/popup';
const VRScene = () => {
  const { gl } = useThree();
  /*useEffect(() => {
    document.body.appendChild(VRButton.createButton(gl));
    gl.xr.enabled = true;
  }, [gl]);*/
  return null;
};
const popupInfo={
  longitude: 24.921074799925293,
  latitude: 60.16425136538851,
  name:"PopUp",
  content:"Show information about this car"
};

const initialMapConfig={
  lightPreset:"day",
  showPlaceLabels:false,
  showPOILabels:false,
  showRoadLabels:true,
  showTransitLabels:true
}
const initialViewState={
  longitude: 24.921074799925293,
  latitude: 60.16425136538851,
  zoom: 17.19918571720056,
  pitch: 57,
  bearing: -9.60000000000025
};
const TIMEFORMAT_SCALE = getXVIZConfig().TIMESTAMP_FORMAT === 'seconds' ? 1000 : 1;
export class VehicleDriverView extends React.PureComponent {
    constructor(props){
      super(props)
      this.vehicleLog = new XVIZStreamLoader({
        logGuid: 'mock',
        session_type:'live',
        bufferLength: Request_Config.bufferLength,
        serverConfig: Request_Config.serverConfig,
        worker: Request_Config.worker,
        maxConcurrency: Request_Config.maxConcurrency
      });
      this.state = {
        log: this.vehicleLog,
        assets:this.props.assets,
        viewState:initialViewState,
        mapConfig:initialMapConfig,
        mapWeatherCondition:"sunny"
      };
      this.mapRef=React.createRef();
    }
    
    async componentDidMount() {
      const {log} = this.state;
      log.on('ready',()=>
      {
        const metadata = log.getMetadata();
          this.setState({
            panels: Object.keys((metadata && metadata.ui_config) || {}),
            logGetReady:true
          });
      }).on('error', console.error).connect();
    }
    _isLogGetReady=()=>{
      return this.state.logGetReady;
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
      Object.keys(mapConfig).forEach(property => {
        this.mapRef.current.setConfigProperty('basemap', property, mapConfig[property]);
      })
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

    render() {
      const {log,assets} = this.state;
      return (
        <>
        <div id="container">
          <div id="log-panel">
            {//<CameraPanel log={this.state.log}></CameraPanel>
            }
            <div id="map-view">
              <Map 
                //ref={(ref)=>(this.map=ref?.getMap())}
                ref={this.mapRef}
                reuseMap={true}
                style={{width:"100%", height:"90%"}}
                onMove={evt => {
                  this.setState({viewState:evt.viewState})
                  }}
                antialias
                {...this.state.viewState}
                //initialViewState={{longitude: 24.921074799925293,latitude: 60.16425136538851,zoom: 17.19918571720056,pitch: 57,bearing: -9.60000000000025}}
                onLoad={(map)=>{
                  this._changeMapConfig(this.state.mapConfig);
                  this._changeMapWeatherCondition("sunny");
                  console.log("Map is loaded again!");
                }}
                onStyleData={()=>{}}
                mapStyle="mapbox://styles/mapbox/standard"
                //mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={MAPBOX_TOKEN}>
               <VehicleDriverContainer assets={this.state.assets} log={this.state.log}></VehicleDriverContainer>     
               <PopUpsContainer log={this.state.log}></PopUpsContainer>
               </Map>
               {false&&<OverlayMapSetting mapConfig={this.state.mapConfig} setConfigProperty={this._setConfigProperty} mapWeatherCondition={this.state.mapWeatherCondition} setMapWeatherProperty={this._setMapWeatherProperty}></OverlayMapSetting>}
            </div>
            <div id="timeline">
              <PlaybackControl
                width="100%"
                log={log}
                formatTimestamp={x => new Date(x * TIMEFORMAT_SCALE).toUTCString()}
              />
            </div>
            
          </div>
        </div>
        </>
      );
    }
  }