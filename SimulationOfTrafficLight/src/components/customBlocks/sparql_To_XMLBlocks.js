import { INITIAL_CODE } from "./sparql_Dictionary";
const PREFIX_URI_PATTERN= /\bPREFIX\b\s+([a-zA-Z0-9_-]*):\s+<([^>]+)>$/gm; // Regex for PREFIX
const SELECT_PATTERN=/\bSELECT\b\s+(DISTINCT|REDUCED\s+)?(\*|([\?\$][a-zA-Z0-9_-]+(?:\s+[\?\$][a-zA-Z0-9_-]+)*))/i;
//const WHERE_PATTERN=/\bWHERE\b\s*\{([\s\S]*?)\}/i;
//const STREAM_WINDOW_PATTERN=/\bSTREAM\b\s+(\?[a-zA-Z0-9_-]+)\s+@\s+(\?[a-zA-Z0-9_-]+)\s+\bWINDOW\b\s+\[(\d+)s\]/i;
const WHERE_PATTERN=/WHERE\s*(.*)/s;
const STREAM_WINDOW_PATTERN=/\bSTREAM\b\s+(\?[a-zA-Z0-9_-]+)\s+@\s+(\?[a-zA-Z0-9_-]+)\s+\bWINDOW\b\s*\[\s*(\d+)\s*s\s*\]\s*{([\s\S]*?)\}/s;
const RDF_TRIPLE_PATTERN=/([^\s]+)\s+([^\s]+)\s+([^\s]+)\s*\./g; // Match triples
const FILTER_PATTERN=/\bFILTER\s*(.*)/g; // Match FILTER conditions
const GROUP_BY_PATTERN="/\bGROUP\s+BY\s+(.+?)(?=\b(?:LIMIT|OFFSET|ORDER BY|HAVING|$))/is";
const BLANK_LINE_PATTERN= /^\s*\n/gm;

function extractPrefixes(query) {
    const prefixes = [];
    let match;
    // Use regex to find all PREFIX declarations
    while ((match = PREFIX_URI_PATTERN.exec(query)) !== null) {
        prefixes.push({ prefix: match[1], URI: match[2] });
    }
    return prefixes;
}
function extractSelect(query) {
    // Regex pattern to match the SELECT clause
    const match = query.match(SELECT_PATTERN);
    if (match) {
        const selectContent = match[2].trim(); // Extract the variables or '*'
        if (selectContent === '*') {
            return { type: 'all', variables: ['*'] }; // SELECT * case
        } else {
            // Split variables and return as an array
            const variables = selectContent.split(/\s+/).map(v => v.trim());
            return { type: 'variables', variables: variables };
        }
    } else {
        return null; // No SELECT clause found
    }
}
/*
function extractStreamWindow(whereClause) {
    const match = whereClause.match(STREAM_WINDOW_PATTERN);
    // If a match is found, return the captured groups
    if (match) {
        console.log(match);
        const conditionContent=match[4].trim();
        return {field_1:match[1], field_2:match[2], time:match[3],...extractTriblesandFilters(conditionContent)};
    } else {
        return {}; // Return empty array if no match
    }
}*/

function extractStreamWindow(whereClause) {
    const result=[];
    do {
        const match = whereClause.match(STREAM_WINDOW_PATTERN);
        if(match){
            const conditionContent=match[4].trim();
            result.push({field_1:match[1], field_2:match[2], time:match[3],...extractTriblesandFilters(conditionContent)});
            whereClause=whereClause.replace(STREAM_WINDOW_PATTERN, '');
        }else
            break;
    } while (true);
    return result;
}

function extractTriblesandFilters(conditionContent)
{
    const result = { RDF_INPUT: [], FILTER_INPUT: [] }; // Structure for result
    // Extract triples
    let tripleMatch;
    while ((tripleMatch = RDF_TRIPLE_PATTERN.exec(conditionContent)) !== null) {
        result.RDF_INPUT.push({
            subject: tripleMatch[1],
            predicate: tripleMatch[2],
            object: tripleMatch[3],
        });
    }
    // Extract FILTER conditions
    let filterMatch;
    while ((filterMatch = FILTER_PATTERN.exec(conditionContent)) !== null) {
        let filter= filterMatch[1].trim();
        filter=filter.startsWith("(")&&filter.endsWith(")")?filter.substring(1,filter.length-1).trim():filter; 
        result.FILTER_INPUT.push(filter);
    }
    return result;
}

function extractWhere(query) {
    const whereMatch = query.match(WHERE_PATTERN); // Match WHERE block
    if (!whereMatch) return null; // No WHERE clause found
    let whereContent = whereMatch[1].trim(); // Get the content inside WHERE { ... }
    let replacedContent;
    do {
       replacedContent= whereContent.replace(STREAM_WINDOW_PATTERN, '');
       if(replacedContent==whereContent)
            break;
        else
            whereContent=replacedContent;
    } while (true);//Remove StreamWindow content
    whereContent=whereContent.replace(BLANK_LINE_PATTERN,'');
    return extractTriblesandFilters(whereContent);
}
function parseSPARQL(sparqlQuery){
    //console.log(sparqlQuery);
    sparqlQuery=sparqlQuery.replace(BLANK_LINE_PATTERN,'');
    //console.log(sparqlQuery);
    //update SPARQL_DICTIONARY
    /*return {
        "PREFIX_INPUT":[
            {"prefix":"rdf","URI":"http://www.w3.org/1999/02/22-rdf-syntax-ns#"},
            {"prefix":"sosa","URI":"http://www.w3.org/ns/sosa/"},
            {"prefix":"","URI":"http://tu-berlin.de/ontology#"}],
        "SELECT_INPUT":["?stream","?bbox"],
        "WHERE_INPUT":[
            {
                "field_1":"?stream", 
                "field_2":"?ts",
                "time":1,
                "RDF_INPUT":[
                    {"subject":"?sensor","predicate":":observes","object":"?objects"},
                    {"subject":"?objects","predicate":":sosa:hasResultTime","object":"?ts"},
                    {"subject":"?vehicle","predicate":":detectedIn","object":"?objects"},
                    {"subject":"?vehicle","predicate":"rdf:type","object":":Car"},
                    {"subject":"?vehicle","predicate":":hasBoundingBox","object":"?bbox"}],  
                "FILTER_INPUT":[]
            }
        ]
    }*/
    const where_input=  extractStreamWindow(sparqlQuery);
    //console.log(sparqlQuery);
    where_input.push(extractWhere(sparqlQuery));
    const sparsedSparql={
        "PREFIX_INPUT":extractPrefixes(sparqlQuery),
        "SELECT_INPUT":extractSelect(sparqlQuery).variables,
        "WHERE_INPUT":where_input
    }
    //console.log(sparsedSparql);
    return sparsedSparql;
}

function generate_PREFIX_INPUT_STATEMENT(prefixes){
    let template=``;
    for (let index = prefixes.length-1; index>=0 ; index--){
        if(index<prefixes.length-1)
            template=`<next>${template}</next>`;
        template=`<block type="CONSTANT_SPARQL_PREFIX" id="${randomId()}">
        <field name="CONSTANT_PREFIX_DROPDOWN">PREFIX ${prefixes[index].prefix}: &lt;${prefixes[index].URI}&gt;</field>${template}</block>`;
    }
    return template.length?`<statement name="PREFIX_INPUT">${template}</statement>`:template;
}
function generate_SELECT_INPUT_STATEMENT(selectFields){
    let template=``;
    for (let index = selectFields.length-1; index>=0 ; index--){
        if(index<selectFields.length-1)
            template=`<next>${template}</next>`;
        template=`<block type="CONSTANT_SELECT_FIELD" id="${randomId()}">
        <field name="CONSTANT_SELECT_FIELD_DROPDOWN">${selectFields[index]}</field>${template}</block>`;
    }
    return template.length?`<statement name="SELECT_INPUT">${template}</statement>`:template;
}
function generate_WHERE_INPUT_STATEMENT(streamTimeWindows){
    let template=``;
    for (let index = streamTimeWindows.length-1; index>=0 ; index--){
        if(streamTimeWindows[index]["field_1"]&&streamTimeWindows[index]["field_2"]&&streamTimeWindows[index]["time"]){
            if(index<streamTimeWindows.length-1)
                template=`<next>${template}</next>`;
            template=`<block type="STREAM_TIME_WINDOW" id="${randomId()}">
            <field name="1.FIELD_TIME_WINDOW_DROPDOWN">${streamTimeWindows[index]["field_1"]}</field>
            <field name="2.FIELD_TIME_WINDOW_DROPDOWN">${streamTimeWindows[index]["field_2"]}</field>
            <field name="TIME_WINDOW_NUMBER">${streamTimeWindows[index]["time"]}</field>
            ${generate_RDF_FILTER_INPUT_STATEMENT(streamTimeWindows[index]["RDF_INPUT"],streamTimeWindows[index]["FILTER_INPUT"],false)}
            ${template}
          </block>`;
        }else
        {
            //template=`${generate_RDF_INPUT_STATEMENT(streamTimeWindows[index]["RDF_INPUT"],true)}`;
            template=`${generate_RDF_FILTER_INPUT_STATEMENT(streamTimeWindows[index]["RDF_INPUT"],streamTimeWindows[index]["FILTER_INPUT"],true)}`;
        }
    }
    return template.length?`<statement name="WHERE_INPUT">${template}</statement>`:template;
}
function generate_RDF_INPUT_STATEMENT(rdfs,isBlock=true)
{
    let template=``;
    for (let index = rdfs.length-1; index>=0 ; index--){
        if(index<rdfs.length-1)
            template=`<next>${template}</next>`;
        template=`<block type="CONSTANT_RDF_FIELD" id="${randomId()}">
            <field name="SUBJECT_DROPDOWN">${rdfs[index].subject}</field>
            <field name="PREDICATE_DROPDOWN">${rdfs[index].predicate}</field>
            <field name="OBJECT_DROPDOWN">${rdfs[index].object}</field>
            ${template}
      </block>`;
    }
    return template.length?(isBlock?template:`<statement name="RDF_INPUT">${template}</statement>`):template;
}

function generate_RDF_FILTER_INPUT_STATEMENT(rdfs,filters,isBlock=true)
{
    rdfs=rdfs.map(rdf=>{return {...rdf,type:"rdf"}})
    filters=filters.map(filter=>{return {filter,type:"filter"}})
    const conditions= rdfs.concat(filters);
    let template=``;
    for (let index = conditions.length-1; index>=0 ; index--){
        if(index<conditions.length-1)
            template=`<next>${template}</next>`;
        template=conditions[index].type=="rdf"? 
        `<block type="CONSTANT_RDF_FIELD" id="${randomId()}">
            <field name="SUBJECT_DROPDOWN">${conditions[index].subject}</field>
            <field name="PREDICATE_DROPDOWN">${conditions[index].predicate}</field>
            <field name="OBJECT_DROPDOWN">${conditions[index].object}</field>
            ${template}
      </block>`:
      `<block type="CONSTANT_FILTER_FIELD" id="${randomId()}">
            <field name="FILTER_CONDITION_TEXT">${encodeXMLString(conditions[index].filter)}</field>
            ${template}
      </block>`;
    }
    return template.length?(isBlock?template:`<statement name="RDF_INPUT">${template}</statement>`):template;
}

function encodeXMLString(str)
{
    return str.replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&apos;").replace(/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]/g, '');
    
}
function generateXMLBlocks(sparql)
{
    try{
    const parsedSPARQL=parseSPARQL(sparql);
    let xml=`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="SPARQLCommand" id="${randomId()}" x="50" y="50">
    ${generate_PREFIX_INPUT_STATEMENT(parsedSPARQL["PREFIX_INPUT"])}
    ${generate_SELECT_INPUT_STATEMENT(parsedSPARQL["SELECT_INPUT"])}
    ${generate_WHERE_INPUT_STATEMENT(parsedSPARQL["WHERE_INPUT"])}
    </block>
    </xml>`;
    //console.log(xml)
    return xml;
    }catch{
        return `<xml xmlns="https://developers.google.com/blockly/xml"></xml>`
    }
}

function randomId(){
  const minCeiled = Math.ceil(1000000000);
  const maxFloored = Math.floor(9999999999);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is
}

export {generateXMLBlocks}
