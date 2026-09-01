import React from 'react';
import {connectToLog} from 'streetscape.gl';
import CodeMirror from 'react-codemirror';
import 'codemirror/addon/search/match-highlighter';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/sparql/sparql';
import 'codemirror/addon/scroll/simplescrollbars';
import { tree } from 'd3';


class StreamQuery extends React.PureComponent{
    constructor(props) {
      super(props);
      this.myNotify = React.createRef();
      this.rd_executedTime_true=React.createRef();
      this.rd_executedTime_false=React.createRef();
      this.rd_selectRule_true=React.createRef();
      this.rd_selectRule_false=React.createRef();
      let {hostServerNames,offServerNames}=props.getServerNames();
      this.serverNames=(hostServerNames.concat(offServerNames)).filter(name=>name.trim().length);
      const Qtext=this.serverNames.reduce((a,name,index)=>{
        //default query
      a.streamsQuery+=(index?'\r\n,':'')+'{"server":"'+name+'","streams":"DEFAULT_STREAMS"}';
      a.objectsQuery+=(index?'\r\n,':'')+'{"server":"'+name+'","objects":[]}';
      return a;
      },{streamsQuery:"",objectsQuery:""});
      const query=`{"streams":\r\n{"hostStreams":"DEFAULT_STREAMS",\r\n"sources":[${Qtext.streamsQuery}]},\r\n\r\n"objects":\r\n{"hostObjects":["VAN","CAR","PEDESTRIAN","CYCLIST"],\r\n"sources":[${Qtext.objectsQuery}\r\n]}\r\n}`;               
    this.state={executing:false,enablePreSelecting:true,query:query};
    }   
    _readyData() {
       
       const {frame,log
        //,highlightObject
        } = this.props;
        if(frame&&this.state.executing)
        {
            this._execute(this.state.query,this.props.frame,this.props.log,this.state.enablePreSelecting,this.props.highlightObject);
        }       
        return {isReady:true,hasData:true};
    }
    _execute(query,frame,log
        //,enablePreSelecting,highlightObject
        ){
        try {
            query=JSON.parse(query);
            //console.log(query);
        } catch (error) {
            return false;
        }
        const settings={...log.getStreamSettings()} 
            for (const stream in settings) {
                if(stream.startsWith("/"))
                settings[stream]=true;
            }
            settings["/asome/tada"]=true;
            const data=queryData(frame,settings,query);
            log.updateStreamSettings(data.setting);
        return true;
    }
    render() {
      const {isReady,hasData,data}=this._readyData();
      var options = {
        lineNumbers: true,
        theme:'default',
        mode:'application/sparql-query',
        lineWrapping: true,
        styleActiveLine: true,
        styleActiveSelected: true,
        scrollbarStyle:'simple',
        highlightSelectionMatches: {
            minChars: 1,
            style:'matchhighlight'
          }
        };
      if(hasData==false)
            return null;
      else
      {
        //const s=initStreamSettings(this.props.log);
            return <div className='QueryComponent'>
            <h2 style={{marginLeft:"30px",marginRight:"30px"}}>Stream Query</h2>
            <CodeMirror value={this.state.query} onChange={(code, data, value) => {
            this.setState({
              query: code,
              executing:false
            })}}  options={options}/>
            <button className='ExecuteButton' onClick={()=>{
                if(!this.state.executing)     
                {
                    const runable= this._execute(this.state.query,this.props.frame,this.props.log
                        //,this.state.enablePreSelecting,this.props.highlightObject
                        );
                    if(runable)
                    {
                       /*this.setState({
                            enablePreSelecting:this.rd_selectRule_true.current.checked,
                            executing:!this.rd_executedTime_true.current.checked
                        });
                        this.myNotify.current.innerText ="Query is Activated!";
                        console.log("enablePreSelecting:"+this.rd_selectRule_true.current.checked);
                        console.log("executing:"+!this.rd_executedTime_true.current.checked);
                        console.log(this.state);*/
                    }else{
                        this.myNotify.current.innerText ="JSON Syntax Error!!!";
                    }
                }else{
                    this.setState({executing:false});
                    this.myNotify.current.innerText ="";
                }
                }}><b>{!this.state.executing?"Execute":"Stop Executing"}</b></button>
                
                <p ref={this.myNotify}></p>
           </div>
        }
    }
}
/*set all to false */
const DEFAULT_STREAMS=[
/*"/tracklets/label",
"/frame",
"/lidar_points",
"/carview/forward/points",
"/carview/left-forward/points",
"/carview/left/points",
"/carview/right-forward/points",
"/carview/right/points",
"/carview/backward/points",
"/view_volume",
"/carview/forward",
"/carview/left-forward",
"/carview/left",
"/carview/right-forward",
"/carview/right",
"/carview/backward"*/

];
const OBJECT_STREAMS=[
/*"/tracklets/label",
"/frame",
"/lidar_points",
"/carview/forward/points",
"/carview/left-forward/points",
"/carview/left/points",
"/carview/right-forward/points",
"/carview/right/points",
"/carview/backward/points",
"/view_volume",
"/lidar/points",
"/carview/forward",
"/carview/left-forward",
"/carview/left",
"/carview/right-forward",
"/carview/right",
"/carview/backward"*/
];
const ALL_STREAMS=[];

const queryObject={
    streams:{hostStreams:[],sources:[{server:"A",streams:[]}]},
    objects:{hostObjects:[],sources:[{server:"A",objects:[]}]}
}
function queryData(frame,setting,queryObject
    //,enablePreSelecting,highlightObject
    ){
    //queryObject=JSON.parse(queryObject);
    queryObject= (queryObject==null||queryObject==undefined)?{
        streams:{hostStreams:DEFAULT_STREAMS,sources:[]}
        //,objects:{hostObjects:["CAR","VAN","PEDESTRIAN","CYCLIST"],sources:[]}
    }:queryObject;
    queryObject.streams=(queryObject.streams==null||queryObject.streams==undefined)?{hostStreams:"DEFAULT_STREAMS",sources:[]}:queryObject.streams;
    //queryObject.objects=(queryObject.objects==null||queryObject.objects==undefined)?{hostObjects:[],sources:[]}:queryObject.objects;
    queryObject.streams.hostStreams=(queryObject.streams.hostStreams==null||queryObject.streams.hostStreams==undefined||queryObject.streams.hostStreams.length<=0)?"DEFAULT_STREAMS":queryObject.streams.hostStreams;
    queryObject.streams.sources=(queryObject.streams.sources==null||queryObject.streams.sources==undefined)?[]:queryObject.streams.sources;
    //queryObject.objects.hostObjects=(queryObject.objects.hostObjects==null||queryObject.objects.hostObjects==undefined)?[]:queryObject.objects.hostObjects;
    //queryObject.objects.sources=(queryObject.objects.sources==null||queryObject.objects.sources==undefined)?[]:queryObject.objects.sources;
    var i=queryObject.streams.sources.length;
    while (i--) {
        if (queryObject.streams.sources[i].server==null||queryObject.streams.sources[i].server==undefined||queryObject.streams.sources[i].server.length==0) { 
            queryObject.streams.sources[i].splice(i, 1);
        }else{
            queryObject.streams.sources[i].streams=(queryObject.streams.sources[i].streams==null||queryObject.streams.sources[i].streams==undefined)?"DEFAULT_STREAMS":queryObject.streams.sources[i].streams;
        }
    }
    //check type of hostStreams,hostObjects,streams,objects is array if not check text
    var getStreamSettings=(queryObject,currentSetting)=>{
        const getOffStreams=(streams)=>{
            var off_streams=[];
            switch (streams) {
                case "ALL_STREAMS":
                    off_streams=ALL_STREAMS;
                    break;
                case "OBJECT_STREAMS":
                    off_streams=OBJECT_STREAMS;
                    break;
                default://DEFAULT_STREAM
                    off_streams=DEFAULT_STREAMS;
                    //off_streams=ALL_STREAMS;
                    //off_streams=OBJECT_STREAMS;
                    break;
            }
            return off_streams;
        }
        const selectStreamsBasedOnOff_Stream=(settings,off_streams,host)=>{
            for (const s in settings)
               {
                var flag=false;
                for( var i=0;i<off_streams.length;i++)
                {
                    const oS=off_streams[i];
                    const con=(host?s.startsWith(host)&&s.endsWith(oS):s.startsWith("/")&&s.endsWith(oS));
                        if(con)
                        {
                            settings[s]=!con;
                            flag=true;
                            break;
                        }
                }
                if((!flag)&&(host?s.startsWith(host):s.startsWith("/"))){
                    settings[s]=true; 
                }
            }
            return settings;
        }
        const selectStreamsBasedOnOn_Stream=(settings,on_streams,host)=>{
            for (const s in settings)
               {
                var flag=false;
                for( var i=0;i<on_streams.length;i++)
                {
                    const oS=on_streams[i];
                    const con=(host?s.startsWith(host)&&s.endsWith(oS):s.startsWith("/")&&s.endsWith(oS));
                        if(con)
                        {
                            settings[s]=con;
                            flag=true;
                            break;
                        }
                }
                if((!flag)&&(host?s.startsWith(host):s.startsWith("/"))){
                    settings[s]=false; 
                }
            }
            return settings;
        }
        var settings={...currentSetting};
        if (!Array.isArray(queryObject.streams.hostStreams))
        {
            const off_streams=getOffStreams(queryObject.streams.hostStreams);
            settings=selectStreamsBasedOnOff_Stream(settings,off_streams,null);// select streams from host
        }else
        {
            var on_streams=queryObject.streams.hostStreams;
            settings=selectStreamsBasedOnOn_Stream(settings,on_streams,null);// select streams from host
        }
        queryObject.streams.sources.forEach(source=>{
            if (!Array.isArray(source.streams))
        {
            var off_streams=getOffStreams(source.streams);
            settings=selectStreamsBasedOnOff_Stream(settings,off_streams,source.server);// select streams from host
        }else
        {
            var on_streams=source.streams;
            settings=selectStreamsBasedOnOn_Stream(settings,on_streams,source.server);// select streams from host
        }
        }) 
        console.log(settings);
        return settings;
    }
    return {setting:getStreamSettings(queryObject,setting)
        //,objects:getSelectedObjectFromQueryObject(queryObject,frame)
    }
}


const getLogState = (log) => ({
  timestamp: log.getCurrentTime(),
  frame:log.getCurrentFrame(),
  log:log
  //highlightObject: highlightObject
});
const StreamQueryContainer = connectToLog({Component: StreamQuery, getLogState});
export default StreamQueryContainer;