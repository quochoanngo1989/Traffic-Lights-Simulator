import React from "react";
import { KnowledgeGraph } from "../vehicleDriverView/knowledge-graph-component";
const mapOverlayStyle = {
    font: "12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif",
    position: 'absolute',
    width: '100%',
    height: "100%",
    top: '0',
    left: '0',
    padding: '10px'
  };

  const mapOverlayInnerStyle = {
    backgroundColor: '#fff',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    borderRadius: '3px',
    padding: '10px',
    marginBottom: '10px'
  };

export class OverlayMapGraph extends React.PureComponent{
    constructor(props){
        super(props);
    }
    
    render(){        
        return <div className="map-overlay" style={mapOverlayStyle}>
        <div className="map-overlay-inner" style={mapOverlayInnerStyle}>
          <KnowledgeGraph {...this.props}></KnowledgeGraph>
        </div>
      </div>
    }
}