import React from "react";
import {annotate2DBoxImage,drawImage} from "../../roslibjs-module/helpers/common/process-image";
export class Camera extends React.PureComponent{
    constructor(props){
        super(props)
        this.canvasRef=React.createRef();
    }
    componentDidUpdate(){
        const {frame,streamName}=this.props;
        if(!frame||!frame.streams[streamName])
            return;
        const camera_msg=frame.streams[streamName].stream.message;
        const {detect_object,showMode,image,style}=camera_msg;
        if(image==null)
            return;
        if(showMode==1){
            drawImage(this.canvasRef.current,image,style);
        }else if(showMode==2){
            annotate2DBoxImage(this.canvasRef.current,image,detect_object,style);
        }
    }
    render(){
      if(!this.props.frame)
        return <></>
      return <>
        <canvas ref={this.canvasRef} style={{width:360,height:301}}></canvas>
        </>
    }
}


