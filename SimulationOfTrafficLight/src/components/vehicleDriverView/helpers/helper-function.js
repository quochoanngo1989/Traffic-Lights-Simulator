export function getConnectedVNamesFromFrame(frame,startsWith="V_")
{
    return Object.keys(frame.streams)
    .filter(name=>name.startsWith(startsWith))
    .map(name=>name.split("/")[0])
    .reduce((names,name)=>{
        if(!names.some(n=>n==name))
        {
            names.push(name);
        }
        return names;
    },[]);
}

export function getConnectedVPosesFromFrame(frame,PoseStreamName="/vehicle_pose")
{
    const vehicleNames=getConnectedVNamesFromFrame(frame);
    return vehicleNames.filter(vehicleName=>{
        return frame.streams[vehicleName+PoseStreamName].stream.message;
        }).map((vehicleName,index)=>{
        const pose=frame.streams[vehicleName+PoseStreamName].stream.message;
        return  {name:vehicleName,pose:pose}
      })
}

//import WebMercatorViewport from 'viewport-mercator-project';
import {WebMercatorViewport} from "@math.gl/web-mercator";
export function getViewPortCoordinate(viewState, {lng,lat}){
    const { longitude, latitude, zoom, pitch, bearing, width, height } = viewState;
    console.log(viewState);
    const state={
        "longitude": 13.377746996209458,
        "latitude": 52.5165878955996,
        "zoom": 17.199,
        "pitch": 50,
        "bearing": -90.60,
        //"offsetX": 0,
        //"offsetY": 0,
        "width": 869,
        "height": 547
    }
      const viewport = new WebMercatorViewport( state
        /*{
        width,
        height,
        longitude,
        latitude,
        zoom,
        pitch,
        bearing,
      }*/
    );
      const point = viewport.project([lng,lat]);
    return point;
}
export function getLngLatCoordinate(viewState,{x,y}){
    const { longitude, latitude, zoom, pitch, bearing, width, height } = viewState;
      const viewport = new WebMercatorViewport({
        width,
        height,
        longitude,
        latitude,
        zoom,
        pitch,
        bearing,
      });
      const lngLat = viewport.unproject([x,y]);
    return lngLat;
}