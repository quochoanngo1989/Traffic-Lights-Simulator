import React, { Component } from 'react';
import { dragElement } from './grid_layout_script';
class QueriedCameraGridLayout extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        dragElement("sortableQueriedCameraGrid");
    }
    render(){
        return <div className="grid-container" id="sortableQueriedCameraGrid">
            {this.props.children}
      </div>
    }    
}

export default QueriedCameraGridLayout;