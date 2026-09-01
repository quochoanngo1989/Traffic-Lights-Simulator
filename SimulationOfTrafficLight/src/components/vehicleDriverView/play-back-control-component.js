import { tree } from "d3";
import React from "react";
import { Slider, Direction,PlayerIcon,FormattedTime } from 'react-player-controls'
import { PiGraphThin } from "react-icons/pi";
import { FaCar } from "react-icons/fa";
import { FaPause,FaPlay } from "react-icons/fa6";
import { StreamBuffer } from './streams-buffer';
import { StreamConverter } from "../../roslibjs-module/converters/stream-converter";
const sliderStylesHere={width:"100%",height:"100%"};
const WHITE_SMOKE = '#eee';
const GRAY = '#878c88';
const GREEN = '#72d687';
const BLACK = '#000000';
const SliderBar = ({ direction, value, style }) =>  <div
style={{
  position: 'absolute',
  background: GRAY,
  borderRadius: 4,
  ...(direction === Direction.HORIZONTAL ? {
    top: 'calc(50% - 4px)',
    left: 0,
    width: `${value * 100}%`,
    height: 8,
  } : {
    right: 0,
    bottom: 0,
    left: 'calc(50% - 4px)',
    width: 8,
    height: `${value * 100}%`,
  }),
  ...style,
}}
/>
const SliderHandle = ({ direction, value, style }) => <div
style={Object.assign({}, {
  position: 'absolute',
  width: 16,
  height: 16,
  background: GREEN,
  borderRadius: '100%',
  transform: 'scale(1)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.3)',
  }
}, direction === Direction.HORIZONTAL ? {
  top: 'calc(50% - 4px)',
  left: `${value * 100}%`,
  marginTop: -4,
  marginLeft: -8,
} : {
  left: 'calc(50% - 4px)',
  bottom: `${value * 100}%`,
  marginBottom: -8,
  marginLeft: -4,
}, style)}
/>

export class PlayBackControl extends React.PureComponent{
    constructor(props){
        super(props);
        const {cacheLength,streamingDuration,frequency}=this.props;
        this.streamsBuffer=new StreamBuffer({streamConverter:new StreamConverter(),cacheLength:cacheLength,streamingDuration:streamingDuration,frequency:frequency});
        this.visualizeRenderingFrame=this.props.visualizeRenderingFrame;
        this.changeGlobalState=this.props.changeState;
        this.state={isEnabled:true,direction:Direction.HORIZONTAL,
            value:0,
            lastValueStart:0,
            lastValueEnd:0,
            cachedValue:0,
            lastIntent:0,
            lastIntentStart:0,
            lastIntentEndCount:0,
            playing:true,
            isShow:this.props.mapView?"graph":"car"
        };
        this.playControl=null;
        this.renderingFrame=null;
    }
    play= async()=>{
        this.setState({playing:true});
        this.playControl=setInterval(async()=>{
            if(this.renderingFrame)
                {
                    const timestamp=this.renderingFrame.timestamp;
                    const value=this.streamsBuffer.getPointerPositionByTimestamp(timestamp);
                    this.setState({value:value<=0.99?value:1.0});
                    await this.visualizeRenderingFrame(this.renderingFrame);
                    const ntx_timestamp=this.renderingFrame.next_timestamp;
                    this.renderingFrame=this.streamsBuffer.renderFrame({timestamp:ntx_timestamp});
                }
            else{
                this.renderingFrame=this.streamsBuffer.renderFrame({timestamp:0});
            }    
        },100);
        /*
        const firstFrameLoop=()=>{
            //nextFrameLoop.bind(this);
            setTimeout(async()=>{
                this.renderingFrame=this.streamsBuffer.renderFrame({timestamp:0});
                if(this.renderingFrame==null)
                    firstFrameLoop();
                else{
                    
                    const timestamp=this.renderingFrame.timestamp;
                    const value=this.streamsBuffer.getPointerPositionByTimestamp(timestamp);
                    this.setState({value:value});
                    await this.visualizeRenderingFrame(this.renderingFrame);
                    nextFrameLoop(this.renderingFrame);
                    //nextFrameLoop(ntx_timestamp,timestamp);
                }
            },10)
        }
        //firstFrameLoop.bind(this);
        firstFrameLoop();
        const nextFrameLoop=(frame)=>{
            console.log(frame);
            const timestamp=frame.timestamp;
            const ntx_timestamp=frame.next_timestamp;
            const delay=ntx_timestamp?ntx_timestamp-timestamp:0;
            setTimeout(()=>{
                this.renderingFrame=this.streamsBuffer.renderFrame({timestamp:(ntx_timestamp?ntx_timestamp:0)});
                const value=this.streamsBuffer.getPointerPositionByTimestamp(this.renderingFrame.timestamp);
                this.setState({value:value});
                this.visualizeRenderingFrame(this.renderingFrame);
                if(this.renderingFrame.timestamp>timestamp)
                    nextFrameLoop(this.renderingFrame);
            },delay);
        }
        */
    }
    pause=()=>{
        clearInterval(this.playControl);
        this.setState({playing:false});
        
    }
    componentDidMount(){
        this.streamsBuffer.startCollectingFrames((loadedCachePosition)=>{this.setState({cachedValue:loadedCachePosition})});
        if(this.state.playing)
            {
                this.play();
            }
    }
    componentWillUnmount(){
        this.streamsBuffer.stopCollectingFrames();
        if(this.playControl)
            clearInterval(this.playControl);
    }
    componentDidUpdate(){
      
    }
    changeState=(newState)=>{
        const state=this.state;
        this.setState({...state,...newState});
    }
    render(){
        return<div style={{width:"100%",height:"3%", display: "flex",flexDirection:"row" }}>
            {this.state.isShow=="car"?<PiGraphThin style={{ marginRight: 5, marginLeft:5, width:25,height:25 }} onClick={()=>{
                this.changeState({isShow:"graph"});
                this.changeGlobalState({mapView:true});
                }}  onMouseOver={({target})=>{target.style.color="cyan";target.style.cursor="pointer"}} onMouseOut={({target})=>target.style.color="black"} />:
                <FaCar  style={{ marginRight: 5, marginLeft:5,width:25,height:25 }}  onClick={()=>{this.changeState({isShow:"car"});
                this.changeGlobalState({mapView:false});
                }} onMouseOver={({target})=>{target.style.color="cyan";target.style.cursor="pointer"}} onMouseOut={({target})=>target.style.color="black"} /> }
            {this.state.playing?<FaPause style={{ width:25,height:25, marginRight: 32 }} onClick={()=>{this.pause()}} onMouseOut={({target})=>target.style.color="black"}  onMouseOver={({target})=>{target.style.color="cyan";target.style.cursor="pointer"}} />:<FaPlay style={{ width:25,height:25, marginRight: 32 }} onClick={()=>{this.play()}} onMouseOut={({target})=>target.style.color="black"} onMouseOver={({target})=>{target.style.color="cyan";target.style.cursor="pointer"}} />}
            <Slider
                isEnabled={this.state.isEnabled}
                direction={this.state.direction}
                onChange={
                    async newValue => {
                        this.setState(() => ({ value: newValue }));
                        const renderingFrame=this.streamsBuffer.renderFrameByPointerPosition(newValue);
                        this.renderingFrame=renderingFrame;
                        await this.visualizeRenderingFrame(renderingFrame);
                    }
                }
                onChangeStart={startValue => this.setState(() => ({ lastValueStart: startValue }))}
                onChangeEnd={endValue => this.setState(() => ({ lastValueEnd: endValue }))}
                onIntent={intent => this.setState(() => ({ lastIntent: intent }))}
                onIntentStart={intent => this.setState(() => ({ lastIntentStart: intent }))}
                onIntentEnd={() => this.setState(() => ({ lastIntentEndCount: this.state.lastIntentEndCount + 1 }))}
                style={{
                    width: this.state.direction === Direction.HORIZONTAL ? "90%" : 24,
                    height: this.state.direction === Direction.HORIZONTAL ? 24 : 130,
                    // borderRadius: 4,
                    // background: WHITE_SMOKE,
                    transition: this.state.direction === Direction.HORIZONTAL ? 'width 0.1s' : 'height 0.1s',
                    cursor: this.state.isEnabled === true ? 'pointer' : 'default',
                  }}
                >

          <SliderBar direction={this.state.direction} value={1} style={{ background: WHITE_SMOKE }} />
          <SliderBar direction={this.state.direction} value={this.state.cachedValue} style={{ background: BLACK }} />
          <SliderBar direction={this.state.direction} value={this.state.value} style={{ background: this.state.isEnabled ? GREEN : GRAY }} />
          <SliderBar direction={this.state.direction} value={this.state.lastIntent} style={{ background: 'rgba(0, 0, 0, 0.05)' }} />
          <SliderHandle direction={this.state.direction} value={this.state.value} style={{ background: this.state.isEnabled ? GREEN : GRAY }} />
          </Slider>
          <div style={{marginLeft:"15px"}}>
          <FormattedTime numSeconds={this.state.value*this.props.cacheLength} />/<FormattedTime numSeconds={this.props.cacheLength} />
          </div>
        </div>
    }
}