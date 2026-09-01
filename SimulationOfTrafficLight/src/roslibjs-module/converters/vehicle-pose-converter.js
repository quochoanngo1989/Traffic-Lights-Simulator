import { Category, Stream } from "./builders/stream";

//import * as THREE from 'three';
export default class VehiclePose{
	constructor(topicConfig) {
    this.topicConfig=topicConfig;
    this.streamName =topicConfig.config.xvizStream;
	}
	convertMessage(synchronizedData,builder) {
        const vehiclePose=synchronizedData.get(this.topicConfig.namespace+"_pose");
        const stream=new Stream(this.streamName);
        stream.category(Category.POSE).message(vehiclePose);
        builder.stream(stream);
  }
}