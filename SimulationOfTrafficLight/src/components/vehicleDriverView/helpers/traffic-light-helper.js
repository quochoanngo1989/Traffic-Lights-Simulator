/**
# constants for color
uint8 RED = 1
uint8 AMBER = 2
uint8 GREEN = 3
uint8 WHITE = 4

# constants for shape
uint8 CIRCLE = 1
uint8 LEFT_ARROW = 2
uint8 RIGHT_ARROW = 3
uint8 UP_ARROW = 4
uint8 UP_LEFT_ARROW=5
uint8 UP_RIGHT_ARROW=6
uint8 DOWN_ARROW = 7
uint8 DOWN_LEFT_ARROW = 8
uint8 DOWN_RIGHT_ARROW = 9
uint8 CROSS = 10

# constants for status
uint8 SOLID_OFF = 1
uint8 SOLID_ON = 2
uint8 FLASHING = 3

<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 20 L80 80 M80 20 L20 80" 
                    stroke="black" strokeWidth="12" strokeLinecap="round"/>
            </svg>
 */
import React from "react";
export const COLORS={
                ON_RED:"rgb(240, 0, 0)",
                ON_AMBER:"rgb(249, 253, 7)",
                ON_GREEN:"rgb(62, 231, 10)",
                WHITE:"rgb(255, 255, 255)",
                OFF_RED:"rgb(92, 4, 4)",
                OFF_AMBER:"rgb(138, 136, 21)",
                OFF_GREEN:"rgb(49, 95, 74)",
                NATURAL_COLOR:"rgb(11, 12, 11)",
            }
            
export const COLOR_CODE={
                RED : 1,
                AMBER : 2,
                GREEN : 3,
                WHITE : 4
            }
export const SHAPE_CODE={
                CIRCLE : 1,
                LEFT_ARROW : 2,
                RIGHT_ARROW : 3,
                UP_ARROW : 4,
                UP_LEFT_ARROW:5,
                UP_RIGHT_ARROW:6,
                DOWN_ARROW : 7,
                DOWN_LEFT_ARROW : 8,
                DOWN_RIGHT_ARROW : 9,
                CROSS : 10
            }
export const STATUS_CODE={
                SOLID_OFF: 1,
                SOLID_ON: 2,
                FLASHING: 3
            }
export const SIGNAL_STRUCTURE={
                size:232.33508,
                linearGradient3163:{
                    x1:438.05487,
                    y1:506.72171,
                    x2:314.95682,
                    y2:356.07721},
                linearGradient3167:{
                    x1:438.05487,
                    y1:506.72171,
                    x2:314.95682,
                    y2:356.07721},
                linearGradient3206:{
                    x1:348.50266,
                    y1:337.67926,
                    x2:372.09805,
                    y2:443.2402
                }
            }
export const flashingStyle = {
                animation: "flashing 0.5s infinite", // Apply animation using CSS keyframes
              };
export function getArrowAngle(shapeCode){
                
                switch (shapeCode) {
                    case SHAPE_CODE.UP_ARROW:
                        return -90;
                    case SHAPE_CODE.UP_LEFT_ARROW:
                        return -135;
                    case SHAPE_CODE.UP_RIGHT_ARROW:
                        return -45;
                    case SHAPE_CODE.DOWN_ARROW:
                        return 90;
                    case SHAPE_CODE.DOWN_LEFT_ARROW:
                        return 135;
                    case SHAPE_CODE.DOWN_RIGHT_ARROW:
                        return 45;
                    case SHAPE_CODE.LEFT_ARROW:
                        return 180;
                    case SHAPE_CODE.RIGHT_ARROW:
                        return 0;
                    default:
                        return 0;
                }
            }
export function getSignalProperties({colorCode,shapeCode,statusCode}){
  let color=COLORS.WHITE;
  color=statusCode==STATUS_CODE.SOLID_OFF&&colorCode==COLOR_CODE.GREEN?COLORS.OFF_GREEN:color;
  color=statusCode==STATUS_CODE.SOLID_OFF&&colorCode==COLOR_CODE.RED?COLORS.OFF_RED:color;
  color=statusCode==STATUS_CODE.SOLID_OFF&&colorCode==COLOR_CODE.AMBER?COLORS.OFF_AMBER:color;
            
  color=statusCode==STATUS_CODE.SOLID_ON&&colorCode==COLOR_CODE.GREEN?COLORS.ON_GREEN:color;
  color=statusCode==STATUS_CODE.SOLID_ON&&colorCode==COLOR_CODE.RED?COLORS.ON_RED:color;
  color=statusCode==STATUS_CODE.SOLID_ON&&colorCode==COLOR_CODE.AMBER?COLORS.ON_AMBER:color;
            
  const isFlashing=(statusCode==STATUS_CODE.FLASHING);
  color=isFlashing&&colorCode==COLOR_CODE.GREEN?COLORS.ON_GREEN:color;
  color=isFlashing&&colorCode==COLOR_CODE.RED?COLORS.ON_RED:color;
  color=isFlashing&&colorCode==COLOR_CODE.AMBER?COLORS.ON_AMBER:color;
            
  const isCross=(shapeCode==SHAPE_CODE.CROSS);
  const isCircle=(shapeCode==SHAPE_CODE.CIRCLE);
  const isArrowShape=(isCross==false&&isCircle==false);
  const arrowAngle=getArrowAngle(shapeCode);
  return {color,isFlashing,isCross,isCircle,isArrowShape,arrowAngle,arrowCode:isArrowShape?shapeCode:null}

}
export function generateSignalCanvas({size,colorCode,shapeCode,statusCode}){
  const {color,isFlashing,isCross,isCircle,isArrowShape,arrowAngle}=getSignalProperties({colorCode,shapeCode,statusCode})
  const canvas=document.createElement("canvas");
  canvas.width=size;
  canvas.height=size;
  const ctx = canvas.getContext("2d");
  if(isCircle)
  {
    drawCircle({ctx,size,color});
  }else if(isCross)
  {
    drawCross({ctx,size,color});
  }else if(isArrowShape){
    drawArrow({ctx,size,color,angle:arrowAngle});
  }
  return canvas;
}

export function generateSignalBackgroundCanvas({size}){
  const canvas=document.createElement("canvas");
  canvas.width=size;
  canvas.height=size;
  const ctx = canvas.getContext("2d");
  drawSignalBackground({ctx,size});
  return canvas;
}

function drawCircle({ctx,size,color})
{
  ctx.fillStyle =color;
  ctx.fillRect(0, 0, size, size); // (x, y, width, height)
  ctx.save();
}

function drawSignalBackground({ctx,size}){
  drawCircle({ctx,size,color:COLORS.NATURAL_COLOR});
}
/*
function drawCross({ctx,size,color}){
  drawCircle({ctx,size,color});
  ctx.beginPath();
  ctx.moveTo(0+0, 0+0);
  ctx.lineTo(size-0, size-0);
  ctx.moveTo(0+0, size-0);
  ctx.lineTo(size-0, 0+0);
  ctx.closePath(); // Closes the path
  ctx.strokeStyle = COLORS.ON_RED;
  ctx.lineWidth = 15;
  ctx.stroke();
  ctx.save();
}
*/

function drawCross({ctx,size,color}){
  //drawCircle({ctx,size,color});
  const ratio= size/SIGNAL_STRUCTURE.size;
  // Draw the head (circle)
  ctx.beginPath();
  ctx.arc(ratio*116.16754, ratio*50, ratio*22, 0, 2 * Math.PI); // circle at (116.16754, 50) with radius 22
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();

  // Draw the body (rectangle)
  ctx.fillStyle = color;
  ctx.fillRect(ratio*100, ratio*75, ratio*32, ratio*60); // rectangle at (100, 75) with width 32 and height 60

  // Draw the left arm (line)
  ctx.beginPath();
  ctx.moveTo(ratio*100, ratio*83); // starting point
  ctx.lineTo(ratio*80, ratio*110); // ending point
  ctx.strokeStyle = color;
  ctx.lineWidth = ratio*10;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.closePath();

  // Draw the right arm (line)
  ctx.beginPath();
  ctx.moveTo(ratio*132, ratio*83); // starting point
  ctx.lineTo(ratio*152, ratio*110); // ending point
  ctx.strokeStyle = color;
  ctx.lineWidth = ratio*10;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.closePath();

  // Draw the left leg (line)
  ctx.beginPath();
  ctx.moveTo(ratio*(100 + 5), ratio*130); // starting point with offset on x-axis
  ctx.lineTo(ratio*90, ratio*190); // ending point
  ctx.strokeStyle = color;
  ctx.lineWidth = ratio*10;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.closePath();

  // Draw the right leg (line)
  ctx.beginPath();
  ctx.moveTo(ratio*(132 - 5), ratio*130); // starting point with offset on x-axis
  ctx.lineTo(ratio*142, ratio*190); // ending point
  ctx.strokeStyle = color;
  ctx.lineWidth = ratio*10;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.closePath();
}

function drawArrow({ctx,size,color, angle}) {
  drawSignalBackground({ctx,size});
  ctx.save(); // Save the current state
  const x=size/2;
  const y=size/2;
  const length=size*0.8
  // Move to the arrow's center
  ctx.translate(x, y);
  // Rotate the canvas
  ctx.rotate(angle * Math.PI / 180);
  // Draw the arrow
  ctx.beginPath();
  ctx.moveTo(-length / 2, 0+2);  // Start at left of center
  ctx.lineTo(length / 2, 0+2);   // Line to right
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.stroke();
  
  ctx.lineTo(length / 8, size*0.4);  // Arrowhead down
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.stroke();
  
  ctx.moveTo(-length / 2, 0-2);  // Start at left of center
  ctx.lineTo(length / 2, 0-2);   // Line to right
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.stroke();
  
  ctx.lineTo(length / 8, -size*0.4);// Arrowhead up
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.restore(); // Restore original state
}

// Draw arrow at (200, 200) with length 100, rotated 45°
//drawArrowRo(50, 50, 80, 180);

export function generateSignal({id="svg-signal",size,colorCode,shapeCode,statusCode}){
                const {color,isFlashing,isCross,isCircle,isArrowShape,arrowAngle}=getSignalProperties({colorCode,shapeCode,statusCode});
                return <svg key={id}
                width={size} height={size} 
                viewBox={`0 0 ${SIGNAL_STRUCTURE.size} ${SIGNAL_STRUCTURE.size}`} id={id} style={{ display: "inline-block" }}>
                  <defs id="defs4">
                    <linearGradient id="linearGradient3199">
                      <stop
                        id="stop3201"
                        offset={0}
                        style={{
                          stopColor: "#ffffff",
                          stopOpacity: 1,
                        }}
                      />
                      <stop
                        id="stop3203"
                        offset={1}
                        style={{
                          stopColor: "#ffffff",
                          stopOpacity: 0,
                        }}
                      />
                    </linearGradient>
                    <linearGradient id="linearGradient3157">
                      <stop
                        style={{
                          stopColor: "#101010",
                          //stopColor: color, border color
                          stopOpacity: 1,
                        }}
                        offset={0}
                        id="stop3159"
                      />
                      <stop
                        style={{
                          stopColor: "#404040",
                          stopOpacity: 1,
                        }}
                        offset={1}
                        id="stop3161"
                      />
                    </linearGradient>
                    <linearGradient
                      id="linearGradient3163"
                      {...SIGNAL_STRUCTURE.linearGradient3163}
                      gradientUnits="userSpaceOnUse"
                      href="#linearGradient3157"
                    />
                    <linearGradient
                      id="linearGradient3167"
                      gradientUnits="userSpaceOnUse"
                      {...SIGNAL_STRUCTURE.linearGradient3167}
                      href="#linearGradient3157"
                    />
                    <linearGradient
                      id="linearGradient3206"
                      gradientUnits="userSpaceOnUse"
                      {...SIGNAL_STRUCTURE.linearGradient3206}
                      href="#linearGradient3199"
                    />
                  </defs>
                  <g id="layer1" transform="translate(-261.62952,-313.94068)">
                    <path
                      style={{
                        opacity: 1,
                        fill: "url(#linearGradient3163)",
                        fillOpacity: 1,
                        stroke: "none",
                        strokeWidth: 0.2,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 4,
                        strokeDasharray: "none",
                        strokeDashoffset: 0,
                        strokeOpacity: 1,
                      }}
                      id="path3155"
                      d="M 476.79201,430.10822 A 98.994949,98.994949 0 1 1 278.80211,430.10822 A 98.994949,98.994949 0 1 1 476.79201,430.10822 z"
                      transform="matrix(1.1734694,0,0,1.1734694,-65.536224,-74.610609)"
                    />
                    <path
                      style={{
                        opacity: 1,
                        fill: "url(#linearGradient3167)",
                        fillOpacity: 1,
                        stroke: "none",
                        strokeWidth: 0.2,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 4,
                        strokeDasharray: "none",
                        strokeDashoffset: 0,
                        strokeOpacity: 1,
                      }}
                      id="path3165"
                      d="M 476.79201,430.10822 A 98.994949,98.994949 0 1 1 278.80211,430.10822 A 98.994949,98.994949 0 1 1 476.79201,430.10822 z"
                      transform="matrix(1.0306123,0,0,1.0306123,-11.565216,-13.166579)"
                    />
                    <path
                      style={isFlashing&&isCircle?
                        {
                            opacity: 1,
                            fillOpacity: 1,
                            stroke: "none",
                            strokeWidth: 0.2,
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeMiterlimit: 4,
                            strokeDasharray: "none",
                            strokeDashoffset: 0,
                            strokeOpacity: 1,
                            fill:isCircle?color:COLORS.NATURAL_COLOR, //background color
                            ...flashingStyle
                          }:{
                        opacity: 1,
                        fillOpacity: 1,
                        stroke: "none",
                        strokeWidth: 0.2,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 4,
                        strokeDasharray: "none",
                        strokeDashoffset: 0,
                        strokeOpacity: 1,
                        //fill:isCircle||isCross?color:COLORS.NATURAL_COLOR, //SETTING FOR CROSS X
                        fill:isCircle?color:COLORS.NATURAL_COLOR, //background color
                      }}
                      id="path2383"
                      d="M 476.79201,430.10822 A 98.994949,98.994949 0 1 1 278.80211,430.10822 A 98.994949,98.994949 0 1 1 476.79201,430.10822 z"
                    />
                    <path
                      style={{
                        fill: "url(#linearGradient3206)",
                        fillOpacity: 1,
                        stroke: "none",
                        strokeWidth: 0.2,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeMiterlimit: 4,
                        strokeDashoffset: 0,
                        strokeOpacity: 1,
                      }}
                      d="M 455.07373,398.79349 C 449.25572,429.61309 413.22739,440.72053 376.78691,445.76557 C 340.28119,450.81965 297.92938,446.63812 289.71509,411.1858 C 281.51863,375.81039 323.15185,331.11327 377.79706,331.11327 C 432.44227,331.11327 460.87363,368.06982 455.07373,398.79349 z"
                      id="path3189"
                    />
                  </g>
                  {
                    isArrowShape&&<g id="arrow" style={isFlashing?{filter:"drop-shadow(4px 4px 3px gray)",...flashingStyle}:{filter:"drop-shadow(4px 4px 3px gray)"}} width={SIGNAL_STRUCTURE.size} height={SIGNAL_STRUCTURE.size}  transform={`translate(25,60)  rotate(${arrowAngle} 90 50)`} >
                    <path d="M10 50 H145" stroke={color} stroke-width="15" fill="none" />
                    <path d="M100 -20 L170 50 L100 120" stroke={color} stroke-width="15" fill="none"/>
                    </g>
                  }
                  {
                    //SETTING FOR CROSS X
                    /*isCross&&<g id="cross" style={isFlashing?{filter:"drop-shadow(4px 4px 3px gray)",...flashingStyle}:{filter:"drop-shadow(4px 4px 3px gray)"}} width={SIGNAL_STRUCTURE.size} height={SIGNAL_STRUCTURE.size}  transform="translate(0,0)" >
                    <path d="M50 50 L180 180 M50 180 L180 50" stroke={COLORS.ON_RED} stroke-width="18" fill="none" />
                    </g>*/
                  }
                  {
                    //SETTING FOR CROSSWALK
                    isCross&&<g id="cross" style={isFlashing?{filter:"drop-shadow(4px 4px 3px gray)",...flashingStyle}:{filter:"drop-shadow(4px 4px 3px gray)"}} width={SIGNAL_STRUCTURE.size} height={SIGNAL_STRUCTURE.size}  transform="translate(0,0)"  >
                    <circle cx={116.16754} cy={50} r={22} fill={color} />
                    <rect x={100} y={75} width={32} height={60} fill={color} />
                    <line
                      x1={100}
                      y1={83}
                      x2={80}
                      y2={110}
                      stroke={color}
                      strokeWidth={10}
                      strokeLinecap="round"
                    />
                    <line
                      x1={132}
                      y1={83}
                      x2={152}
                      y2={110}
                      stroke={color}
                      strokeWidth={10}
                      strokeLinecap="round"
                    />
                    <line
                      x1={100+5}
                      y1={130}
                      x2={90}
                      y2={190}
                      stroke={color}
                      strokeWidth={10}
                      strokeLinecap="round"
                    />
                    <line
                      x1={132-5}
                      y1={130}
                      x2={142}
                      y2={190}
                      stroke={color}
                      strokeWidth={10}
                      strokeLinecap="round"
                    />
                    </g>
                  }
                </svg>
            }