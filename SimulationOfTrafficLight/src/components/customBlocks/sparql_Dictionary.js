const INITIAL_CODE={
    sparqlQuery:`  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX sosa: <http://www.w3.org/ns/sosa/>
  PREFIX : <http://tu-berlin.de/ontology#>

  SELECT   ?stream ?bbox
  WHERE {
  STREAM ?stream @ ?ts WINDOW [1s]{
    ?sensor :observes ?objects.
    FILTER ((?o > 10) && (?p = "example" || (?s = "nested" && ?o < 20)))
  }
  ?car sosa:hosts ?sensor.
  ?stream :generatedBy ?sensor.
  ?stream rdf:type :LidarStream.
  FILTER (?s = "simple")
 }
`,
    xml:`<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="SPARQLCommand" id="~91i|tL6rM6BP@Q-ASmR" x="10" y="10">
    <statement name="PREFIX_INPUT">
      <block type="CONSTANT_SPARQL_PREFIX" id="o79JtUC#/L5:[-J8xa89">
        <field name="CONSTANT_PREFIX_DROPDOWN">PREFIX rdf: &lt;http://www.w3.org/1999/02/22-rdf-syntax-ns#&gt;</field>
        <next>
          <block type="CONSTANT_SPARQL_PREFIX" id="8C_!he9Yob$vFJ__udJD">
            <field name="CONSTANT_PREFIX_DROPDOWN">PREFIX sosa: &lt;http://www.w3.org/ns/sosa/&gt;</field>
            <next>
              <block type="CONSTANT_SPARQL_PREFIX" id="U?ojjy_LDPF=Kd_*uVss">
                <field name="CONSTANT_PREFIX_DROPDOWN">PREFIX : &lt;http://tu-berlin.de/ontology#&gt;</field>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
    <statement name="SELECT_INPUT">
      <block type="CONSTANT_SELECT_FIELD" id="GSO8J9R2D,kSpHH$Z;0o">
        <field name="CONSTANT_SELECT_FIELD_DROPDOWN">?stream</field>
        <next>
          <block type="CONSTANT_SELECT_FIELD" id="}u]a9BFoYmyOT|3a}!V7">
            <field name="CONSTANT_SELECT_FIELD_DROPDOWN">?bbox</field>
          </block>
        </next>
      </block>
    </statement>
    <statement name="WHERE_INPUT">
      <block type="STREAM_TIME_WINDOW" id="fC3*S])LRrR?@i^L=TZ)">
        <field name="1.FIELD_TIME_WINDOW_DROPDOWN">?stream</field>
        <field name="2.FIELD_TIME_WINDOW_DROPDOWN">?ts</field>
        <field name="TIME_WINDOW_NUMBER">1</field>
        <statement name="RDF_INPUT">
          <block type="CONSTANT_RDF_FIELD" id="Q|Jpp3JpM(tEnpM#]BMW">
            <field name="SUBJECT_DROPDOWN">?sensor</field>
            <field name="PREDICATE_DROPDOWN">:observes</field>
            <field name="OBJECT_DROPDOWN">?objects</field>
            <next>
              <block type="CONSTANT_RDF_FIELD" id="Z}Rh@e:;C:l8#Idu34J$">
                <field name="SUBJECT_DROPDOWN">?objects</field>
                <field name="PREDICATE_DROPDOWN">sosa:hasResultTime</field>
                <field name="OBJECT_DROPDOWN">?ts</field>
                <next>
                  <block type="CONSTANT_RDF_FIELD" id="dWjRfS!j$4tv-;{+w(g0">
                    <field name="SUBJECT_DROPDOWN">?vehicle</field>
                    <field name="PREDICATE_DROPDOWN">:detectedIn</field>
                    <field name="OBJECT_DROPDOWN">?objects</field>
                    <next>
                      <block type="CONSTANT_RDF_FIELD" id="4.CY9leT1E#YRVQ:5L#/">
                        <field name="SUBJECT_DROPDOWN">?vehicle</field>
                        <field name="PREDICATE_DROPDOWN">rdf:type</field>
                        <field name="OBJECT_DROPDOWN">:Car</field>
                        <next>
                          <block type="CONSTANT_RDF_FIELD" id="$g8Z!fblb$h1U-H+?$rT">
                            <field name="SUBJECT_DROPDOWN">?vehicle</field>
                            <field name="PREDICATE_DROPDOWN">:hasBoundingBox</field>
                            <field name="OBJECT_DROPDOWN">?bbox</field>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`
}
const SPARQL_DICTIONARY={
    sub_objects:[
        '?stream',
        '?bbox', 
        '?ts',
        '?sensor',
        '?objects',
        '?vehicle',
        '?car',
        ':Car',
        ':LidarStream'
    ],
    predicates:[
        ':observes',
        'sosa:hasResultTime',
        ':detectedIn',
        'rdf:type',
        ':hasBoundingBox',
        'sosa:hosts',
        ':generatedBy'
    ],
    prefixes:[
        'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
        'PREFIX sosa: <http://www.w3.org/ns/sosa/>',
        'PREFIX : <http://tu-berlin.de/ontology#>'
    ]}
function loadDictinaryByKey(key,dictionary){
    return dictionary[key].sort().map(keyword=>[keyword,keyword]);
}  
export {SPARQL_DICTIONARY,INITIAL_CODE,loadDictinaryByKey}; 