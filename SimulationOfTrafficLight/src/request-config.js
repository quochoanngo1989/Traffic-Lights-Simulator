
export const Request_Config={ 
    bufferLength: 45, // cached time duration in seconds
    serverConfig: {
        defaultLogLength: 45, //streaming time duration in seconds
        //serverUrl:'ws://127.0.0.1:8081' //ip and port of the xviz-server
        serverUrl:'ws://192.168.178.27:8081'
        //serverUrl:'ws://192.168.50.118:8081'
    },
    worker: true,// use worker  to synchronize recieved data 
    maxConcurrency:4, // number of used workers 
    debug:false, //show stats and collect measure metric tools
    showMap:true//show map
}
