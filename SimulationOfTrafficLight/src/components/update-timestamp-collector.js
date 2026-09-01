import React from 'react';
import {connectToLog} from 'streetscape.gl';
class UpdateTimestampCollector extends React.PureComponent{
  constructor(props) {
    super(props);    
  }
    collectMetric(start,max){
        const fileName= new Date().getTime()+"-"+start+"-"+max+".js";
        const metrics = this.props.metrics.slice(start,max);
        const blob = new Blob([JSON.stringify({data:metrics},null,2)], {
        type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
    }
    render() {
        return <div className={'metric-collector'}>
        <fieldset>
        <legend><b>Update_State Timestamps</b></legend>
        <label><span className='txtLabel'>Number of Records:</span>{this.props.arrivedTimestamps.length}</label> 
        <button className='ExecuteButton' disabled={!this.props.arrivedTimestamps.length}  onClick={()=>{
                const blob = new Blob([JSON.stringify({data:this.props.arrivedTimestamps},null,2)], {
                    type: "application/json",
                    });
                    const url = window.URL.createObjectURL(blob);
                    window.open(url, '_blank');
                }}>Download</button>
        </fieldset>
        </div>
      }
}
const getArrivedTimestampsState = (arrivedTimestamps) => ({
    arrivedTimestamps:arrivedTimestamps
  });
const UpdateTimestampCollectorContainer = connectToLog({Component: UpdateTimestampCollector, getArrivedTimestampsState});
export default UpdateTimestampCollectorContainer;