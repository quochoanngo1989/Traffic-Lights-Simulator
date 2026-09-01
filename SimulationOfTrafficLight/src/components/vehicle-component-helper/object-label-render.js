
const DetectionObjectStream= '/detection/objects';
export function renderPopUpOfObjectLabel(props)
{
    /*console.log(props.object); console.log(this.state.log.getCurrentFrame()); console.log(this.props.data.connectedHostes);*/ return props.isSelected && <div>
    {props.object._streams.get(DetectionObjectStream)&&props.object._streams.get(DetectionObjectStream).base.classes[0]=="car"&&<img src="https://st2.depositphotos.com/3665639/7449/v/450/depositphotos_74490439-stock-illustration-pictograph-of-car-icon.jpg" width={50} alt={props.object._streams.get(DetectionObjectStream).base.classes[0]} />}
    {props.object._streams.get(DetectionObjectStream)&&props.object._streams.get(DetectionObjectStream).base.classes[0]=="van"&&<img src="https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/128x128/plain/van.png" width={50} alt={props.object._streams.get(DetectionObjectStream).base.classes[0]} />}
    {props.object._streams.get(DetectionObjectStream)&&props.object._streams.get(DetectionObjectStream).base.classes[0]=="cyclist"&&<img src="https://e7.pngegg.com/pngimages/787/917/png-clipart-bicycle-cycling-jersey-cyclo-cross-sport-cyclist-icon-blue-text-thumbnail.png" width={50} alt={props.object._streams.get(DetectionObjectStream).base.classes[0]} />}
    {props.object._streams.get(DetectionObjectStream)&&props.object._streams.get(DetectionObjectStream).base.classes[0]=="pedestrian"&&<img src="https://static-00.iconduck.com/assets.00/pedestrian-icon-160x256-lqls46zs.png" width={25} alt={props.object._streams.get(DetectionObjectStream).base.classes[0]} />}
    
    {this.props.data.connectedHostes.map(h=>{ return props.object._streams.get(h+DetectionObjectStream)&&props.object._streams.get(h+DetectionObjectStream).base.classes[0]=="car"&&<img src="https://st2.depositphotos.com/3665639/7449/v/450/depositphotos_74490439-stock-illustration-pictograph-of-car-icon.jpg" width={50} alt={props.object._streams.get(h+DetectionObjectStream).base.classes[0]} />})
    }
    {this.props.data.connectedHostes.map(h=>{ return props.object._streams.get(h+DetectionObjectStream)&&props.object._streams.get(h+DetectionObjectStream).base.classes[0]=="van"&&<img src="https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/128x128/plain/van.png" width={50} alt={props.object._streams.get(h+DetectionObjectStream).base.classes[0]} />})
    }
    {this.props.data.connectedHostes.map(h=>{ return props.object._streams.get(h+DetectionObjectStream)&&props.object._streams.get(h+DetectionObjectStream).base.classes[0]=="cyclist"&&<img src="https://e7.pngegg.com/pngimages/787/917/png-clipart-bicycle-cycling-jersey-cyclo-cross-sport-cyclist-icon-blue-text-thumbnail.png" width={50} alt={props.object._streams.get(h+DetectionObjectStream).base.classes[0]} />})
    }
    {this.props.data.connectedHostes.map(h=>{ return props.object._streams.get(h+DetectionObjectStream)&&props.object._streams.get(h+DetectionObjectStream).base.classes[0]=="pedestrian"&&<img src="https://static-00.iconduck.com/assets.00/pedestrian-icon-160x256-lqls46zs.png" width={25} alt={props.object._streams.get(h+DetectionObjectStream).base.classes[0]} />})
    }
    </div>
}