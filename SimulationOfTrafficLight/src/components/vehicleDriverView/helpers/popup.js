import React, { useState } from "react";
import { useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import {connectToLog} from 'streetscape.gl';
import { getConnectedVPosesFromFrame } from "./helper-function";

class MapPopUp extends React.PureComponent{
    constructor(props){
        super(props);
        this.updatePopUpStatus=this.props.updatePopUpStatus;
    }
    componentDidUpdate(){
        
    }
    render(){
        const popupInfo=this.props.popupInfo;
        return  this.props.popupInfo.popupShown&&<Popup
        longitude={popupInfo.longitude}
        latitude={popupInfo.latitude}
        offset={[0, -50]}
        anchor={"bottom"}
        dynamicPosition={false}
        onClose={() => {
          const popStatus={};
          popStatus[popupInfo.name]=false;
          this.updatePopUpStatus(popStatus);
      }}
        closeOnClick={false}>
        <div>
          <h4>{popupInfo.name}</h4>
          {//<childrenComponent></childrenComponent>
          }
        </div>
      </Popup>      
    }
}
/**
function MapPopUp({popupInfo,updatePopUpStatus,childrenComponent}) {
  let popupShown=popupInfo&&popupInfo.popupShown;
  useEffect(()=>{
    popupShown=popupInfo&&popupInfo.popupShown;
  },[popupInfo])

  //if(!popupShown)return <></>
  console.log({popupInfo,popupShown});
  return  popupShown&&<Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          offset={[0, -50]}
          anchor={"bottom"}
          dynamicPosition={false}
          onClose={() => {
            const popStatus={};
            popStatus[popupInfo.name]=false;
            console.log(popStatus);
            updatePopUpStatus(popStatus);
        }}
          closeOnClick={false}>
          <div>
            <h4>{popupInfo.name}</h4>
            {//<childrenComponent></childrenComponent>
            }
          </div>
        </Popup>
}
 */
const EGO_NAME="Ego vehicle";
const INIT_EGO_POPUP={popupShown:true,name:EGO_NAME,longitude: 24.921074799925293,
    latitude: 60.16425136538851};
const INIT_CONNECTED_VEHICLE_POPUP={popupShown:true,longitude: 24.921074799925293,
    latitude: 60.16425136538851};
const INIT_DETECTED_VEHICLE_POPUP={popupShown:true,longitude: 24.921074799925293,
    latitude: 60.16425136538851};

export class PopUps extends React.PureComponent {
    constructor(props){
        super(props)
        //this.popUpStatus= props.popUpStatus;
        this.updatePopUpStatus=props.updatePopUpStatus;
    }
    _updatePopUpStatus=(popupInfo)=>{
        const popUpStatus={...this.props.popUpStatus};
        popUpStatus[popupInfo.name]=popupInfo.popupShown;
        this.updatePopUpStatus(popUpStatus);
    }
    render(){
        const {timestamp,frame}=this.props;        
        if(frame)
            {
                const egoPose= frame.streams["/vehicle_pose"].stream.message;
                const egoPopUpInfo={...INIT_EGO_POPUP,popupShown:this.props.popUpStatus["Ego vehicle"],longitude:egoPose.longitude,latitude:egoPose.latitude}
                const vehiclePoses=getConnectedVPosesFromFrame(frame);

                return <>
                {egoPopUpInfo.popupShown&&<MapPopUp popupInfo={{...egoPopUpInfo}} updatePopUpStatus={this.updatePopUpStatus}></MapPopUp>}  
                {vehiclePoses.map(vehicle=>{
                    const pose=vehicle.pose;
                    const vehiclePopUpInfo={...INIT_CONNECTED_VEHICLE_POPUP,popupShown:this.props.popUpStatus[vehicle.name],name:vehicle.name,longitude:pose.longitude,latitude:pose.latitude}
                    return <>
                    {vehiclePopUpInfo.popupShown&&<MapPopUp key={vehiclePopUpInfo.name} popupInfo={vehiclePopUpInfo} updatePopUpStatus={this.updatePopUpStatus}></MapPopUp>}
                    </>
                })} 
               </>
            }
        else{
            return <></>
        }
        
    }
}
