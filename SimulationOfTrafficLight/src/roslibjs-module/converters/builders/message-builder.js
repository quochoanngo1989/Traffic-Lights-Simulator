
export class MessageBuilder{
    constructor(){
        this.message={timestamp:null,streams:{}};
    }
    clear(){
        this.message={timestamp:null,streams:{}};
    }
    stream(stream){
        this.message.streams[stream.streamName]=stream;
        return this;
    }
    timestamp(timestamp)
    {
        this.message.timestamp=timestamp;
        return this;
    }
    getMessage(){
        const message= {...this.message}
        this.clear();
        return message;
    }
}

