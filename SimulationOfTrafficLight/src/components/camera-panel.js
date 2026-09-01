import React, { Component } from 'react';
import DraggablePanel from "./draggablePanel/draggable_Panel";
import GridLayout from "./gridLayout/grid_Layout";
import Camera from './camera';
import { XVIZPanel } from '../../modules/core/src';
import { PANELS } from '../constants';
class CameraPanel extends Component {
    constructor(props) {
        super(props);
        this.changeSettings=props.changeSettings;
        this.settings=props.settings;
    }
    componentDidUpdate(){
        
    }
    componentDidMount(){
    }
    render(){
        return <>
        <DraggablePanel title={"Cameras"} panelID={PANELS.CameraPanel} settings={this.settings} changeSettings={this.changeSettings}>
        <GridLayout>
        <XVIZPanel log={this.props.log} name="Camera"/>
        </GridLayout>
        </DraggablePanel>
      </>
    }    
}

export default CameraPanel;