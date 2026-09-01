import React from 'react';
import {connectToLog} from 'streetscape.gl';
class ViewerControl extends React.PureComponent{
    constructor(props) {
      super(props);
       //this.sltFrame = React.createRef();
       this.moveCamera=props.moveCamera;
       this.changeSettings=props.changeSettings;
       this.view=props.view;
       this.settings=props.settings;
    }
    _readyData() {
      const {timestamp,frame,log} = this.props;
      //console.log(frame);
        if(log)
        {
            const vehicleNames=Object.keys(log.streamBuffer.streams)
            .filter(name=>name.startsWith("V_"))
            .map(name=>name.split("/")[0])
            .reduce((names,name)=>{
                if(!names.some(n=>n===name))
                {
                    names.push(name);
                }
                return names;
            },["Ego Vehicle"]);
            const viewModes=["Perspective","Top Down","Driver"];
            return {isReady:true,hasData:true,data:{vehicleNames,viewModes}};
        }
        return {isReady:false,hasData:true};
    }
    render=()=> {
      const {isReady,hasData,data}=this._readyData();
      const {timestamp,frame,log,viewOffset,viewState,trackedVehicle,viewMode} = this.props;
      if(hasData==false)
            return ;
      else
            return <div className="Viewer-Control">
            {data&&<div>
              <h4>Viewer Control{!this.view&&" (Main)"}</h4>
              <label>Camera focus</label>
              <select onChange={(event )=>{
                this.moveCamera({x:0,y:0,bearing:0,trackedVehicle:event.target.value,view:this.view});
            }} value={trackedVehicle}>
                {data.vehicleNames.map((name)=>{return <option key={name} value={name}>{name}</option>})}
            </select>
            <label>View mode</label>
            <select value={this.settings.viewMode} onChange={(event )=>{
                //this.moveCamera({x:0,y:0,bearing:0,trackedVehicle:event.target.value,view:this.view});
                this.settings.viewMode=event.target.value;
                this.changeSettings(this.settings,this.view);
            }}>
                <option value="TOP_DOWN">Top Down</option>
                <option value="PERSPECTIVE">Perspective</option>
                <option value="DRIVER">Driver</option>
            </select>
            <div><label><input type="checkbox" name="ck-tool-tip" checked={this.settings.showTooltip} onChange={(event)=>{
                this.settings.showTooltip=event.target.checked;
                this.changeSettings(this.settings,this.view);
            }}></input>show Tooltip</label></div>
            <div><label><input type="checkbox" name="ck-show-map" checked={this.settings.showMap} onChange={(event)=>{
                this.settings.showMap=event.target.checked;
                this.changeSettings(this.settings,this.view);
            }}></input>show Map</label></div>
            {this.props.children}
            </div>}
          </div>
    }
}

const getLogState = (log) => ({
  timestamp: log.getCurrentTime(),
  frame:log.getCurrentFrame(),
  log:log
});
const ViewerControlContainer = connectToLog({Component: ViewerControl, getLogState});
export default ViewerControlContainer;

