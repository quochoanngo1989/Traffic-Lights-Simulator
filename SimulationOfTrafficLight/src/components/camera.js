import React, { Component } from 'react';
class Camera extends Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
    }
    draw() {
        const { imageData,type } = this.props;// based on selected camera stream name, get image/type
        const canvas = this.canvas.current;
        const context = canvas.getContext('2d');
        //context.drawImage(imageData, 0, 0, width, height);
        /*const context = canvas.getContext('2d', {
            willReadFrequently: true
          });*/
        
        if (!context) {
            throw new Error('Canvas context is not available.');
        }
        //[Uint8Array]
        const blob = new Blob([ imageData ], { type: 'image/png' });
        const image = new Image();
        image.onload = () => {
              canvas.width = image.width;
              canvas.height = image.height;
              context.drawImage(image, 0, 0);
              //resolve(context.getImageData(0, 0, image.width, image.height));
        }
        image.src = URL.createObjectURL(blob);
    }

    componentDidUpdate() {
        this.draw();
    }
    componentDidMount(){
    }
    render(){
        return<>
        <select>
            <option>"EGO_CAR/font"</option>
            <option>"EGO_CAR/left"</option>
            <option>"EGO_CAR/right"</option>
            <option>"DS_1/font"</option>
            <option>"DS_1/left"</option>
            <option>"DS_1/right"</option>
            <option>"DS_2/font"</option>
            <option>"DS_2/left"</option>
            <option>"DS_2/right"</option>
        </select>
        <canvas  width="300" height="180"  ref={this.canvas}></canvas>
    </>
    }    
}

export default Camera;