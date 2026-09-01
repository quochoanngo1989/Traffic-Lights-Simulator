import React, { Component } from 'react';
import { IoIosClose,IoIosAdd } from "react-icons/io";
import { dragElement } from './grid_layout_script';
import "./grid_layout.css"
class GridLayout extends Component {
    constructor(props) {
        super(props);
        this.state={size:0};
    }
    renderDuplicatedItems=()=>{
        const duplicatedItems=[];
        for(var i=1;i<this.state.size;i++)
        {
            const item=<div className="grid-item" draggable="true" id={"item"+i}>
                <div style={{position:"relative"}}>
                <IoIosClose style={{position:"absolute",cursor:"pointer", top:"-15px", left:"-15px",padding:"0px"}} onClick={()=>{this.setState({size:this.state.size-1})}} />
                {this.props.children}
                </div>
        </div>
            duplicatedItems.push(item);
        }
        return duplicatedItems;
    }
    /*dragElement=()=>{
        const gridContainer = document.getElementById("sortableGrid");
        let draggedItem = null;
        // Handle Drag Start
        gridContainer.addEventListener("dragstart", (e) => {
        draggedItem = e.target;
        e.target.style.opacity = "0.5";
        });
        // Handle Drag End
        gridContainer.addEventListener("dragend", (e) => {
        e.target.style.opacity = "1";
        draggedItem = null;
        });
        // Handle Dragging Over Grid Items
        gridContainer.addEventListener("dragover", (e) => {
        e.preventDefault();
        });
        // Handle Drop
        gridContainer.addEventListener("drop", (e) => {
        e.preventDefault();
        const targetItem = e.target;
        if (
            targetItem &&
            targetItem !== draggedItem &&
            targetItem.classList.contains("grid-item")
        ) {
            const draggedIndex = [...gridContainer.children].indexOf(draggedItem);
            const targetIndex = [...gridContainer.children].indexOf(targetItem);
            if (draggedIndex < targetIndex) {
            gridContainer.insertBefore(draggedItem, targetItem.nextSibling);
            } else {
            gridContainer.insertBefore(draggedItem, targetItem);
            }
        }
        });
    }*/
    componentDidMount(){
        //this.dragElement("sortableGrid");
        dragElement("sortableGrid");
    }
    render(){
        return <div className="grid-container" id="sortableGrid">
        <div className="grid-item" draggable="true" id="item1">
        <div style={{position:"relative", marginTop:"-0px"}}>
        <IoIosAdd style={{position:"absolute",cursor:"pointer", top:"-15px", left:"-15px",padding:"0px"}} onClick={()=>{this.setState({size:this.state.size+1})}} />
        {this.props.children}
        </div>
        </div>
        {this.renderDuplicatedItems()}
      </div>
    }    
}

export default GridLayout;