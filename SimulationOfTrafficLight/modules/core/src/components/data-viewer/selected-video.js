// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import styled from '@emotion/styled';
import {withTheme, evaluateStyle} from '@streetscape.gl/monochrome';
import SelectedImageSequence from './selected-image-sequence';
import connectToLog from '../connect';

import {normalizeStreamFilter} from '../../utils/stream-utils';

const WrapperComponent = styled.span(props => ({
  ...props.theme.__reset__,
  position: 'relative',
  ...evaluateStyle(props.userStyle, props)
}));

const BoxColors=[
    {box_type:"Car",color:"#ff0000",ck_drawn:true},
    {box_type:"Van",color:"#ff0000",ck_drawn:true},
    {box_type:"Pedestrian",color:"#ff0000",ck_drawn:true},
    {box_type:"Cyclist",color:"#ff0000",ck_drawn:true},
    {box_type:"Taxi",color:"#ff0000",ck_drawn:true},
    {box_type:"Bus",color:"#ff0000",ck_drawn:true},
    {box_type:"Truck",color:"#ff0000",ck_drawn:true},
    {box_type:"Unknown",color:"#ff0000",ck_drawn:true}
];

class BaseComponent extends PureComponent {
  static propTypes = {
    // User configuration
    style: PropTypes.object,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    // From declarative UI video component
    cameras: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object,
      PropTypes.func
    ]),

    // From connected log
    currentTime: PropTypes.number,
    streamsMetadata: PropTypes.object,
    streams: PropTypes.object
  };

  static defaultProps = {
    style: {},
    width: '100%',
    height: 'auto'
  };

  constructor(props) {
    super(props);

    this.state = {
      ...this._getStreamNames(props),
      boxColors:[...BoxColors]
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.streamsMetadata !== nextProps.streamsMetadata ||
      this.props.cameras !== nextProps.cameras
    ) {
      this.setState(this._getStreamNames(nextProps));
    }
  }

  _getStreamNames({streamsMetadata, cameras}) {
    const streamNames = Object.keys(streamsMetadata)
      .filter(streamName => {
        const type = streamsMetadata[streamName] && streamsMetadata[streamName].primitive_type;
        return type === 'IMAGE' || type === 'image'; // Support pre-1.0 lowercase value
      })
      .filter(normalizeStreamFilter(cameras))
      .sort();
    let {selectedStreamName} = this.state || {};
    if (!streamNames.includes(selectedStreamName)) {
      selectedStreamName = streamNames[0] || null;
    }
    //let {selectedBoxStreamName}=this.state;
    let selectedBoxStreamName="";
    // get bounding boxes stream names 
    return {selectedStreamName,selectedBoxStreamName,streamNames};
  }

  _onSelectVideo = streamName => {
    this.setState({selectedStreamName: streamName});
  };
  _setBoxColor(boxcolor){
    const boxColors=[...this.state.boxColors];
    const index=boxColors.findIndex(bc=>bc.box_type==boxcolor.box_type);
    boxColors[index].color=boxcolor.color;
    boxColors[index].ck_drawn=boxcolor.ck_drawn;
    this.setState({boxColors:boxColors});
  }
  _renderVideoBoxColorSelector(){
    const {selectedStreamName,boxColors} = this.state;
    return <>
    <span>{selectedStreamName}</span>
    <ul>
        {boxColors.map(bc=>{
            const max=99999,min=10000;
            const id=Math.floor(Math.random() * (max - min + 1)) + min
            return <li>
                <input type='checkbox' checked={bc.ck_drawn} id={"ck_drawn_"+bc.box_type+"_"+id} name={bc.box_type+"_"+id} data-value={JSON.stringify(bc)} onChange={e =>{
                const boxcolor= JSON.parse(e.target.getAttribute("data-value"));
                boxcolor.ck_drawn=e.target.checked;
                this._setBoxColor(boxcolor);
            }}></input>
                <input type='color' id={bc.box_type+"_"+id} name={bc.box_type+"_"+id} data-value={JSON.stringify(bc)} value={bc.color} onChange={
                    e => {
                        const boxcolor=JSON.parse(e.target.getAttribute("data-value"));
                        boxcolor.color=e.target.value;
                        this._setBoxColor(boxcolor);
                        }}/>
                <label for={bc.box_type+"_"+id}>{bc.box_type}</label></li>
        })}
    </ul></>
  }

  render() {
    const {currentTime, streams, width, height, style, theme} = this.props;
    const {selectedStreamName,selectedBoxStreamName,boxColors} = this.state;

    if (!streams || !currentTime || !selectedStreamName) {
      return null;
    }
    let images = streams[selectedStreamName];
    if (images) {
      images = images.filter(Boolean);
    }
    let boxes=streams[selectedBoxStreamName]
    return (
      <WrapperComponent theme={theme} userStyle={style.wrapper}>
        <SelectedImageSequence width={width} boxes={boxes} boxColors={boxColors} height={height} src={images} currentTime={currentTime} />
        {
            this._renderVideoBoxColorSelector()
        }
      </WrapperComponent>
    );
  }
}

const getLogState = log => ({
  currentTime: log.getCurrentTime(),
  streamsMetadata: log.getStreamsMetadata(),
  streams: log.getStreams()
});

const SelectedVideoComponent = withTheme(BaseComponent);

export default connectToLog({getLogState, Component: SelectedVideoComponent});
