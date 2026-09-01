
import React from "react";
import { generateSignal,COLOR_CODE,SHAPE_CODE,STATUS_CODE } from "./helpers/traffic-light-helper";
export class TrafficLight extends React.PureComponent{
    constructor(props){
        super(props);
    }
    render(){
        return <>
        <TrafficLightSignal size={100} color={2} shape={0} status={1}></TrafficLightSignal>
        </>
    }
}


class TrafficLightSignal extends React.PureComponent{
    constructor(props){
        super(props);
        
    }
    componentDidMount(){
        const styleSheet = document.styleSheets[0];
        let keyframes = '@keyframes flashing { 0% { opacity: 1; } 50% { opacity: 0.2; } 100% { opacity: 1; } }';
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    }
    render(){
        //const signalInfor=generateSignal({size,colorCode,shapeCode,statusCode});
        const size=50;
        return <>
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.FLASHING})}
        <br></br>

        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.CROSS,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.CROSS,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.CROSS,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.CROSS,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.CROSS,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.CROSS,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.CROSS,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.CROSS,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.CROSS,statusCode:STATUS_CODE.FLASHING})}
        <br></br>

        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.LEFT_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.LEFT_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.LEFT_ARROW,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.LEFT_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.LEFT_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.LEFT_ARROW,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.LEFT_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.LEFT_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.LEFT_ARROW,statusCode:STATUS_CODE.FLASHING})}
        <br></br>

        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.RIGHT_ARROW,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.RIGHT_ARROW,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.RIGHT_ARROW,statusCode:STATUS_CODE.FLASHING})}
        <br></br>


        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.UP_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.UP_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.UP_ARROW,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.UP_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.UP_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.UP_ARROW,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.UP_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.UP_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.UP_ARROW,statusCode:STATUS_CODE.FLASHING})}
        <br></br>

        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.UP_LEFT_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.UP_LEFT_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.UP_LEFT_ARROW,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.UP_LEFT_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.UP_LEFT_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.UP_LEFT_ARROW,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.UP_LEFT_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.UP_LEFT_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.UP_LEFT_ARROW,statusCode:STATUS_CODE.FLASHING})}
        <br></br>

        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.UP_RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.UP_RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.UP_RIGHT_ARROW,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.UP_RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.UP_RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.UP_RIGHT_ARROW,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.UP_RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.UP_RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.UP_RIGHT_ARROW,statusCode:STATUS_CODE.FLASHING})}
        <br></br>
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.DOWN_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.DOWN_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.DOWN_ARROW,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.DOWN_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.DOWN_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.DOWN_ARROW,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.DOWN_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.DOWN_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.DOWN_ARROW,statusCode:STATUS_CODE.FLASHING})}
        <br></br>
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.DOWN_LEFT_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.DOWN_LEFT_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.DOWN_LEFT_ARROW,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.DOWN_LEFT_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.DOWN_LEFT_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.DOWN_LEFT_ARROW,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.DOWN_LEFT_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.DOWN_LEFT_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.DOWN_LEFT_ARROW,statusCode:STATUS_CODE.FLASHING})}
        <br></br>

        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.DOWN_RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.DOWN_RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.DOWN_RIGHT_ARROW,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.DOWN_RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.DOWN_RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.DOWN_RIGHT_ARROW,statusCode:STATUS_CODE.FLASHING})}

        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.DOWN_RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_ON})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.DOWN_RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_OFF})}
        {generateSignal({size,colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.DOWN_RIGHT_ARROW,statusCode:STATUS_CODE.FLASHING})}
        

        </>;
    }
}
