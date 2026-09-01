// Define a Shape "interface" using a convention

import TopicBuffer from "./topic-buffer";
import {getPose,getTimestamp} from "./common/synchronize";
import { GPS_FIX,GPS_IMU,DETECTION_LIDAR_DETECTOR_OBJECTS,ODOM_VELOCITY,VELODYNE_POINTS,INFRASTRUCTURE_CAMERA,VEHICLE_CAMERA,VEHICLE_DETECTION_CAMERA,INFRASTRUCTURE_DETECTION_CAMERA } from "./const-defined-ros-topic";

export default class RosSubscriberInterface {
    constructor(configuration) {
        if (this.constructor === RosSubscriberInterface) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.nodeName="XVIZRosNode";
        const config=analyzeConfig(configuration);
        this.topics=config.topics;
        this.namespaces=config.namespaces;
        this.poseTopic=config.poseTopic;
        this.buffer=config.buffer;
        this.bufferTimestamps=config.bufferTimestamps;
        this.gps=config.gps;
        this.imu=config.imu;
        this.poseBuffer=[];
        this.start_timestamp=undefined;
    }
    start(){
        throw new Error("Method 'start()' must be implemented.");
    }

    shutdown(){
        throw new Error("Method 'shutdown()' must be implemented.");
    }
    push=(t,msg)=>{
        const timestamp=msg.header.stamp.sec+msg.header.stamp.nanosec*Math.pow(10,-9);
        if(this.bufferTimestamps.get(t.topic)<timestamp)
        {
          this.buffer.get(t.topic).push(msg);
          this.bufferTimestamps.set(t.topic,timestamp);
        }else{
          
        }
      }
    synchronizeData=(synchronizeMode)=>{
        //To do : implement synchronize mode 
        const map=new Map();
        if(this.poseBuffer.length&&this.buffer.get(this.imu).buffer.length){
          //PoseTopic is set to GPS_FIX as default
          const gpsPose=this.poseBuffer.pop();
          const timestamp=getTimestamp(gpsPose.header);
          map.set(this.poseTopic.topic,gpsPose);
          Array.from(this.buffer.keys()).forEach(k=>{
            //map.set(k,this.buffer.get(k).read(timestamp,synchronizeMode));
            map.set(k,this.buffer.get(k).read());
          });
          if(map.get(this.gps)&&map.get(this.imu))
            map.set("/pose",getPose(map.get(this.gps),map.get(this.imu),{yaw:+Math.PI/35}));
          this.namespaces.forEach(namespace=>{
            const gps=GPS_FIX.topic;
            const imu=GPS_IMU.topic;
            const gpsData=map.get(namespace+gps);
            const imuData=map.get(namespace+imu);
            if(gpsData&&imuData){
              map.set(namespace+"_pose",getPose(gpsData,imuData,{yaw:+Math.PI/35}));
            }
          });
        }
        return map;
      }
    getStartTimestamp=()=>{
        return this.start_timestamp;
      }
    getTopicConfig=()=>{
        return this.topics;
      }
}

function analyzeConfig(configuration){
  const namespaces=configuration.VEHICLES.map(v=>"/"+v.name);
  const poseTopic=configuration.EGO_VEHICLE.poseTopicConfig;
  const gps=configuration.EGO_VEHICLE.gps;
  const imu=configuration.EGO_VEHICLE.imu;
  const v_topics=configuration.VEHICLES.map(v=>{return v.topicConfig.map(t=>{
        const xt={...t,config:{...t.config}}
        xt.vname=v.name;
        xt.namespace="/"+v.name;
        xt.topic=xt.namespace+t.topic;
        if(xt.config.xvizStream)
        {
          xt.config.xvizStream=v.name+t.config.xvizStream;
        }
    return xt})});
  const topics=[...configuration.EGO_VEHICLE.topicConfig,...v_topics.flat()];
  const bufferConfig=(topics=>{
    const buffer=new Map();
    const bufferTimestamps=new Map();
    topics.forEach(t=>{
              buffer.set(t.topic,new TopicBuffer(t));
              bufferTimestamps.set(t.topic,0);
    })
    return {buffer,bufferTimestamps};
    })(topics);
  return {namespaces,poseTopic,gps,imu,topics,...bufferConfig}
}