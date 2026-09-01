import React from 'react';
import CameraPanel from './camera-panel';
export default class ViewerMainControl extends React.PureComponent{
    constructor(props) {
        super(props);
        this.changeSettings=props.changeSettings;
        this.settings=props.settings;
    }
    render=()=> {
    return <div>
    <fieldset>
    <legend><b>Panels</b></legend>
    <div>
        <label>
        <input type="checkbox" name='ck_query' checked={this.settings.queryPanelStatus} onChange={e =>{
            this.settings.queryPanelStatus=e.target.checked;
            this.changeSettings(this.settings);
            }}/>Query Builder
        </label>
    </div>
    <div>
        <label>
        <input type="checkbox" name='ck_camera' checked={this.settings.cameraPanelStatus} onChange={e =>{
            this.settings.cameraPanelStatus=e.target.checked;
            this.changeSettings(this.settings);
            }}/>Camera
        </label>
    </div>
    <div>
        <label>
        <input type="checkbox" name='ck_side' checked={this.settings.sidePanelStatus} onChange={e =>{
            this.settings.sidePanelStatus=e.target.checked;
            this.changeSettings(this.settings);
            }}/>Side Panel
        </label>
    </div>
    <div>
        <label>
        <input type="checkbox" name='ck_acceleration'/>Acceleration
        </label>
    </div>
    <div>
        <label>
        <input type="checkbox" name='ck_velocity' />Velocity
        </label>
    </div>
    <div>
        <label>
        <input type="checkbox" name='ck_plot' />Plot
        </label>
    </div>
    </fieldset>
    <div className="checkbox-wrapper-29">
        <label className="checkbox">
        <input type="checkbox" className="checkbox__input"  checked={this.settings.showDebug} onChange={(event)=>{
                this.settings.showDebug=event.target.checked;
                //const settings={...this.settings};
                //settings.showDebug=event.target.checked;
                this.changeSettings(this.settings);
            }}></input>  
        <span className="checkbox__label"></span>
        Debug
        </label>
    </div>
    
    <div>
        <button className='button-14'>Add Views</button>
        <button className='button-14'>Remove All</button>
    </div>
    </div>
    }
}