import { MessageBuilder } from "./builders/message-builder";
import PoseConverter from "./pose-converter";
import VehiclePose from "./vehicle-pose-converter";
import LidarConverter from "./lidar-converter";
import SensorImage from './sensor-image-converter';
import Ros2Subscriber from "../helpers/ros2-subscriber";
import ROS_XVIZ_TOPIC_CONFIG from '../helpers/ros-xviz-topics-config';
import {ROS_TYPE_AW_DETECTED_OBJECT_ARRAY,ROS_TYPE_FLOAT32,ROS_TYPE_FLOAT32_MULTIARRAY,ROS_TYPE_IMU,ROS_TYPE_NAV_SAT_FIX,ROS_TYPE_SENSOR_MSGS_POINTCLOUD2,ROS_TYPE_SENSOR_MSGS_IMAGE,ROS_TYPE_VISION_MSGS_DETECTION2D_ARRAY } from '../helpers/const-defined-ros-topic';
export class StreamConverter {
    constructor(){
      this.rosSubscriber=new Ros2Subscriber(ROS_XVIZ_TOPIC_CONFIG);
      this.rosSubscriber.subscribe();
      }
    initialize() {
      const poseConverter=new PoseConverter(ROS_XVIZ_TOPIC_CONFIG.EGO_VEHICLE.poseTopicConfig);
      const topicConfig=this.rosSubscriber.getTopicConfig();
      this.converters=this.matchConfigToConverters(topicConfig);
      this.converters.unshift(poseConverter);
      console.log(topicConfig);
    }
    async convertMessage(){
      const messageBuilder = new MessageBuilder();
        const synchronizedData=this.rosSubscriber.synchronizeData();
        const positionMSG=synchronizedData.get(ROS_XVIZ_TOPIC_CONFIG.EGO_VEHICLE.poseTopicConfig.topic);
        if(positionMSG!=undefined)
        {
          for (let i = 0; i < this.converters.length; i++){ 
            {
              await this.converters[i].convertMessage(synchronizedData,messageBuilder);
            }
          }
          const message=messageBuilder.getMessage();
          return message; 
        }
        return positionMSG;
      }
    getStartTimestamp(){
      return this.rosSubscriber.getStartTimestamp();
    }
    getEndTimestamp(duration=90){
      return this.rosSubscriber.getStartTimestamp()+duration;
    }
    matchConfigToConverters(topicConfig){
      const converters=[];
      topicConfig.forEach(topic=>{
          if(topic.type==ROS_TYPE_SENSOR_MSGS_POINTCLOUD2)
            {
              converters.push(new LidarConverter(topic));
            }
            else if(topic.type==ROS_TYPE_AW_DETECTED_OBJECT_ARRAY)
            {
              converters.push(new DetectedObjects(topic));
            }else if (topic.type==ROS_TYPE_NAV_SAT_FIX&&topic.namespace)
            {
              converters.push(new VehiclePose(topic));
            }else if(topic.type==ROS_TYPE_FLOAT32)
            {
              //converters.push(new Float32Converter(topic));
            }
            else if(topic.type==ROS_TYPE_SENSOR_MSGS_IMAGE)
            {
              converters.push(new SensorImage(topic));
            }
      })
      return converters;
    }
    shutdown(){
      this.rosSubscriber.shutdown();
    }
  }
  
  