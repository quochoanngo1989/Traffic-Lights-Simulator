import { getTimestamp } from "./common/synchronize";
export default class TopicBuffer{
	constructor(t){
	this.topic=t;
	this.buffer=[];
	this.bufferSize=t.size?t.size:20;
	this.drop=0;
	}
	push(msg){
	this.buffer.push(msg);
		if(this.buffer.length>this.bufferSize)
		{
			this.buffer.shift();
			this.drop=this.drop+1;
		}
	}
	read(){
		//return this.buffer.shift();//
		return this.buffer.pop();
	}
	read(timestamp,synchronizeMode){
		//compare timestamp to get the closest Message to  timestamp
		const cpBuffer=[...this.buffer];
		let msgCandidator= cpBuffer.pop();
		if(msgCandidator)
		{
			if(cpBuffer.length){
				return cpBuffer.reduce((msgMin, msgCurrent) => {
					const mDelta=timestamp-getTimestamp(msgMin.header);
					const cDelta=timestamp-getTimestamp(msgCurrent.header);
					return cDelta<mDelta&&cDelta>=0?msgCurrent:msgMin; //!IMPORTANT Run the lastest ROSBAG for EGO VEHICLE 
				},msgCandidator);
			}
		}
		return msgCandidator;
	}
}
