
const RQ_PREFIXES=[
{acronym:"rdf:",prefix:"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"},
{acronym:"sosa:",prefix:"PREFIX sosa: <http://www.w3.org/ns/sosa/>"},
{acronym:"ods:",prefix:"PREFIX ods: <http://tu-berlin.de/ontology#>"}];

const FK_NAMESPACE="https://data.mydomain.com/ontologies/sparnatural-config/";
const ENTITIES=[
"StreamEntity", 
"SensorEntity",
"CarEntity",
"ObjectEntity",
"VehicleEntity",
"VanEntity",
"PedestrianEntity",
"CyclistEntity",
"BBoxEntity",
"StreamTypeEntity", 
"VehicleTypeEntity",
"CarNameEntity",
"SensorTypeEntity",
"TrafficInfrastructureEntity",
"TrafficInfrastructureTypeEntity"
];
const RP_PATTERNS=[
    {searching:`<${FK_NAMESPACE}observes>`,replacedBy:"ods:observes"},
    {searching:`<${FK_NAMESPACE}detectedIn>`,replacedBy:"ods:detectedIn"},
    {searching:`<${FK_NAMESPACE}hasBBox>`,replacedBy:"ods:hasBoundingBox"},
    {searching:`<${FK_NAMESPACE}streamType>`,replacedBy:"ods:streamType"},
    {searching:`<${FK_NAMESPACE}vehicleType>`,replacedBy:"ods:vehicleType"},
    {searching:`<${FK_NAMESPACE}sensorType>`,replacedBy:"ods:sensorType"},
    {searching:`<${FK_NAMESPACE}hostedBy>`,replacedBy:"ods:hostedBy"},
    {searching:`<${FK_NAMESPACE}recognizedAs>`,replacedBy:"ods:recognizedAs"},
    {searching:`<${FK_NAMESPACE}hosts>`,replacedBy:"sosa:hosts"},
    {searching:`<${FK_NAMESPACE}generatedBy>`,replacedBy:"sosa:generatedBy"},
    {searching:`<${FK_NAMESPACE}trafficInfrastructureType>`,replacedBy:"ods:trafficInfrastructureType"}
];

export function editQuery(sparqlQuery,queryJson){
    let query=sparqlQuery;
    ENTITIES.forEach(entity=>{
        let patternStr=`\\?[a-zA-Z0-9_?-]+\\s+rdf:type\\s+<${FK_NAMESPACE}${entity}>.\\r?\\n`;
        let regexPattern = new RegExp(patternStr,"g");
        query=query.replace(regexPattern,"");
    });
    RP_PATTERNS.forEach(p=>{
        let patternStr=`${p.searching}`;
        let regexPattern = new RegExp(patternStr,"g");
        query=query.replace(regexPattern, p.replacedBy)
    });
    const PREFIX_PATTERN=/\bPREFIX\b\s+\S+\s*:\s*<http\S+>\r?\n/;
    query=query.replace(new RegExp(PREFIX_PATTERN,"g"),"");
    RQ_PREFIXES.forEach(p=>{
        let patternStr=`\\s+\\b${p.acronym}`;
        let regexPattern = new RegExp(patternStr);
        const match = query.match(regexPattern);
        if(match)
        {
            query=p.prefix+"\n"+query;
        }
    });
    queryJson.variables.forEach(v=>{
        let patternStr=`Entity_\\d+`;
        let regexPattern = new RegExp(patternStr);
        if (v.value.match(regexPattern)){
            const variableName=v.value.replace(regexPattern,"").toLowerCase();
            query=query.replace(new RegExp(`\\?${v.value}\\b`,"g"),`?${variableName}`);
        }
    })
return query;
}

export const SavedQueries=[
    {id:1,label:"Select Stream and Bounding Boxes",query:{
        "distinct": true,
        "variables": [
            {
                "termType": "Variable",
                "value": "StreamEntity_1"
            },
            {
                "termType": "Variable",
                "value": "BBoxEntity_12"
            }
        ],
        "order": null,
        "branches": [
            {
                "line": {
                    "s": "StreamEntity_1",
                    "p": "https://data.mydomain.com/ontologies/sparnatural-config/generatedBy",
                    "o": "SensorEntity_2",
                    "sType": "https://data.mydomain.com/ontologies/sparnatural-config/StreamEntity",
                    "oType": "https://data.mydomain.com/ontologies/sparnatural-config/SensorEntity",
                    "values": []
                },
                "children": [
                    {
                        "line": {
                            "s": "SensorEntity_2",
                            "p": "https://data.mydomain.com/ontologies/sparnatural-config/hostedBy",
                            "o": "CarEntity_4",
                            "sType": "https://data.mydomain.com/ontologies/sparnatural-config/SensorEntity",
                            "oType": "https://data.mydomain.com/ontologies/sparnatural-config/CarEntity",
                            "values": []
                        },
                        "children": []
                    },
                    {
                        "line": {
                            "s": "SensorEntity_2",
                            "p": "https://data.mydomain.com/ontologies/sparnatural-config/observes",
                            "o": "ObjectEntity_6",
                            "sType": "https://data.mydomain.com/ontologies/sparnatural-config/SensorEntity",
                            "oType": "https://data.mydomain.com/ontologies/sparnatural-config/ObjectEntity",
                            "values": []
                        },
                        "children": [
                            {
                                "line": {
                                    "s": "ObjectEntity_6",
                                    "p": "https://data.mydomain.com/ontologies/sparnatural-config/recognizedAs",
                                    "o": "VehicleEntity_8",
                                    "sType": "https://data.mydomain.com/ontologies/sparnatural-config/ObjectEntity",
                                    "oType": "https://data.mydomain.com/ontologies/sparnatural-config/VehicleEntity",
                                    "values": []
                                },
                                "children": [
                                    {
                                        "line": {
                                            "s": "VehicleEntity_8",
                                            "p": "https://data.mydomain.com/ontologies/sparnatural-config/vehicleType",
                                            "o": "VehicleTypeEntity_10",
                                            "sType": "https://data.mydomain.com/ontologies/sparnatural-config/VehicleEntity",
                                            "oType": "https://data.mydomain.com/ontologies/sparnatural-config/VehicleTypeEntity",
                                            "values": [
                                                {
                                                    "label": "Car",
                                                    "rdfTerm": {
                                                        "type": "literal",
                                                        "value": "ods:Car"
                                                    }
                                                }
                                            ]
                                        },
                                        "children": []
                                    },
                                    {
                                        "line": {
                                            "s": "VehicleEntity_8",
                                            "p": "https://data.mydomain.com/ontologies/sparnatural-config/hasBBox",
                                            "o": "BBoxEntity_12",
                                            "sType": "https://data.mydomain.com/ontologies/sparnatural-config/VehicleEntity",
                                            "oType": "https://data.mydomain.com/ontologies/sparnatural-config/BBoxEntity",
                                            "values": []
                                        },
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }},
    {id:2,label:"Select Stream from Ego Car",query:{
        "distinct": true,
        "variables": [
            {
                "termType": "Variable",
                "value": "StreamEntity_1"
            }
        ],
        "order": null,
        "branches": [
            {
                "line": {
                    "s": "StreamEntity_1",
                    "p": "https://data.mydomain.com/ontologies/sparnatural-config/generatedBy",
                    "o": "SensorEntity_2",
                    "sType": "https://data.mydomain.com/ontologies/sparnatural-config/StreamEntity",
                    "oType": "https://data.mydomain.com/ontologies/sparnatural-config/SensorEntity",
                    "values": []
                },
                "children": [
                    {
                        "line": {
                            "s": "SensorEntity_2",
                            "p": "https://data.mydomain.com/ontologies/sparnatural-config/hostedBy",
                            "o": "CarEntity_20",
                            "sType": "https://data.mydomain.com/ontologies/sparnatural-config/SensorEntity",
                            "oType": "https://data.mydomain.com/ontologies/sparnatural-config/CarEntity",
                            "values": [
                                {
                                    "label": "Ego Car",
                                    "rdfTerm": {
                                        "type": "literal",
                                        "value": "ods:EgoCar"
                                    }
                                }
                            ]
                        },
                        "children": []
                    }
                ]
            }
        ]
    } }
];