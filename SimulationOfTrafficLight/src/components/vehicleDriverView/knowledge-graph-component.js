import { group } from "d3";
import React from "react";
//import ForceGraph2D from 'react-force-graph-2d';
import  ForceGraph3D  from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
//import ForceGraphVR from 'react-force-graph-vr';
//import ForceGraphAR from 'react-force-graph-ar';
function megerMockData(namespace1,namespace2){
    const graph1=generateMockData(namespace1);
    const graph2=generateMockData(namespace2);
    const links=[{"source": (namespace1?`{${namespace1}}`:"")+"Ego-Vehicle", "target": (namespace2?`{${namespace2}}`:"")+"Ego-Vehicle","label":"timestamp-chained-to", "value": 5}];
    return {
        nodes:[...graph1.data.nodes,...graph2.data.nodes],
        links:[...graph1.data.links,...graph2.data.links,...links]
    };
}
function generateMockData(namespace=null){
    const templateMockData= {
        "nodes": [
          {"id": "Timestamp","label":"12323324.2323","group":999},
          {"id": "Ego-Vehicle", "label":"Ego-Vehicle", "group": 0},
          {"id": "Font-Camera", "label":"Font-Camera", "group": 2},
          {"id": "LiDar-Sensor", "label":"LiDar-Sensor" , "group": 2},
          {"id": "IMU-Sensor", "label":"IMU-Sensor", "group": 2},
          {"id": "POSE", "label":"POSE", "group": 3},
          {"id": "Font-Camera-Stream", "label":"Font-Camera-Stream", "group": 4},
          {"id": "LiDar-Sensor-Stream", "label":"LiDar-Sensor-Stream", "group": 4},
          {"id": "Detected-Objects-By-LiDar", "label":"Detected-Objects-By-LiDar", "group": 5},
          {"id": "Detected-Objects-By-Camera","label": "Detected-Objects-By-Camera", "group": 6},
        //V1
          {"id": "V1_Ego-Vehicle", "label":"V1-Vehicle", "group": 1},
          {"id": "V1_Font-Camera", "label":"Font-Camera(V1)", "group": 2},
          {"id": "V1_LiDar-Sensor", "label":"LiDar-Sensor(V1)" , "group": 2},
          {"id": "V1_IMU-Sensor", "label":"IMU-Sensor(V1)", "group": 2},
          {"id": "V1_POSE", "label":"POSE(V1)", "group": 3},
          {"id": "V1_Font-Camera-Stream", "label":"Font-Camera-Stream(V1)", "group": 4},
          {"id": "V1_LiDar-Sensor-Stream", "label":"LiDar-Sensor-Stream(V1)", "group": 4},
          {"id": "V1_Detected-Objects-By-LiDar", "label":"Detected-Objects-By-LiDar(V1)", "group": 5},
          {"id": "V1_Detected-Objects-By-Camera","label": "Detected-Objects-By-Camera(V1)", "group": 6},
        //V2
          {"id": "V2_Ego-Vehicle", "label":"V2-Vehicle", "group": 1},
          {"id": "V2_Font-Camera", "label":"Font-Camera(V2)", "group": 2},
          {"id": "V2_LiDar-Sensor", "label":"LiDar-Sensor(V2)" , "group": 2},
          {"id": "V2_IMU-Sensor", "label":"IMU-Sensor(V2)", "group": 2},
          {"id": "V2_POSE", "label":"POSE(V2)", "group": 3},
          {"id": "V2_Font-Camera-Stream", "label":"Font-Camera-Stream(V2)", "group": 4},
          {"id": "V2_LiDar-Sensor-Stream", "label":"LiDar-Sensor-Stream(V2)", "group": 4},
          {"id": "V2_Detected-Objects-By-LiDar", "label":"Detected-Objects-By-LiDar(V2)", "group": 5},
          {"id": "V2_Detected-Objects-By-Camera","label": "Detected-Objects-By-Camera(V2)", "group": 6},
        ],
        "links": [
          {"source": "Ego-Vehicle", "target": "Timestamp","label":"timestamp", "value": 0},  
          {"source": "Ego-Vehicle", "target": "Font-Camera","label":"has", "value": 0},
          {"source": "Ego-Vehicle", "target": "LiDar-Sensor","label":"has", "value": 0},
          {"source": "Ego-Vehicle", "target": "IMU-Sensor","label":"has", "value": 0},
          {"source": "Ego-Vehicle", "target": "POSE","label":"at", "value": 0},
          {"source": "Font-Camera", "target": "Font-Camera-Stream","label":"generates", "value": 0},
          {"source": "Font-Camera-Stream", "target": "Detected-Objects-By-Camera","label":"detected", "value": 0},
          {"source": "LiDar-Sensor", "target": "LiDar-Sensor-Stream","label":"generates", "value": 0},
          {"source": "LiDar-Sensor-Stream", "target": "Detected-Objects-By-LiDar","label":"detected", "value": 0},
          //V1  
          {"source": "V1_Ego-Vehicle", "target": "V1_Font-Camera","label":"has", "value": 0},
          {"source": "V1_Ego-Vehicle", "target": "V1_LiDar-Sensor","label":"has", "value": 0},
          {"source": "V1_Ego-Vehicle", "target": "V1_IMU-Sensor","label":"has", "value": 0},
          {"source": "V1_Ego-Vehicle", "target": "V1_POSE","label":"at", "value": 0},
          {"source": "V1_Font-Camera", "target": "V1_Font-Camera-Stream","label":"generates", "value": 0},
          {"source": "V1_Font-Camera-Stream", "target": "V1_Detected-Objects-By-Camera","label":"detected", "value": 0},
          {"source": "V1_LiDar-Sensor", "target": "V1_LiDar-Sensor-Stream","label":"generates", "value": 0},
          {"source": "V1_LiDar-Sensor-Stream", "target": "V1_Detected-Objects-By-LiDar","label":"detected", "value": 0},

          //V2  
          {"source": "V2_Ego-Vehicle", "target": "V2_Font-Camera","label":"has", "value": 0},
          {"source": "V2_Ego-Vehicle", "target": "V2_LiDar-Sensor","label":"has", "value": 0},
          {"source": "V2_Ego-Vehicle", "target": "V2_IMU-Sensor","label":"has", "value": 0},
          {"source": "V2_Ego-Vehicle", "target": "V2_POSE","label":"at", "value": 0},
          {"source": "V2_Font-Camera", "target": "V2_Font-Camera-Stream","label":"generates", "value": 0},
          {"source": "V2_Font-Camera-Stream", "target": "V2_Detected-Objects-By-Camera","label":"detected", "value": 0},
          {"source": "V2_LiDar-Sensor", "target": "V2_LiDar-Sensor-Stream","label":"generates", "value": 0},
          {"source": "V2_LiDar-Sensor-Stream", "target": "V2_Detected-Objects-By-LiDar","label":"detected", "value": 0},
           // Ego connect V1 and V2
           {"source": "Ego-Vehicle", "target": "V1_Ego-Vehicle","label":"connects", "value": 3},
           {"source": "Ego-Vehicle", "target": "V2_Ego-Vehicle","label":"connects", "value": 3}
        ]
      };
      const data= {
        nodes:templateMockData.nodes.map(node=>{
            return {"id": (namespace?`{${namespace}}`:"")+node.id,"label":node.label+(namespace?`{${namespace}}`:""),"group":node.group};
        }),
        links:templateMockData.links.map(link=>{
            return {"source": (namespace?`{${namespace}}`:"")+link.source, "target": (namespace?`{${namespace}}`:"")+link.target,"label":link.label, "value": link.value};
        })
    }
    return {namespace,data};
}
export class KnowledgeGraph extends React.PureComponent{
    constructor(props){
        super(props);
        //this.canvasRef=React.createRef();
        this.fgRef = React.createRef();
        this.state={data:generateMockData("now").data};
    }
    componentDidUpdate({frame}){

    }
    render(){
        return <>
        {
        <button onClick={()=>{
            const data=megerMockData("pre","now");
            this.setState({data:data});
        }} style={{position:"absolute", top:"10px",left:"10px", zIndex:100000 }}>{"Accumulate Frames"}</button>
        }
        
        <ForceGraph3D
        width={this.props.width}
        height={this.props.height*90/100}
        ref={this.fgRef}
        graphData={this.state.data}
        nodeLabel="label"
        nodeAutoColorBy="group"
        nodeThreeObject={node => {
            const sprite = new SpriteText(node.label);
            sprite.color = node.color;
            sprite.textHeight = 8;
            return sprite;
          }}
        linkDirectionalArrowLength={5.5}
        linkWidth={1.1}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.25}
        
        linkDirectionalParticleColor={() => 'blue'}
        linkDirectionalParticleWidth={3}
        linkHoverPrecision={5}

        onNodeDragEnd={node => {
            node.fx = node.x;
            node.fy = node.y;
            node.fz = node.z;
          }}
        linkDirectionalParticles="value"
        linkThreeObjectExtend={true}
        linkThreeObject={link => {
          // extend link with text sprite
          const sprite = new SpriteText(`${link.label}`);
          sprite.color = 'lightgrey';
          sprite.textHeight = 6.5;
          sprite.fontSize=40;
          return sprite;
        }}

        onLinkClick={link => this.fgRef.current.emitParticle(link)}

        linkPositionUpdate={(sprite, { start, end }) => {
          const middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
            [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
          })));

          // Position sprite
          Object.assign(sprite.position, middlePos);
        }}
      />
        </> 
        
    }
}