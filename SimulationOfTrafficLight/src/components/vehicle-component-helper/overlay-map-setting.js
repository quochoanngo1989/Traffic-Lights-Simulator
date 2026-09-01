import React from "react";
const mapOverlayStyle = {
    font: "12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif",
    position: 'absolute',
    width: '200px',
    top: '0',
    right: '0',
    padding: '10px'
  };

  const mapOverlayInnerStyle = {
    backgroundColor: '#fff',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    borderRadius: '3px',
    padding: '10px',
    marginBottom: '10px'
  };

  const fieldsetStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    border: 'none'
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginRight: '10px'
  };

  const selectFieldsetStyle = {
    display: 'block',
    border: 'none'
  };

  const selectLabelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
  };

  const selectStyle = {
    width: '100%'
  };
export class OverlayMapSetting extends React.PureComponent{
    constructor(props){
        super(props);
        this.setConfigProperty=props.setConfigProperty;
        this.setMapWeatherProperty=props.setMapWeatherProperty;
    }
    setMapStyle=(mapStyle)=>{
      this.setConfigProperty({mapStyle});
  }
    setLightPreset=(lightPreset)=>{
        this.setConfigProperty({lightPreset});
    }
    setShowPlaceLabels=(showPlaceLabels)=>{
        this.setConfigProperty({showPlaceLabels});
    }
    setShowPOILabels=(showPOILabels)=>{
        this.setConfigProperty({showPOILabels})
    }
    setShowRoadLabels=(showRoadLabels)=>{
        this.setConfigProperty({showRoadLabels});
    }
    setShowTransitLabels=(showTransitLabels)=>{
        this.setConfigProperty({showTransitLabels})
    }
    setShowBuildings=(showBuildings)=>{
        this.setConfigProperty({showBuildings})
    }
    render(){
        const {mapWeatherCondition,mapConfig}=this.props;
        const {showBuildings,mapStyle,lightPreset,showPlaceLabels,showPOILabels,showRoadLabels,showTransitLabels}=mapConfig;
        
        return <div className="map-overlay" style={mapOverlayStyle}>
        <div className="map-overlay-inner" style={mapOverlayInnerStyle}>
        <fieldset className="select-fieldset" style={selectFieldsetStyle}>
            <label style={selectLabelStyle}>
              Select map style
              <select
                id="mapStyle"
                name="mapStyle"
                value={mapStyle}
                onChange={(e) => this.setMapStyle(e.target.value)}
                style={selectStyle}
              >
                <option value="mapbox://styles/mapbox/standard">Standard</option>
                <option value="mapbox://styles/mapbox/streets-v12">Streets-v12</option>
              </select>
            </label>
          </fieldset>
          
          <fieldset className="select-fieldset" style={selectFieldsetStyle}>
            <label style={selectLabelStyle}>
              Select light preset
              <select
                id="lightPreset"
                name="lightPreset"
                value={lightPreset}
                onChange={(e) => this.setLightPreset(e.target.value)}
                style={selectStyle}
              >
                <option value="dawn">Dawn</option>
                <option value="day">Day</option>
                <option value="dusk">Dusk</option>
                <option value="night">Night</option>
              </select>
            </label>
          </fieldset>
          <fieldset className="select-fieldset" style={selectFieldsetStyle}>
            <label style={selectLabelStyle}>
              Select weather condition
              <select
                id="sunny"
                name="sunny"
                value={mapWeatherCondition}
                onChange={(e) => this.setMapWeatherProperty(e.target.value)}
                style={selectStyle}
              >
                <option value="sunny">Sunny</option>
                <option value="rain">Rain</option>
                <option value="snow">Snow</option>
              </select>
            </label>
          </fieldset>
          <fieldset style={fieldsetStyle}>
            <label style={labelStyle}>
              Show place labels
              <input
                type="checkbox"
                id="showPlaceLabels"
                checked={showPlaceLabels}
                onChange={(e) => this.setShowPlaceLabels(e.target.checked)}
              />
            </label>
          </fieldset>
          <fieldset style={fieldsetStyle}>
            <label style={labelStyle}>
              Show POI labels
              <input
                type="checkbox"
                id="showPointOfInterestLabels"
                checked={showPOILabels}
                onChange={(e) => this.setShowPOILabels(e.target.checked)}
              />
            </label>
          </fieldset>
          <fieldset style={fieldsetStyle}>
            <label style={labelStyle}>
              Show road labels
              <input
                type="checkbox"
                id="showRoadLabels"
                checked={showRoadLabels}
                onChange={(e) => this.setShowRoadLabels(e.target.checked)}
              />
            </label>
          </fieldset>
          <fieldset style={fieldsetStyle}>
            <label style={labelStyle}>
              Show transit labels
              <input
                type="checkbox"
                id="showTransitLabels"
                checked={showTransitLabels}
                onChange={(e) => this.setShowTransitLabels(e.target.checked)}
              />
            </label>
          </fieldset>

          <fieldset style={fieldsetStyle}>
            <label style={labelStyle}>
              Show buildings
              <input
                type="checkbox"
                id="showBuildings"
                checked={showBuildings}
                onChange={(e) => this.setShowBuildings(e.target.checked)}
              />
            </label>
          </fieldset>

        </div>
      </div>
    }
}