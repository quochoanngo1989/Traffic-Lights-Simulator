// Copyright (c) 2019 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { annotate2DBoxImage } from "../helpers/common/process-image";
import { Stream,Category } from "./builders/stream";
export default class SensorImage{
  constructor(topicConfig) {
    this.streamName=topicConfig.config.xvizStream;
    this.topicConfig=topicConfig;
    this.namespace=topicConfig.namespace?topicConfig.namespace:"";
    this.vname=topicConfig.vname?topicConfig.vname:"";
    this.xviz2DStreamName=this.vname+topicConfig.config.xviz2DStream;/*dont forget name space  */
    this.rosBoxesTopicName=this.namespace+topicConfig.config.xviz2DSource.topic/*dont forget name space */;
    this.style=topicConfig.config.style;
  }
  async convertMessage(synchronizedData,builder) {
    const image_msg=synchronizedData.get(this.topicConfig.topic); 
    if(image_msg==undefined)
      return
    const showMode=this.topicConfig.config.showMode;
    const detect_msg=synchronizedData.get(this.rosBoxesTopicName);
    const message={showMode,image:image_msg}
    if(showMode==1){
      this.setCameraStreamValue(builder,message);
    }
    else if(showMode==2&&detect_msg)//2D boxes
    {
      //const img_Msg= await annotate2DBoxImage(image_msg,detect_msg,this.style);
      message.detect_object=detect_msg;
      message.style=this.style;
      this.setCameraStreamValue(builder,message);
    }//else if(showMode==3){annotate3DBoxImage}//3D boxes    
    //builder.variable(this.xviz2DStreamName).values([detect_msg]);
  }
  setCameraStreamValue(builder,message){
    const stream= new Stream(this.streamName);
    stream.category(Category.IMAGE).message(message);
    builder.stream(stream);
  }    
}
