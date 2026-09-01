import React from 'react';
import Popup from 'reactjs-popup';
export default class ViewerSetting extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render=()=> {
    return <Popup trigger={<div style={{position:"absolute",top:"10px",right:"10px",zIndex:7 }}><button style={{cursor:"pointer",padding:"0px"}}><span style={{margin:0,padding:0}} dangerouslySetInnerHTML={{__html: '&#9706'}}></span></button></div>} position="bottom right">
        <div>{this.props.children}</div>
      </Popup>
    }
}