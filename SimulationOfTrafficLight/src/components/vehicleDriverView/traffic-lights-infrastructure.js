import React from 'react';
import {COLORS,COLOR_CODE,SHAPE_CODE,STATUS_CODE} from "./helpers/traffic-light-helper";
import { TrafficLight3D,TRAFFIC_LIGHT_TYPE } from './traffic-light-3Dcomponent';
const TRAFFIC_LIGHTS_INFRASTRUCTURE=[
    {
            id:"lightCluster1",
            coordinates:{longitude:13.306388402582591,latitude:52.500802095809206},
            yPosition:3,
            yaw:Math.PI,
            trafficLightSignal3DConfig:{lightType:TRAFFIC_LIGHT_TYPE.VERTICAL,scale:[0.0001,0.0001,0.0001],visible2D:true,size2D:30,maxVisibleDistance2D:100},
            lightSignalData:[
                //{id:"signal-Red",colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.RIGHT_ARROW,statusCode:STATUS_CODE.SOLID_OFF},
                //{id:"signal-Amber",colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.UP_ARROW,statusCode:STATUS_CODE.SOLID_OFF},
                //{id:"signal-Green",colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.LEFT_ARROW,statusCode:STATUS_CODE.FLASHING},
                {id:"signal-Red",colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_OFF},
                {id:"signal-Amber",colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_OFF},
                {id:"signal-Green",colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_ON},
                /*{id:"signal-Amber-1",colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.FLASHING},
                {id:"signal-Red-1",colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.FLASHING},
                {id:"signal-Green-2",colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_OFF},
                {id:"signal-Amber-2",colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_OFF},
                {id:"signal-Red-2",colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_OFF}*/
            ],
            color:COLORS.ON_GREEN,
            time:9
        }
        
    ];
function generateLightSignalData(selectedSignalGroups){
    const errorSignal={
            lightSignalData:[
                {id:"signal-Red",colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.FLASHING},
                {id:"signal-Amber",colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.FLASHING},
                {id:"signal-Green",colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.FLASHING},
            ],
            color:COLORS.ON_RED,
            time:0 }

    if( (!selectedSignalGroups.length)||
        (!selectedSignalGroups.every(g => 
            g.eventState === selectedSignalGroups[0].eventState 
            && g.remainingSeconds === selectedSignalGroups[0].remainingSeconds 
            && (g.eventState==3||g.eventState==6||g.eventState==8)))){
                return errorSignal;
            }
    /*eventState=3 => stop-And-Remain =>RED*/    
    if(selectedSignalGroups[0].eventState==3){
        return {
            lightSignalData:[
                {id:"signal-Red",colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_ON},
                {id:"signal-Amber",colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_OFF},
                {id:"signal-Green",colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_OFF},
            ],
            color:COLORS.ON_RED,
            time:selectedSignalGroups[0].remainingSeconds*10
        }
    }
    /*eventState=6 => protected-Movement-Allowed =>Green*/
    else if (selectedSignalGroups[0].eventState==6){
        return {
            lightSignalData:[
                {id:"signal-Red",colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_OFF},
                {id:"signal-Amber",colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_OFF},
                {id:"signal-Green",colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_ON},
            ],
            color:COLORS.ON_GREEN,
            time:selectedSignalGroups[0].remainingSeconds*10
        }
    /*eventState=8 => protected-clearance =>Yellow/Amber*/
    }else if (selectedSignalGroups[0].eventState==8){
        return {
            lightSignalData:[
                {id:"signal-Red",colorCode:COLOR_CODE.RED,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_OFF},
                {id:"signal-Amber",colorCode:COLOR_CODE.AMBER,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_ON},
                {id:"signal-Green",colorCode:COLOR_CODE.GREEN,shapeCode:SHAPE_CODE.CIRCLE,statusCode:STATUS_CODE.SOLID_OFF},
            ],
            color:COLORS.ON_AMBER,
            time:selectedSignalGroups[0].remainingSeconds*10
        }
    }else{
        return errorSignal;
    }

}

export class TrafficLightsInfrastructure
    extends React.PureComponent {

    render() {

        const {
            spatSignalGroups = [],
            lightSignalGroupConfig = []
        } = this.props;


        console.log(
            "TrafficLightsInfrastructure spatSignalGroups:",
            spatSignalGroups
        );


        const trafficLightsInfrastructure =
            lightSignalGroupConfig.map(
                light => {

                    const selectedSignalGroups =
                        spatSignalGroups.filter(
                            group => {

                                return light
                                    .controledSignalGroups
                                    .some(
                                        signalGroup => {

                                            return Number(
                                                signalGroup
                                            ) === Number(
                                                group.signalGroup
                                            );
                                        }
                                    );

                            }
                        );


                    const signal =
                        generateLightSignalData(
                            selectedSignalGroups
                        );


                    return {
                        ...light,
                        ...signal
                    };
                }
            );


        //console.log("trafficLightsInfrastructure:",trafficLightsInfrastructure);
        return (
            <>
                {
                    trafficLightsInfrastructure.map(
                        (args, index) => {

                            return (
                                <TrafficLight3D
                                    {...args}
                                    {...this.props}
                                    key={index}
                                />
                            );
                        }
                    )
                }
            </>
        );
    }
}