import React, { Component } from 'react';
import DraggablePanel from "./draggablePanel/draggable_Panel";
import QueriedCameraGridLayout from './gridLayout/queried_Camera_Grid_Layout'; 
import SelectedVideoComponent from "../../modules/core/src/components/data-viewer/selected-video";
import { PANELS } from '../constants';

const fakeVideos=["Ego Camera","V_1","V_2"];
class QueriedCameraPanel extends Component {
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
        <DraggablePanel title={"Queried Cameras"} panelID={PANELS.QueriedCameraPanel} settings={this.settings} changeSettings={this.changeSettings}>
        <QueriedCameraGridLayout>
            {fakeVideos.map(v=>{
                return <div className="grid-item" draggable="true" id={v}>
                <SelectedVideoComponent log={this.props.log}></SelectedVideoComponent>
                </div>
            })}
        </QueriedCameraGridLayout>
        </DraggablePanel>
      </>
    }    
}

export default QueriedCameraPanel;