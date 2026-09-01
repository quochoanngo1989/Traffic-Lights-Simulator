import React from 'react';
import SortableList, { SortableItem } from "react-easy-sort";
import arrayMove from "array-move";
export default class ViewerSecondaryControl extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state={items:[
            "A",
            "B",
            "C",
            "D",
            "E",
          ]}; 
    }
    render=()=> {
    return <div>
<SortableList
      onSortEnd={(oldIndex, newIndex) => {
        this.setState({items:arrayMove(this.state.items, oldIndex, newIndex)});
      }}
      className="list"
      draggedItemClassName="dragged"
    >
      {this.state.items.map((item) => (
        <SortableItem key={item}>
          <div className={item=="A"?"item item-active":"item"}>{}</div>
        </SortableItem>
      ))}
    </SortableList>
    <div className='buttons'>
        <button className='button-8'>Close</button>
        <button className='button-8'>Move up</button>
    </div>
    </div>
    }
}