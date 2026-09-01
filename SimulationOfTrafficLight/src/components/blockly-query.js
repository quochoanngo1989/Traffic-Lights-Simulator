import React from 'react';
import SplitPane from 'react-split-pane';
//import {connectToLog} from 'streetscape.gl';
//import CodeMirror from 'react-codemirror';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/addon/search/match-highlighter';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/sparql/sparql';
import 'codemirror/addon/scroll/simplescrollbars';
//import "./customBlocks/custom_Blocks";
//import ReactBlockly from "react-blockly";
//import Blockly from "blockly";
import Modal from 'react-modal';
import {INITIAL_CODE } from "./customBlocks/sparql_Dictionary";
import { generateXMLBlocks } from './customBlocks/sparql_To_XMLBlocks';
import AudioAnalyzer from './audioVisualizer/AudioAnalyzer';
import { IconContext } from "react-icons";
import { CiMicrophoneOff,CiMicrophoneOn,CiPlay1,CiStop1,CiEdit} from "react-icons/ci";
import { MdDisabledVisible } from "react-icons/md";
import { Sparnatural } from './sparnatural';




const iconConfig={ color: "blue", className: "global-class-name", size:'2em' };

//import OpenAI from "openai";
//import { tree } from 'd3';
//Modal.setAppElement('#root');
const customStyles = {
    content: {
      padding:"0"
    },
  };
  
async function fetchChatGPT(prompt) {
    const url = "https://api.openai.com/v1/chat/completions";
    const apiKey = ""; // Configure OpenAI access through a backend proxy; never embed API keys in browser code.
    const requestData = {
        "model": "gpt-4o",
        "messages": [
          {
            "role": "system",
            "content": "You are a helpful SPARQL query generator.The generated query use the following prefixes : 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>','PREFIX sosa: <http://www.w3.org/ns/sosa/>','PREFIX : <http://tu-berlin.de/ontology#>', variables, subjects or objects :'?stream','?bbox', '?ts','?sensor','?objects','?vehicle','?car',':Car',':LidarStream' and predicates: ':observes','sosa:hasResultTime',':detectedIn','rdf:type',':hasBoundingBox','sosa:hosts',':generatedBy'. Wrapping where conditions in template: WHERE{ STREAM ?stream @ ?ts WINDOW [1s]{where conditions}}"
          },
          {
            "role": "user",
            "content": "an example of sparql query, only code"
          },
          {
            "role": "assistant",
            "content": "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX sosa: <http://www.w3.org/ns/sosa/>\nPREFIX : <http://tu-berlin.de/ontology#>\nSELECT   ?stream ?bbox\nWHERE {\nSTREAM ?stream @ ?ts WINDOW [1s]{\n?sensor :observes ?objects.\nFILTER ((?o > 10) && (?p = \"example\" || (?s = \"nested\" && ?o < 20)))\n}?car sosa:hosts ?sensor.?stream :generatedBy ?sensor.?stream rdf:type :LidarStream.\nFILTER (?s = \"simple\")}"
          },
          {
            "role": "user",
            "content": prompt+", including only code"
          }
        ]
      };
    return await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    });
}

const output=`[
    {
        "stream": "ego_vehicle",
        "objects": {
            "pedestrian": true,
            "vehicle": {
                "car": true,
                "cyclist": true
            }
        },
        "lidar": {
            "points": false
        },
        "camera": {
            "cam_front": false
        }
    },
    {
        "stream": "V_1",
        "objects": {
            "pedestrian": true,
            "vehicle": {
                "car": true,
                "cyclist": true
            }
        },
        "lidar": {
            "points": true
        },
        "camera": {
            "cam_front": false
        }
    },
    {
        "stream": "V_2",
        "objects": {
            "pedestrian": true,
            "vehicle": {
                "car": true,
                "cyclist": true
            }
        },
        "lidar": {
            "points": true
        },
        "camera": {
            "cam_front": false
        }
    }
]`;

  const toolboxCategories = [

    {
        name: "SPARQL Commands",
        colour: 0,
        blocks: [
          {
            type: "SPARQLCommand"
          }
        ]
    },
    {
        name: "PREFIX",
        colour: 230,
        blocks: [
          {
            type: "INPUT_INLINE_SPARQL_PREFIX"
          },
          {
            type: "CONSTANT_SPARQL_PREFIX"
          }
        ]
    },
    {
        name: "SELECT",
        colour: 61,
        blocks: [
          {
            type: "SELECT_FIELD"
          },
          {
            type: "CONSTANT_SELECT_FIELD"
          }]
    },
    {
      name: "WHERE",
      colour: 99,
      blocks: [
        {
          type: "STREAM_TIME_WINDOW"
        },
        {
            type: "CONSTANT_RDF_FIELD"
        },
        {
            type:"CONSTANT_FILTER_FIELD"
        }
      ]
    },
    {
      name: "RDF",
      colour: 87,
      blocks: [
        {
          type: "CONSTANT_RDF_FIELD"
        }
      ]
    }/*,
    {
      name: "Basic fields",
      colour: "#5CA65C",
      blocks: [
        {
          type: "text"
        },
        {
          type: "regexInput"
        },
        {
          type: "example_checkbox"
        }
        ,
        {
          type: "example_dropdown"
        },
        {
          type:"example_number"
        },
        {
          type:"example_textinput"
        }
      ]
    }*/
  ];
export class BlocklyQuery extends React.PureComponent{
    constructor(props) {
      super(props);
      this.myNotify = React.createRef();
      this.rd_executedTime_true=React.createRef();
      this.rd_executedTime_false=React.createRef();
      this.rd_selectRule_true=React.createRef();
      this.rd_selectRule_false=React.createRef();
      this.state={modalIsOpen:false,executing:false,enablePreSelecting:true,
        //query:INITIAL_CODE.sparqlQuery
        query:""
        ,initialXml:generateXMLBlocks(INITIAL_CODE.sparqlQuery),audio: null};
      this.toggleMicrophone = this.toggleMicrophone.bind(this);
      this.getMicrophone=this.getMicrophone.bind(this);
      this.stopMicrophone=this.stopMicrophone.bind(this);
      this.onSettingsChange=props.onSettingsChange;
      
    } 
    updateQueryState=({query})=>{
      this.setState({query});
    }
    openModal=()=>{
        this.setState({modalIsOpen:true,initialXml:generateXMLBlocks(this.state.query)});
    }
    afterOpenModal=()=>{
        //subtitle.style.color = '#f00';
    }  
    closeModal=()=>{
        this.setState({modalIsOpen:false});
    }
    startListening=()=>{
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.start();
        recognition.onstart = () => {
            console.log('Voice recognition started. Speak into the microphone.');
            this.getMicrophone();
        };
        recognition.onresult = async (event) => {
            const transcript = event.results[0][0].transcript;
            console.log('You said: ', transcript);
            this.myNotify.current.innerText =`You said:${transcript}`;
            const result = await fetchChatGPT(transcript);
            const jsonResult=await result.json();
            //console.log(jsonResult);
            const response=jsonResult.choices[0].message.content;
            console.log('\nChatGPT: ' + response);
            this.setState({query:response})
        };
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.stopMicrophone();
            
        };
        recognition.onend = () => {
            this.stopMicrophone();
            console.log('Voice recognition ended.');
        };
    }
    async getMicrophone() {
        const audio = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        });
        this.setState({audio});
      }
    
      stopMicrophone() {
        try {
            this.state.audio.getTracks().forEach(track => track.stop());
            this.setState({ audio: null });
        } catch (error) {
            console.log("catched error in stop Microphone");   
        }
        
      }
    
      toggleMicrophone() {
        this.state.audio ? this.stopMicrophone() : this.getMicrophone() ;
      }
      _readyData() {
       
        const {frame,log,highlightObject} = this.props;
         if(frame&&this.state.executing)
         {
             //this._execute(this.state.query,this.props.frame,this.props.log,this.state.enablePreSelecting,this.props.highlightObject);
             this._execute(output,this.props.frame,this.props.log,this.state.enablePreSelecting,this.props.highlightObject);
         }       
         return {isReady:true,hasData:true};
     }
    _execute(jsonQuery,frame,log,enablePreSelecting,highlightObject){
        var result;
        try {
            result=JSON.parse(jsonQuery);
        } catch (error) {
            console.log(error);
            return false;
        }
        const settings={...log.getStreamSettings()} 
        for (const stream in settings) {
            if(stream.startsWith("/")||stream.startsWith("V_"))
            settings[stream]=true;
        }
        if(!this.state.executing)
        {
            selectStreams(log,result,settings);
        }
        selectObjects(frame,result);
            /*
            const data=queryData(frame,
                //settings,
                query,enablePreSelecting,highlightObject);
            //log.updateStreamSettings(data.setting);
            */
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
        return <div className={this.props.queryPanelStatus?"QueryComponent query-panel-open":"QueryComponent query-panel-close"}>
            {/*
            <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        style={customStyles}
        contentLabel="Example Modal"
        >
        <SplitPane split="vertical" defaultSize={500} primary="second">
            <div>
            <ReactBlockly
                toolboxCategories={toolboxCategories}
                initialXml={this.state.initialXml}
                height="530px"
                wrapperDivClassName="fill-height"
                workspaceConfiguration={{
                grid: {
                    spacing: 20,
                    length: 3,
                    colour: "#ccc",
                    snap: true
                }
                }}
                workspaceDidChange={(workspace)=>{
                    const code = Blockly.JavaScript.workspaceToCode(workspace);
                    //var xmlDom = Blockly.Xml.workspaceToDom(workspace);
                    //var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
                    //console.log(xmlText);
                    //document.getElementById("code").value = code;
                    this.setState({
                        query: code
                    })
                }}
            />
            </div>
            <div>
            <CodeMirror height='581px' value={this.state.query} onChange={(code, data, value) => {
            this.setState({
              query: code.getValue(),
              //query: code,
              executing:false
            })}}  options={options}/>
            </div>
            </SplitPane>
      </Modal>
      */}
      {// <Sparnatural updateQueryState={this.updateQueryState}></Sparnatural>
      }
      {<CodeMirror value={this.state.query} onChange={(code, data, value) => {
            this.setState({
              query: code.getValue(),
              //query: code,
              executing:false
            })}}   options={options}/>}
      
            <fieldset style={{display:'none'}}>
            <legend><b>Execute Rule</b></legend>
            <div>
                <label>
                <input type="radio" name='rd_executedTime' ref={this.rd_executedTime_true}  />(Once Time)The query is executed only on the current frame.
                </label>
            </div>
            <div>
                <label>
                <input type="radio" name='rd_executedTime' defaultChecked={true}  ref={this.rd_executedTime_false} />(Many Times)The query is continuously executed on every frame.
                </label>
            </div>
            </fieldset>
            <fieldset style={{display:'none'}}>
            <legend><b>Highlight Rule</b></legend>
            <div>
            <label>
                <input type="radio" name='rd_selectRule'  ref={this.rd_selectRule_true}/>Remain status of previously selected Objects. 
            </label>
            </div>
            <div>
            <label>
                <input type="radio" name='rd_selectRule' defaultChecked={true} ref={this.rd_selectRule_false} />Highlight only matched Objects.
            </label>
            </div>
            </fieldset>


            <button className='ExecuteButton' title='Execute query' onClick={()=>{
                //console.log(this.state.query);
                if(!this.state.executing)     
                    {
                        //const runable= this._execute(this.state.query,this.props.frame,this.props.log,this.state.enablePreSelecting,this.props.highlightObject);
                        const runable= this._execute(output,this.props.frame,this.props.log,this.state.enablePreSelecting,this.props.highlightObject);
                        if(runable)
                        {
                            this.setState({
                                enablePreSelecting:this.rd_selectRule_true.current.checked,
                                executing:!this.rd_executedTime_true.current.checked
                            });
                            this.myNotify.current.innerText ="Query is Activated!";
                            console.log("enablePreSelecting:"+this.rd_selectRule_true.current.checked);
                            console.log("executing:"+!this.rd_executedTime_true.current.checked);
                            console.log(this.state);
                        }else{
                            this.myNotify.current.innerText ="JSON Syntax Error!!!";
                        }
                    }else{
                        this.setState({executing:false});
                        this.myNotify.current.innerText ="";
                    }
            }}>
                <IconContext.Provider value={iconConfig}>
                {!this.state.executing?<CiPlay1/>:<CiStop1/>}
                </IconContext.Provider>
                </button>
            <button className='ExecuteButton' title='Edit query' onClick={()=>{this.openModal();}}><IconContext.Provider value={iconConfig}><CiEdit/></IconContext.Provider></button>
            <button className='ExecuteButton Voice' title='Voice to get query' onClick={()=>{
                this.startListening();
            }}><IconContext.Provider value={iconConfig}>
            {this.state.audio ?<CiMicrophoneOff />:<CiMicrophoneOn />}
            </IconContext.Provider></button>
            <button className='ExecuteButton' onClick={()=>{
              this.onSettingsChange({queryPanelStatus:false});
            }}>
              <IconContext.Provider value={iconConfig}>
              <MdDisabledVisible></MdDisabledVisible>
              </IconContext.Provider>
            </button>
            <p ref={this.myNotify}></p>    
            {this.state.audio ? <AudioAnalyzer audio={this.state.audio} /> : ''}
           </div>
        }
    }
}

function selectStreams(log,result,settings)
{
    console.log(result);
    result.forEach(v => {
        let vehicleNS= v.stream=="ego_vehicle"?"":v.stream;
        settings[vehicleNS+"/points/raw"]=(v.lidar.points==true);
        settings[vehicleNS+"/camera/cam_front"]=(v.camera.cam_front==true); // mock topic name
    });
    log.updateStreamSettings(settings);
}
function selectObjects(frame,result)
{
    var objects=[];
    result.forEach(v => {
        let vehicleNS= v.stream=="ego_vehicle"?"":v.stream;
        const types=[];
        if(v.objects.pedestrian)
            types.push("PEDESTRIAN")
        if(v.objects.vehicle.car)
            types.push("CAR")
        if(v.objects.vehicle.cyclist)
            types.push("CYCLIST")
        const selectObjectsByTypes=(objectStream,types)=>{
            types=types.map(t=>t.toLowerCase());
            const objs=[];
            objectStream.features.forEach(f => {
                if(types.some(t=>t==f.base.classes[0].toLowerCase()))
                {
                    f.state.selected=true;
                    //highlightObject(f.base.object_id,true);
                    //highlightObject(f.id,true);
                    f.base.style.fill_color= '#ff8000aa';
                    console.log(f);
                    objs.push(f.base.object_id);
                }
                else{
                    /*if(!enablePreSelecting)
                    {
                        //console.log(enablePreSelecting);
                        //console.log(f);
                        //f.state={};
                        f.state.selected=false;
                        //f.base.style.fill_color= '#00000000';
                        delete f.base.style.fill_color;
                        //highlightObject(f.id,false);
                        //console.log(f);
                    } */
                }
            });
            return objs;
        }
        const objectStream=vehicleNS+"/detection/objects";
        const selectedObjects=frame.streams[objectStream]? selectObjectsByTypes(frame.streams[objectStream],types):[];
        if(selectedObjects.length>0)
            objects.push(selectedObjects)
    });
    return objects;
}


//export default BlocklyQuery

/*const getLogState = (log) => ({
  timestamp: log.getCurrentTime(),
  frame:log.getCurrentFrame(),
  log:log
  //highlightObject: highlightObject
});
const BlocklyObjectQueryContainer = connectToLog({Component: BlocklyQuery, getLogState});
export default BlocklyObjectQueryContainer; */
