import React from "react";
import { KnowledgeGraph } from "../vehicleDriverView/knowledge-graph-component";
const knowledgeGraphViewerStyle = {};
const knowledgeGraphViewerInnerStyle = {};

export class KnowledgeGraphViewer extends React.PureComponent{
    constructor(props){
        super(props);
        this.state={width:window.innerWidth,height:window.innerHeight}
    }
    handleResize=()=>{
        this.setState({width:window.innerWidth,height:window.innerHeight});
    }
    componentDidMount(){
        window.addEventListener("resize",this.handleResize);
    }
    componentWillUnmount(){
        window.removeEventListener("resize",this.handleResize);
    }
    render(){        
        return <div className="knowledge-graph-viewer" style={knowledgeGraphViewerStyle}>
        <div className="knowledge-graph-viewer-inner" style={knowledgeGraphViewerInnerStyle}>
          <KnowledgeGraph {...this.props} {...this.state}></KnowledgeGraph>
        </div>
      </div>
    }
}