//import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useRef, useState,Suspense,useEffect } from 'react'
import { Canvas,Coordinates,useMap} from "react-three-map" // if you are using MapBox
//import * as THREE from "three";
import VehicleScene from './raycast-vehicle';
const CANVAS_ORIGIN={latitude:52.5000634, longitude:13.3064561, altitude:0};
const VEHICLE_ORIGIN={longitude:13.306425276158116, latitude:52.50091741352687};
export function WorldSimulation({frame,mapRef,viewState}){
  return <SimulatedCar viewState={viewState}></SimulatedCar>
}  

function SimulatedCar({viewState}){
      return <Canvas {...CANVAS_ORIGIN}>
      {
        <Coordinates {...VEHICLE_ORIGIN}>  
              <VehicleScene viewState={viewState} {...VEHICLE_ORIGIN}></VehicleScene>
        </Coordinates>
      }
      
    </Canvas>
  }
