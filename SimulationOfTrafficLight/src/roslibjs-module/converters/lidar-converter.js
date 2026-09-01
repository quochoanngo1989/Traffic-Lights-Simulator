//import { v4 as uuid } from 'uuid';
import { synchronizeCoordinate,base64ToUint8Array } from "../helpers/common/synchronize";
import { Stream,Category } from "./builders/stream";
export default class LidarConverter{
  constructor(topicConfig) {
    this.streamName=topicConfig.config.xvizStream;
    this.topicConfig=topicConfig;
  }
  async convertMessage(synchronizedData, builder) {
    const lidar_msg=synchronizedData.get(this.topicConfig.topic); 
    if(lidar_msg==undefined)
        return;
    const buffer=base64ToUint8Array(lidar_msg.data);
    const point_size=lidar_msg.point_step;
    const {positions, reflectance}=loadProcessedLidarData(buffer,point_size);
    //const s_positions=synchronizePositions(this.topicConfig,synchronizedData,positions);
    const message={position:positions,reflectance,header:lidar_msg.header}
    const stream=new Stream(this.streamName);
    stream.category(Category.LIDAR).message(message);
    builder.stream(stream);
  }
}

function synchronizePositions(topicConfig,synchronizedData,positions){
  if(!topicConfig.namespace)
      return positions;
  else{
    const pose=synchronizedData.get("/pose")
    const n_pose=synchronizedData.get(topicConfig.namespace+"_pose");
    if(pose&&n_pose)
    {
      return synchronizeCoordinate(pose,n_pose,positions);
    }
  }
  return [];
}
function loadProcessedLidarData(uint8Array, pointSize) {
  /*
    Data Fields:
    datatypes (http://docs.ros.org/api/sensor_msgs/html/msg/PointField.html)
      7: float32
    [
      { name: 'x', offset: 0, datatype: 7, count: 1 },
      { name: 'y', offset: 4, datatype: 7, count: 1 },
      { name: 'z', offset: 8, datatype: 7, count: 1 },
      { name: 'intensity', offset: 12, datatype: 7, count: 1 } ]
   */
  const pointsCount = uint8Array.length / pointSize;
  const buf = Buffer.from(uint8Array); // eslint-disable-line

  // We could return interleaved buffers, no conversion!
  const positions = new Float32Array(3 * pointsCount);
  const reflectance = new Float32Array(pointsCount);

  for (let i = 0; i < pointsCount; i++) {
    positions[i * 3 + 0] = buf.readFloatLE(i * pointSize);
    positions[i * 3 + 1] = buf.readFloatLE(i * pointSize + 4);
    positions[i * 3 + 2] = buf.readFloatLE(i * pointSize + 8);
    reflectance[i] = buf.readFloatLE(i * pointSize + 12);
  }
  return {positions, reflectance};
}

