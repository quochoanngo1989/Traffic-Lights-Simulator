import { Stream,Category } from "./builders/stream";

//import * as THREE from 'three';
export default class PoseConverter{
    constructor(topicConfig) {
        this.topicConfig=topicConfig;
        this.streamName =topicConfig.config.xvizStream;
	}
	convertMessage(synchronizedData,builder) {
        const pose=synchronizedData.get("/pose");
        const stream=new Stream(this.streamName);
        stream.category(Category.POSE).message(pose);
        builder.timestamp(pose.timestamp)
        builder.stream(stream);  
  }
}