import React from "react";
import { Camera } from "../vehicleDriverView/camera-component";
//import { TrafficLight } from "../vehicleDriverView/traffic-light-component";
const mapOverlayStyle = {
    font: "12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif",
    position: 'absolute',
    //width: '800px',
    top: '0',
    left: '0',
    padding: '10px',
    zIndex:999
  };

  const mapOverlayInnerStyle = {
    backgroundColor: '#fff',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    borderRadius: '3px',
    padding: '10px',
    marginBottom: '10px'
  };

export class OverlayMapCamera extends React.PureComponent{
    constructor(props){
        super(props);
        this.state={streamName:props.streamName}
    }
    
    render(){        
        return <div className="map-overlay" style={{...mapOverlayStyle,top:this.props.top,left:this.left}}>
        <div className="map-overlay-inner" style={mapOverlayInnerStyle}>
          {
          //<TrafficLight></TrafficLight>
          }
          <Camera {...this.props} streamName={this.state.streamName}></Camera>
          <select style={{position:"absolute",top:"10px",left:"10px", zIndex:1000 }}
           value={this.state.streamName}
           onChange={(e)=>{
            this.setState({streamName:e.target.value})
          }}>
            <option value={"/vehicle-side/camera"}>{"Ego Camera"} </option>
            <option value={"V_2/vehicle-side/camera"}>{"V_2 Camera"} </option>
          </select>
        </div>
      </div>
    }
}