export const Category={
    POSE:"pose",
    IMAGE:"image",
    LIDAR:"lidar",
    VELOCITY:"velocity",
    ACCELERATION:"acceleration",
    VARIABLE:"variable"}
export class Stream{
    constructor(streamName){
        this.streamName=streamName;
        this.stream={streamName:streamName};
    }
    category(category){
        this.stream.category=category;
        return this;
    }
    message(msg){
        this.stream.message=msg;
        return this;
    }
    description(desc)
    {
        this.stream.description=desc;
        return this;
    }
    active(active)
    {
        this.stream.active=active;
        return this;
    }
    getMessage(){
        return this.stream; 
    }
}