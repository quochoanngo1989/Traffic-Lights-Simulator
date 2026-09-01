export class StreamBuffer{
    constructor({streamConverter,cacheLength=30,streamingDuration=99999,frequency=100}){
        this.buffer=[];
        this.initialFirstFrame=null;
        this.frame=null;
        this.cacheLength=cacheLength;
        this.streamingDuration=streamingDuration;
        this.streamConverter=streamConverter;
        this.streamConverter.initialize();
        this.frameCollector=null;
        this.frequency=frequency;
        this.renderingFrame=null;
    }
    renderFrame({timestamp=0}){
        if(timestamp==0)// live data
            this.renderingFrame=this.frame;
        else{
            this.renderingFrame=this.getFrameByTimestamp(timestamp);
        }
        return this.renderingFrame;
    }

    renderFrameByPointerPosition(value){
        const first_frame=this.getFirstFrame();
        const offset=value*this.cacheLength;
        if(first_frame){
            const timestamp=first_frame.timestamp+offset;
            return this.renderFrame({timestamp});
        }else{
            return null;
        }
        
    }
    startCollectingFrames(callback){
        let times=0;
        this.frameCollector= setInterval(async()=>{
            const status=this.streamConverter.rosSubscriber.getStatus();
            if(status=="Receiving data")
            {
                const message= await this.streamConverter.convertMessage();
                if(message){
                    const frame= this.push(message);
                    if(frame==false)
                    {
                        times=times+1;
                        if(times>=50)
                            this.stopCollectingFrames();
                        else
                            times=0;
                    }
                    else{
                        this.frame=frame;
                        if(callback)
                            {
                                const loadedCachePosition=this.getCachedPointerPosition();
                                //console.log(loadedCachePosition);
                                callback(loadedCachePosition);
                            }
                    }
                        
                }
            }
        },this.frequency);
    }
    stopCollectingFrames(){
        clearInterval(this.frameCollector);
        this.streamConverter.rosSubscriber.shutdown();
    }
    getFrameByTimestamp(timestamp){
        if(this.buffer.length==0)
            return null;
        else if(this.buffer.length==1)
        {
            return this.getFirstFrame();
        }else{
            return getFrame(this.buffer,timestamp);
        }
    };
    getPointerPositionByTimestamp(timestamp){
        const firstFrame= this.getFirstFrame();
        //console.log(parseFloat(timestamp)-parseFloat(firstFrame.timestamp));
        return firstFrame?(parseFloat(timestamp)-parseFloat(firstFrame.timestamp))/this.cacheLength:0;
    }
    getCachedPointerPosition(){
        const firstFrame=this.getFirstFrame();
        const lastFrame=this.getLastFrame();
        const first_timestamp=firstFrame.timestamp;
        const last_timestamp=lastFrame.timestamp;
        return firstFrame?(parseFloat(last_timestamp)-parseFloat(first_timestamp))/this.cacheLength:0;
    }
    getLastFrame(){
        return this.buffer.length?this.buffer.at(-1):null;
    }
    getFirstFrame(){
        return this.buffer.length?this.buffer[0]:null;
    }
    getInitialFirstFrame(){
        return this.initialFirstFrame;
    }
    push(frame)
    {
        const timestamp=frame.timestamp;
        if(this.initialFirstFrame==null)
        {
            this.initialFirstFrame=frame;
            this.buffer.push(frame);
            //console.log("push the first frame");
            return frame;
        }else if((timestamp-this.initialFirstFrame.timestamp)<=this.streamingDuration)
            {
                const lastFrame=this.getLastFrame();
                const last_timestamp=lastFrame?lastFrame.timestamp:null;
                const firstFrame=this.getFirstFrame();
                const first_timestamp=firstFrame?firstFrame.timestamp:null;
                if (last_timestamp<=timestamp){
                    lastFrame.next_timestamp=frame.timestamp;
                    this.buffer.push(frame);
                    //console.log("push the next frame");
                    //console.log({timestamp,first_timestamp, delta:timestamp-first_timestamp,cacheLength:this.cacheLength});
                    while(true){
                        const firstFrame=this.getFirstFrame();
                        const first_timestamp=firstFrame?firstFrame.timestamp:null;
                        if((timestamp-first_timestamp)>=this.cacheLength)
                            {
                                this.buffer.shift();
                                //console.log("shift");
                            }
                        else{
                            break;
                        }
                    }
                    return frame;
                }
            }
        //console.log({delta:(timestamp-this.initialFirstFrame.timestamp),streamingDuration:this.streamingDuration});
        return false;//end of streaming, then close connection 
    }
}
function getFrame(buffer,tsp)
{   
    if(buffer.length<=0)
        return null;
    let i=0,j=buffer.length-1;
    while(i<=j)
    {
        if(buffer[i].timestamp<tsp){
            i=i+1;
        }else if (buffer[i].timestamp==tsp)
        {
            return buffer[i];
        }
        if(buffer[j].timestamp>tsp){
            j=j-1;
        }else if(buffer[j].timestamp==tsp)
        {
            return buffer[j];
        }
    }
    if(0<=i&&i<buffer.length&&0<=j&&j<buffer.length)
    {
        const nxt_frame=buffer[i];
        const pre_frame=buffer[j];
        return Math.abs(pre_frame.timestamp-tsp)<=Math.abs(nxt_frame.timestamp-tsp)?pre_frame:nxt_frame;
    }else if(0<=i&&i<buffer.length)
        return buffer[i];
    else if (0<=j&&j<buffer.length){
        return buffer[j]
    }else return null;
}

