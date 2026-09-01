import React from 'react';
import { SurveillanceCamera3D } from './surveillance-camera-3Dcomponent';

const SURVEILLANCE_CAMERAS_INFRASTRUCTURE=[{
            id:"surveillanceCamera1",
            coordinates:{longitude:24.921034996910358+0.00005 ,latitude:60.16471111723738},
            yPosition:2,
            yaw:Math.PI/2
        },
        {
            id:"surveillanceCamera2",
            coordinates:{longitude:24.924789917093964+0.00005,latitude:60.16485614079119},
            yPosition:2,
            yaw:Math.PI
        },
        {
            id:"surveillanceCamera3",
            coordinates:{longitude:24.92556290095064+0.00005,latitude:60.1650147212192},
            yPosition:2,
            yaw:Math.PI
        },
        {
            id:"surveillanceCamera4",
            coordinates:{longitude:24.921210157801386+0.00005,latitude:60.16357183820778},
            yPosition:2,
            yaw:-(Math.PI/2)
        }
    ];
export class SurveillanceCamerasInfrastructure extends React.PureComponent{
    constructor(props){
        super(props);
    }
    render(){
        return <>{SURVEILLANCE_CAMERAS_INFRASTRUCTURE.map((args,index)=>{
            return <SurveillanceCamera3D {...args} {...this.props}  key={index}></SurveillanceCamera3D>
        })}</>;
    }

}