import React from 'react';
import {Source, Layer } from 'react-map-gl';
export class BuildingMapLayer extends React.PureComponent{
  constructor(props){
    super(props);
  }
  render(){
    if(this.props.mapConfig.mapStyle=="mapbox://styles/mapbox/streets-v12" &&this.props.mapConfig.showBuildings)
      return <>
        <Source id="road-source" type="vector" url="mapbox://mapbox.mapbox-streets-v8">
          <Layer id="road-layer" type="line" source="road-source" source-layer="road"
              paint={{"line-color": "#ffffff", // White road lines
                }}/>
        </Source>
        <Source id="traffic-source" type="vector" url="mapbox://mapbox.mapbox-traffic-v1">
          <Layer id="traffic-layer" type="line" source="traffic-source" source-layer="traffic"
              paint={{"line-width": 1.5,
                      "line-color": [
                      "case",
                      ["==", ["get", "congestion"], "low"], "#aab7ef",
                      ["==", ["get", "congestion"], "moderate"], "#4264fb",
                      ["==", ["get", "congestion"], "heavy"], "#ee4e8b",
                      ["==", ["get", "congestion"], "severe"], "#b43b71",
                      "#000000" // Default color
                    ]}}/>
        </Source>
        <Layer id="building-layer" type="fill-extrusion" source="composite" source-layer="building"
              paint={{"fill-extrusion-color": "#aaa",
                      "fill-extrusion-height": ["get", "height"],
                      "fill-extrusion-base": ["get", "min_height"],
                      "fill-extrusion-opacity": 0.6,
                    }}/>
      </>
    return <></>
  }
}
