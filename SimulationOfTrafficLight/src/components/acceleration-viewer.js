import React from 'react';
import {MeterWidget} from "../../modules/core/src/index";
export default class AccelerationViewer extends React.PureComponent{
    constructor(props) {
        super(props);
        this.log=props.log;
    }
    render=()=> {
    const log=this.log;
    return <div>
    <MeterWidget
                log={log}
                streamName="/vehicle/velocity"
                label="Ego-Speed"
                getWarning={x => (x > 30 ? 'FAST' : '')}
                min={0}
                max={120}
              />
              {
                   log&&Object.keys(log.streamBuffer.streams)
                    .filter(name=>name.startsWith("ws//"))
                    .map(name=>name.split("/")[2])
                    .reduce((names,name)=>{
                        const  wsname="ws//"+name;
                        if(!names.some(n=>n===wsname))
                        {
                            names.push(wsname);
                        }
                        return names;
                    },[]).map(ws=>{
                      return <MeterWidget
                      log={log}
                      streamName={ws+"/vehicle/velocity"}
                      label={ws+"-Speed"}
                      getWarning={x => (x > 30 ? 'FAST' : '')}
                      min={0}
                      max={120}
                    />
                    })
              }
    </div>
    }
}