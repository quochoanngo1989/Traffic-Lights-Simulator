import React, { Component } from 'react';
import { IoIosClose } from "react-icons/io";
import { TbColumns1,TbColumns2,TbColumns3 } from "react-icons/tb";
import { IconContext } from "react-icons";
import { PANELS } from '../../constants';
class DraggablePanel extends Component {
    constructor(props) {
        super(props);
        this.header = React.createRef();
        this.panel=React.createRef();
        this.state={width:"350px"}
        this.changeSettings=props.changeSettings;
        this.settings=props.settings;
        this.panelID=props.panelID;
    }
 dragElement=()=> {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var elmnt=this.panel.current;
  this.header.current.onmousedown = dragMouseDown;
  //this.panel.current.onmousedown = dragMouseDown;
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

    componentDidMount(){
        this.dragElement();
    }
    render(){
        return <div id="mydiv" ref={this.panel} style={{
            width:this.state.width,
            position: "absolute",
            zIndex: 99999,
            backgroundColor: "#f1f1f1",
            border: "1px solid #d3d3d3",
            textAlign: "center"
          }}>
          <div id="mydivheader" ref={this.header} style={{
  padding: "0px",
  lineHeight:"2em",
  cursor: "move",
  zIndex: 10,
  backgroundColor: "#2196F3",
  color: "#fff",
  textAlign:"left"
}}><span style={{ paddingLeft:"5px",minWidth:"300px", fontSize:"1em"}}>{this.props.title}</span><IconContext.Provider value={{ color: "white", className: "global-class-name", size:'2em' }}>
                <IoIosClose style={{cursor:"pointer", float:"right", display:"block" }} onClick={()=>{
                  if(this.panelID==PANELS.CameraPanel)
                  {
                    this.settings.cameraPanelStatus=false;this.changeSettings(this.settings);
                  }else if(this.panelID==PANELS.QueriedCameraPanel){
                    this.settings.queriedCameraPanelStatus=false;this.changeSettings(this.settings);
                  }
                  }}/>
                <TbColumns1 style={{cursor:"pointer", width:"1em",height:"1em", marginTop:"0.5em", float:"right", display:"block" }} onClick={()=>{console.log(this.state.width); this.setState({width:"350px"})}}></TbColumns1>
                <TbColumns2 style={{cursor:"pointer", width:"1em",height:"1em", marginTop:"0.5em", float:"right", display:"block" }} onClick={()=>{console.log(this.state.width);this.setState({width:"600px"})}}></TbColumns2>
                <TbColumns3 style={{cursor:"pointer", width:"1em",height:"1em", marginTop:"0.5em", float:"right", display:"block" }} onClick={()=>{console.log(this.state.width);this.setState({width:"750px"})}}></TbColumns3>
                </IconContext.Provider></div>
          {this.props.children}
          <div style={{clear:"both"}}></div>
          
        </div>;
    }    
}

export default DraggablePanel;