import { GPS_FIX,GPS_IMU,DETECTION_LIDAR_DETECTOR_OBJECTS,ODOM_VELOCITY,VELODYNE_POINTS,INFRASTRUCTURE_CAMERA,VEHICLE_CAMERA,VEHICLE_DETECTION_CAMERA,INFRASTRUCTURE_DETECTION_CAMERA } from "./const-defined-ros-topic";

const ROS_XVIZ_TOPIC_CONFIG={
    EGO_VEHICLE:{
        gps:"/V_1"+GPS_FIX.topic,
        imu:"/V_1"+GPS_IMU.topic,
        name: "EGO_VEHICLE",
        poseTopicConfig:{
            ...GPS_FIX,
            "topic":"/V_1"+GPS_FIX.topic,
            "config": {
            "xvizStream": "/vehicle_pose"
            }
        },topicConfig:
        [
            {
                ...GPS_IMU,
                "topic":"/V_1"+GPS_IMU.topic,
                "config": {
                      "xvizStream": "/vehicle/acceleration"//???? ODOM
                  },
                
            },
            {
                ...ODOM_VELOCITY,
                "topic":"/V_1"+ODOM_VELOCITY.topic,
                "config": {
                      "xvizStream": "/vehicle/velocity",
                      "unit":"m/s"
                  }
            },
            {
                ...VELODYNE_POINTS,
                "topic":"/V_1"+VELODYNE_POINTS.topic,
                "config":{"xvizStream":"/points/raw",
                          "baseColor":{"r":10,"g":10,"b":10},"fill_color": "#707070"}//"convert":"LidarConverter"
            },
            /*{// install autowave message
                ...DETECTION_LIDAR_DETECTOR_OBJECTS,
                "config":{
                  "xvizStream": "/detection/objects",
                  "xvizStreamOfTrackingPoints":"/detection/lidar_detector/tracking_points",
                  "xvizStreamOfLabel":"/detection/lidar_detector/labels"}
            },*/
            {
                ...VEHICLE_CAMERA,
                "topic":"/V_1"+VEHICLE_CAMERA.topic,
                "config":{
                      "xvizStream": "/vehicle-side/camera",
                      "xviz2DStream":"/vehicle-side/camera-2Dboxes",
                      "xviz2DSource":{...VEHICLE_DETECTION_CAMERA,"topic":"/V_1"+VEHICLE_DETECTION_CAMERA.topic},
                      "imgSize":{"maxWidth":300,"maxHeight":300},
                      "style":{
                            "title":"Ego Camera",
                            "font":"11px serif",
                            "color":"red"},
                      "showMode":2 /*values:1= images without box ,2:images with 2D-boxes, 3:images with 3D-boxes  */
                    }
            },
            {
                ...VEHICLE_DETECTION_CAMERA,
                "topic":"/V_1"+VEHICLE_DETECTION_CAMERA.topic
            }/*,
            {
                ...INFRASTRUCTURE_CAMERA,
                "config":{
                      "xvizStream": "/infrastructure-side/camera",
                      "xviz2DStream":"/infrastructure-side/camera-2Dboxes",
                      "xviz2DSource":{...INFRASTRUCTURE_DETECTION_CAMERA},
                      "imgSize":{"maxWidth":300,"maxHeight":300},
                      "showMode":1 //values:1= images without box ,2:images with 2D-boxes, 3:images with 3D-boxes
                    }
            },
            {
                ...INFRASTRUCTURE_DETECTION_CAMERA
            }*/
            ]

    },
    VEHICLES:[
        /*{
            
            name:"V_1",
            topicConfig:[
            {
                ...GPS_FIX,
                "config": {
                        "xvizStream": "/vehicle_pose" // !IMPORTANT, NOT ALLOW TO MISS THIS STREAM
                }
            },  
            {
                ...GPS_IMU,
                "config": {
                      "xvizStream": "/vehicle/acceleration"
                  }
            },
            {
                ...ODOM_VELOCITY,
                "config": {
                      "xvizStream": "/vehicle/velocity",
                      "unit":"m/s"
                  }
            },
            {
                ...VELODYNE_POINTS,
                "config":{"xvizStream":"/points/raw",
                          "baseColor":{"r":10,"g":10,"b":10},"fill_color": "#707070"}
            },
            {
                ...VEHICLE_CAMERA,
                "config":{
                      "xvizStream": "/vehicle-side/camera",
                      "xviz2DStream":"/vehicle-side/camera-2Dboxes",
                      "xviz2DSource":{...VEHICLE_DETECTION_CAMERA},
                      "imgSize":{"maxWidth":300,"maxHeight":300},
                      "style":{
                            "title":"V_1 Camera",
                            "font":"11px serif",
                            "color":"red"},
                      "showMode":2 //values:1= images without box ,2:images with 2D-boxes, 3:images with 3D-boxes  
                    }
            },
            {
                ...VEHICLE_DETECTION_CAMERA
            }]
        },*/
        {
            name:"V_2",
            topicConfig:[
                {
                    ...GPS_FIX,
                    "config": {
                            "xvizStream": "/vehicle_pose" // !IMPORTANT, NOT ALLOW TO MISS THIS STREAM
                    }
                },
                {
                    ...GPS_IMU,
                    "config": {
                          "xvizStream": "/vehicle/acceleration"
                      }
                },
                /*{
                    ...DETECTION_LIDAR_DETECTOR_OBJECTS,
                    "config":{
                      "xvizStream": "/detection/objects",
                      "xvizStreamOfTrackingPoints":"/detection/lidar_detector/tracking_points",
                      "xvizStreamOfLabel":"/detection/lidar_detector/labels"}
                },*/
                {
                    ...ODOM_VELOCITY,
                    "config": {
                          "xvizStream": "/vehicle/velocity",
                          "unit":"m/s"
                      }
                },
                {
                    ...VELODYNE_POINTS,
                    "config":{"xvizStream":"/points/raw",
                              "baseColor":{"r":10,"g":10,"b":10},"fill_color": "#707070"}
                },
                {
                    ...VEHICLE_CAMERA,
                    "config":{
                          "xvizStream": "/vehicle-side/camera",
                          "xviz2DStream":"/vehicle-side/camera-2Dboxes",
                          "xviz2DSource":{...VEHICLE_DETECTION_CAMERA},
                          "imgSize":{"maxWidth":300,"maxHeight":300},
                          "style":{
                                "title":"V_2 Camera",
                                "font":"11px serif",
                                "color":"red"},
                          "showMode":2 /*values:1= images without box ,2:images with 2D-boxes, 3:images with 3D-boxes  */
                        }
                },
                {
                    ...VEHICLE_DETECTION_CAMERA
                }]
        }
    ]
};
export default ROS_XVIZ_TOPIC_CONFIG;