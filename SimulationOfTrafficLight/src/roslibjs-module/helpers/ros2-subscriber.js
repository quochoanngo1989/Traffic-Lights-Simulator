import RosSubscriberInterface from "./ros-subscriber-interface";
import { preprocessMSG } from "./ros2-msg-preprocessor";
import {Ros,Topic} from 'roslib'
export default class Ros2Subscriber extends RosSubscriberInterface{
    constructor(configuration){
        super(configuration);
        this.status='Not connected';
        //this.subStatus='Not subscribed';
        this.subscriptions=[];
    }
   start=(ros_websocket_addr='ws://192.168.178.67:9090')=>{//ws://192.168.178.53:9090 ,ws://192.168.50.118:9090, ws://192.168.50.167:9090
        return new Promise((resolve,reject)=>{ 
            this.ros = new Ros({encoding: 'ascii'});
            this.ros.connect(ros_websocket_addr)
            // won't let the user connect more than once
            this.ros.on('error', (error)=>{
                this.status=error;
                console.log("error",this.status)
                reject(error);
            });

            // Find out exactly when we made a connection.
            this.ros.on('connection',()=>{
                this.status='Connected!';
                console.log(this.status);
                resolve(this.ros);
            });

            this.ros.on('close',()=>{
                this.status='Connection closed';
                console.log("close",this.status);
            });    
        })
    }
    subscribe=()=>{
        this.start().then((ros)=>{
            const poseListener = new Topic({
                  ros: ros,
                  name: this.poseTopic.topic,
                  messageType: this.poseTopic.type
                });
            poseListener.subscribe(async (msg)=> {
                    //this.start_timestamp=this.start_timestamp==undefined?msg.header.stamp.sec+msg.header.stamp.nanosec*Math.pow(10,-9):this.start_timestamp;
                    const times_stamp=msg.header.stamp.sec+msg.header.stamp.nanosec*Math.pow(10,-9);
                    if(this.start_timestamp==undefined){
                        this.start_timestamp=times_stamp;
                        this.current_timestamp=times_stamp;
                    }
                    if(times_stamp>=this.current_timestamp)
                        {   
                            this.current_timestamp=times_stamp;
                            this.poseBuffer.push(msg);
                        }
                });
            this.subscriptions.push(poseListener);
            this.getTopicConfig().forEach(t=>{
                const listener = new Topic({
                    ros: ros,
                    name: t.topic,
                    messageType: t.type
                  });
                listener.subscribe(async (msg)=> {
                    const pre_msg= await preprocessMSG(t,msg)
                    this.push(t,pre_msg);
                });
                this.subscriptions.push(listener);
              })
            this.status="Subscribed";
        }).catch((error)=>{
            console.log(error);
        })
    }
    shutdown=()=>{
        this.subscriptions.forEach(listener=>{
            listener.unsubscribe();
        })
        this.status="Unsubscribed";
        this.ros.close();
    }
    getStatus=()=>{
        if(this.status=="Subscribed")
        {
            if(this.start_timestamp==undefined)
                return "Waiting data";
            else
                return "Receiving data";
        }
        return this.status;
    }
}