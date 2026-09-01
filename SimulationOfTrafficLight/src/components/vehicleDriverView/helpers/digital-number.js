import React,{useEffect,useRef,memo} from "react";
import "../css/digital-number.css";
export const DigitalNumber=memo(({id,number,place,color="red"})=>{
    const numPlace=number.toString().length;
    place= numPlace>place?numPlace:place;
    const digits= useRef("#"+id).current;
   
    useEffect(()=>{
        const style = document.createElement('style');
        style.innerHTML = `
          ${digits} .d1, ${digits} .d2, ${digits} .d3, ${digits} .d4, ${digits} .d5, ${digits} .d6, ${digits} .d7 {
            background: ${color};
          }
          ${digits} .d1::before, ${digits} .d2::before, ${digits} .d3::before, ${digits} .d4::before, ${digits} .d5::before, ${digits} .d6::before, ${digits} .d7::before {
            border-color: transparent ${color} transparent transparent;
          }
          ${digits} .d1::after, ${digits} .d2::after, ${digits} .d3::after, ${digits} .d4::after, ${digits} .d5::after, ${digits} .d6::after, ${digits} .d7::after {
            border-color: ${color} transparent transparent transparent;
          }
        `;
        document.head.appendChild(style);
        })

    return <div className="display">
    <div id={id} className="digits">
      {generateNumber(number,place-numPlace)}
    </div>
  </div>
  },(prevProps,nextProps)=>{
    return prevProps.number==nextProps.number;
  })

  function generateNumber(number,zeroNumber){
    return <>
        {(new Array(zeroNumber).fill("0")).map(zero=>{
            return generateDigital(zero);
        })}
        {Array.from(number.toString()).map(digital=>{
            return generateDigital(digital);
        })}
    </>
  }

  function generateDigital(digital){

    switch (digital) {
        case "0":
            return <div key={Math.random()} className="zero">
            <span className="d1" />
            <span className="d2" />
            <span className="d3" />
            <span className="d4" />
            <span className="d5" />
            <span className="d6" />
            <span className="d7" />
          </div>
        case "1":
            return <div key={Math.random()} className="one">
            <span className="d1" />
            <span className="d2" />
            <span className="d3" />
            <span className="d4" />
            <span className="d5" />
            <span className="d6" />
            <span className="d7" />
          </div>
        case "2":
            return <div key={Math.random()} className="two">
            <span className="d1" />
            <span className="d2" />
            <span className="d3" />
            <span className="d4" />
            <span className="d5" />
            <span className="d6" />
            <span className="d7" />
          </div>
        case "3":
            return <div key={Math.random()} className="three">
            <span className="d1" />
            <span className="d2" />
            <span className="d3" />
            <span className="d4" />
            <span className="d5" />
            <span className="d6" />
            <span className="d7" />
          </div>
        case "4":
            return <div key={Math.random()} className="four">
            <span className="d1" />
            <span className="d2" />
            <span className="d3" />
            <span className="d4" />
            <span className="d5" />
            <span className="d6" />
            <span className="d7" />
          </div>
        case "5":
            return <div key={Math.random()} className="five">
            <span className="d1" />
            <span className="d2" />
            <span className="d3" />
            <span className="d4" />
            <span className="d5" />
            <span className="d6" />
            <span className="d7" />
          </div>
        case "6":
            return <div key={Math.random()} className="six">
            <span className="d1" />
            <span className="d2" />
            <span className="d3" />
            <span className="d4" />
            <span className="d5" />
            <span className="d6" />
            <span className="d7" />
          </div>
        case "7":
            return <div key={Math.random()} className="seven">
            <span className="d1" />
            <span className="d2" />
            <span className="d3" />
            <span className="d4" />
            <span className="d5" />
            <span className="d6" />
            <span className="d7" />
          </div>
        case "8":
            return <div key={Math.random()} className="eight">
            <span className="d1" />
            <span className="d2" />
            <span className="d3" />
            <span className="d4" />
            <span className="d5" />
            <span className="d6" />
            <span className="d7" />
          </div>
        case "9":
            return <div key={Math.random()} className="nine">
            <span className="d1" />
            <span className="d2" />
            <span className="d3" />
            <span className="d4" />
            <span className="d5" />
            <span className="d6" />
            <span className="d7" />
          </div>
        default:
            return <></>;
    }
  }