import React from 'react';
import {connectToLog} from 'streetscape.gl';
import { WorldMap } from './3dscene-three-map';
class VehicleDriverComponent extends React.PureComponent {
    constructor(props){
        super(props)
    }
    render(){
        return <>
        {
            //this.props.timestamp
            <WorldMap {...this.props}></WorldMap>           
            //<ThreeDSceneComponent {...this.props}></ThreeDSceneComponent>
        }
        </>
    }
}
const getLogState = (log) => ({
  timestamp: log.getCurrentTime(),
  frame:log.getCurrentFrame(),
  log:log
});
const VehicleDriverContainer = connectToLog({Component: VehicleDriverComponent, getLogState});
export default VehicleDriverContainer;