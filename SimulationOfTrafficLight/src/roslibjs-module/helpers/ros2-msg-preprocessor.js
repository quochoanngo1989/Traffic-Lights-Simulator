import { ROS_TYPE_SENSOR_MSGS_IMAGE,ROS_TYPE_VISION_MSGS_DETECTION2D_ARRAY } from "./const-defined-ros-topic"
/*import { resizeImageMSG
    //,renderDectectionImageMSG 
} from "./common/process-image";*/
export async function preprocessMSG(t,msg)
{
    if(t.type==ROS_TYPE_SENSOR_MSGS_IMAGE)
    {
      //  return await resizeImageMSG(msg,t.config.imgSize.maxWidth,t.config.imgSize.maxHeight);
    }/*else if(t.type==ROS_TYPE_VISION_MSGS_DETECTION2D_ARRAY)
    {
        return await renderDectectionImageMSG(msg,t.config.imgSize.maxWidth,t.config.imgSize.maxHeight);
    }*/
    return msg;
}

