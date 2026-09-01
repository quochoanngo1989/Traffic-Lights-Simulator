
import React from 'react';
import { editQuery,SavedQueries } from './sparnatural/ontonlogy-adapter';
const configURL="https://xls2rdf.sparna.fr/rest/convert?url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1YW6ZWZve7NqKtEKqsbjrnjxWl1mBF6bB%2Fexport%3Fformat%3Dxlsx&noPostProcessings=true";
const endpointURL="https://dbpedia.org/sparql";
export class Sparnatural extends React.PureComponent{
  constructor(props) {
    super(props);
    this.updateQueryState=props.updateQueryState;
    //this.executeQuery=props.executeQuery;
    this.sparNaturalRef=React.createRef();
    
  } 
  componentDidMount(){
    const sparnatural = document.querySelector("spar-natural");
 
    // triggered as soon there is a modification in the query
    sparnatural.addEventListener("queryUpdated", (event) => {
      console.log(event.detail.queryJson);
      //console.log(event.detail.querySparqlJs);
      this.updateQueryState({query:editQuery(event.detail.queryString,event.detail.queryJson)});
    });

    // triggered when submit button is called
    sparnatural.addEventListener("submit", (event) => {
      console.log("submit");
      //this.executeQuery();
      //event.preventDefault();
    });

    // triggered when reset button is clicked
    sparnatural.addEventListener("reset", (event) => {
      console.log("reset");
      this.updateQueryState({query:""});
    });
    
  }
  render(){
    return (
      <div className="Sparnatural">
        {/*FontAwesome is only needed when the fontawesome features is used to display icons*/}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"  />
        <select onChange={(e)=>{
          document.querySelector("spar-natural").loadQuery(JSON.parse(e.target.value));
        }}>
          {SavedQueries.map(q=>{
            return <option key={q.id} id={q.id} value={JSON.stringify(q.query)}>{q.label}</option> 
          }) }
        </select>
        <spar-natural ref={this.sparNaturalRef}
              src={configURL}
              endpoint={endpointURL}
              lang="en"
              defaultLang="en"
              distinct="true"
              limit="1000"
              debug="true"
          ></spar-natural>
        <div id='yasqe'></div>
        <div id='query-json'></div>
      </div>
    );
  }
}