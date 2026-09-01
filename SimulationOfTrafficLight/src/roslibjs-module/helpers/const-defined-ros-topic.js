export const ROS_TYPE_AW_DETECTED_OBJECT_ARRAY="autoware_msgs/DetectedObjectArray";
export const ROS_TYPE_FLOAT32_MULTIARRAY="std_msgs/msg/Float32MultiArray";
export const ROS_TYPE_FLOAT32="std_msgs/msg/Float32";
export const ROS_TYPE_SENSOR_MSGS_CAMERAINFO="sensor_msgs/msg/CameraInfo";
export const ROS_TYPE_DIAGNOSTIC_ARRAY="diagnostic_msgs/msg/DiagnosticArray";
export const ROS_TYPE_READ_SPLIT_EVENT="[rosbag2_interfaces/msg/ReadSplitEvent";
export const ROS_TYPE_NAV_SAT_FIX="sensor_msgs/msg/NavSatFix";
export const ROS_TYPE_IMU="sensor_msgs/msg/Imu";
export const ROS_TYPE_SENSOR_MSGS_LASERSCAN="sensor_msgs/msg/LaserScan";
export const ROS_TYPE_SENSOR_MSGS_POINTCLOUD2="sensor_msgs/msg/PointCloud2";
export const ROS_TYPE_SENSOR_MSGS_IMAGE="sensor_msgs/msg/Image";
export const ROS_TYPE_VISION_MSGS_DETECTION2D_ARRAY="vision_msgs/msg/Detection2DArray";
export const DETECTION_LIDAR_DETECTOR_OBJECTS={
    "topic": "/detection/lidar_detector/objects",
    "type": ROS_TYPE_AW_DETECTED_OBJECT_ARRAY
}
export const ODOM_ACCELERATIONS={
    "topic": "/Odom/Accelerations",
    "type": ROS_TYPE_FLOAT32_MULTIARRAY
}
export const ODOM_BRAKE={
    "topic": "/Odom/Brake",
    "type": ROS_TYPE_FLOAT32
}
export const ODOM_GEAR_ACTIVE={
    "topic": "/Odom/Gear_adctive",
    "type": ROS_TYPE_FLOAT32
}
export const ODOM_GEAR_RAW={
    "topic": "/Odom/Gear_raw",
    "type": ROS_TYPE_FLOAT32
}
export const ODOM_STEERING_ANGLE={
    "topic": "/Odom/Steering_angle",
    "type": ROS_TYPE_FLOAT32
}
export const ODOM_THROTTLE={
    "topic": "/Odom/Throttle",
    "type": ROS_TYPE_FLOAT32
}
export const ODOM_VELOCITY={
    "topic": "/Odom/velocity",
    "type": ROS_TYPE_FLOAT32
}
export const ODOM_WHEEL_SPEEDS={
    "topic": "/Odom/Wheel_speeds",
    "type": ROS_TYPE_FLOAT32_MULTIARRAY
}
export const CAMERA_CAMERA_INFO={
    "topic": "/camera/camera_info",
    "type": ROS_TYPE_SENSOR_MSGS_CAMERAINFO
}
export const DIAGNOSTICS={
    "topic": "/diagnostics",
    "type": ROS_TYPE_DIAGNOSTIC_ARRAY
}
export const EVENTS_READ_SPLIT={
    "topic": "/events/read_split",
    "type": ROS_TYPE_READ_SPLIT_EVENT
}
export const GPS_FIX={
    "topic": "/gps/fix",
    "type": ROS_TYPE_NAV_SAT_FIX
};
export const GPS_IMU= {
    "topic": "/gps/imu",
    "type": ROS_TYPE_IMU
};
export const IMU_DATA_RAW= {
    "topic": "/imu/data_raw",
    "type": ROS_TYPE_IMU
};
export const INFRASTRUCTURE_CAMERA={
    "topic":"/infrastructure/camera",
    "type":ROS_TYPE_SENSOR_MSGS_IMAGE
}
export const VEHICLE_CAMERA={
    "topic":"/camera/image_color/raw",
    "type":ROS_TYPE_SENSOR_MSGS_IMAGE
}
export const VEHICLE_DETECTION_CAMERA={
    "topic":"/camera/detected_objects",
    "type":ROS_TYPE_VISION_MSGS_DETECTION2D_ARRAY
} 
export const INFRASTRUCTURE_DETECTION_CAMERA={
    "topic":"/infrastructure/detected_objects",
    "type":ROS_TYPE_VISION_MSGS_DETECTION2D_ARRAY
} 
/*
* /novatel/oem7/bestgnsspos [novatel_oem7_msgs/msg/BESTGNSSPOS] 1 publisher
* /novatel/oem7/bestpos [novatel_oem7_msgs/msg/BESTPOS] 1 publisher
* /novatel/oem7/bestutm [novatel_oem7_msgs/msg/BESTUTM] 1 publisher
* /novatel/oem7/bestvel [novatel_oem7_msgs/msg/BESTVEL] 1 publisher
* /novatel/oem7/corrimu [novatel_oem7_msgs/msg/CORRIMU] 1 publisher
* /novatel/oem7/heading2 [novatel_oem7_msgs/msg/HEADING2] 1 publisher
* /novatel/oem7/insconfig [novatel_oem7_msgs/msg/INSCONFIG] 1 publisher
* /novatel/oem7/inspva [novatel_oem7_msgs/msg/INSPVA] 1 publisher
* /novatel/oem7/inspvax [novatel_oem7_msgs/msg/INSPVAX] 1 publisher
* /novatel/oem7/insstdev [novatel_oem7_msgs/msg/INSSTDEV] 1 publisher
* /novatel/oem7/odom [nav_msgs/msg/Odometry] 1 publisher
* /novatel/oem7/oem7raw [novatel_oem7_msgs/msg/Oem7RawMsg] 1 publisher
* /novatel/oem7/ppppos [novatel_oem7_msgs/msg/PPPPOS] 1 publisher
* /novatel/oem7/rxstatus [novatel_oem7_msgs/msg/RXSTATUS] 1 publisher
* /novatel/oem7/terrastarinfo [novatel_oem7_msgs/msg/TERRASTARINFO] 1 publisher
* /novatel/oem7/terrastarstatus [novatel_oem7_msgs/msg/TERRASTARSTATUS] 1 publisher
* /novatel/oem7/time [novatel_oem7_msgs/msg/TIME] 1 publisher
* /parameter_events [rcl_interfaces/msg/ParameterEvent] 2 publishers
* /rosout [rcl_interfaces/msg/Log] 2 publishers
*/
export const SCAN= {
    "topic": "/scan",
    "type": ROS_TYPE_SENSOR_MSGS_LASERSCAN
};
export const VELODYNE_POINTS= {
    "topic": "/velodyne_points",
    //"topic": "/rslidar_points",
    "type": ROS_TYPE_SENSOR_MSGS_POINTCLOUD2
};