import Blockly from "blockly";
import { SPARQL_DICTIONARY,loadDictinaryByKey } from "./sparql_Dictionary";
Blockly.Blocks["SPARQLCommand"] = {
  init: function () {
    this.appendDummyInput().appendField("SPARQL Command");
    this.appendDummyInput().appendField("PREFIX");
    this.appendStatementInput("PREFIX_INPUT").setCheck(null);
    this.appendDummyInput().appendField("SELECT");
    this.appendStatementInput("SELECT_INPUT").setCheck(null);
    //this.appendValueInput("SELECT_FIELDS_INPUT").setCheck(null);
    this.appendDummyInput().appendField("WHERE");
    this.appendStatementInput("WHERE_INPUT").setCheck(null);
    this.appendDummyInput().appendField("GROUP BY");
    this.appendStatementInput("GROUP_BY_INPUT").setCheck(null);
    this.appendDummyInput().appendField("ORDER_BY");
    this.appendStatementInput("ORDER_BY_INPUT").setCheck(null);
    this.setInputsInline(false);
    this.setColour(0);
    this.setTooltip("The SPARQL Command");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript["SPARQLCommand"] = function (block) {
  /*var value_bottoken = Blockly.JavaScript.valueToCode(
    block,
    "PREFIX_INPUT",
    Blockly.JavaScript.ORDER_ATOMIC
  );*/
  var prefix_input = Blockly.JavaScript.statementToCode(
    block,
    "PREFIX_INPUT"
  );
  var select_input = Blockly.JavaScript.statementToCode(
    block,
    "SELECT_INPUT"
  );
  var where_input = Blockly.JavaScript.statementToCode(
    block,
    "WHERE_INPUT"
  );
  var code = `${prefix_input}\n  SELECT${select_input}\n  WHERE {\n${where_input} }\n`;
  return code;
};
/***************************************************PREFIX********************************************************/
Blockly.Blocks["SPARQL_PREFIX"] = {
  init: function () {
    this.appendValueInput("NAMESPACE_INPUT")
      .setCheck(null)
      .appendField("Namespace:");
    this.appendValueInput("URL_INPUT")
      .setCheck(null)
      .appendField("Url:");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("PREFIX declaration is used to define shorthand notations for commonly used URIs, making queries more concise and readable.");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript["SPARQL_PREFIX"] = function (block) {
  var namespace_value = Blockly.JavaScript.statementToCode(
    block,
    "NAMESPACE_INPUT",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var url_value = Blockly.JavaScript.statementToCode(
    block,
    "URL_INPUT",
    Blockly.JavaScript.ORDER_ATOMIC
  );

  var code =`PREFIX ${namespace_value}: <${url_value}>\n`;
  return code;
};
Blockly.Blocks['TEXT'] = {
  init: function() {
    this.appendDummyInput().appendField(new Blockly.FieldTextInput(''),
            'TEXT_INPUT');
    this.setOutput(true, "String");
  }
};
Blockly.JavaScript["TEXT"] = function (block) {
  var textInput=block.getFieldValue("TEXT_INPUT")
  return textInput;
};

Blockly.Blocks["INPUT_INLINE_SPARQL_PREFIX"] = {
  init: function () {
    this.appendDummyInput().appendField('PREFIX').appendField(new Blockly.FieldTextInput(''),
            'NAMESPACE_INPUT');
    this.appendDummyInput().appendField(':').appendField(new Blockly.FieldTextInput(''),
            'URL_INPUT');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("PREFIX declaration is used to define shorthand notations for commonly used URIs, making queries more concise and readable.");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript["INPUT_INLINE_SPARQL_PREFIX"] = function (block) {
  var namespace_value =block.getFieldValue("NAMESPACE_INPUT");
  var url_value = block.getFieldValue("URL_INPUT");
  var code =`PREFIX ${namespace_value}: <${url_value}>\n`;
  return code;
};

Blockly.Blocks["CONSTANT_SPARQL_PREFIX"] = {
  init: function () {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(
        loadDictinaryByKey("prefixes",SPARQL_DICTIONARY)), 'CONSTANT_PREFIX_DROPDOWN');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("PREFIX declaration is used to define shorthand notations for commonly used URIs, making queries more concise and readable.");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript["CONSTANT_SPARQL_PREFIX"] = function (block) {
  var dropdown_value=block.getFieldValue("CONSTANT_PREFIX_DROPDOWN")
 return `${dropdown_value}\n`
};


/*****************************************************SELECT_FIELD******************************************************/
Blockly.Blocks["SELECT_FIELD"] = {
  init: function () {
    this.appendDummyInput().appendField('?').appendField(new Blockly.FieldTextInput(''),
            'FIELD_INPUT');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(61);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};
Blockly.JavaScript["SELECT_FIELD"] = function (block) {
  var field_value=block.getFieldValue("FIELD_INPUT")
  return ` ?${field_value}`;
};

Blockly.Blocks["CONSTANT_SELECT_FIELD"] = {
  init: function () {
    const dropdown_values=loadDictinaryByKey("sub_objects",SPARQL_DICTIONARY)//
    dropdown_values.unshift(["*","*"]);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(dropdown_values), 'CONSTANT_SELECT_FIELD_DROPDOWN');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(65);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript["CONSTANT_SELECT_FIELD"] = function (block) {
  var dropdown_value=block.getFieldValue("CONSTANT_SELECT_FIELD_DROPDOWN")
 return ` ${dropdown_value}`
};
/************************************************WHERE SECTION***********************************************************/
Blockly.Blocks["STREAM_TIME_WINDOW"] = {
  init: function () {
    this.appendDummyInput().appendField('STREAM').appendField(new Blockly.FieldDropdown(
      loadDictinaryByKey("sub_objects",SPARQL_DICTIONARY)), '1.FIELD_TIME_WINDOW_DROPDOWN');
    this.appendDummyInput().appendField('@').appendField(new Blockly.FieldDropdown(
      loadDictinaryByKey("sub_objects",SPARQL_DICTIONARY)), '2.FIELD_TIME_WINDOW_DROPDOWN');
  this.appendDummyInput().appendField('WINDOW [').appendField(new Blockly.FieldNumber(1, 0, 100,1), 'TIME_WINDOW_NUMBER').appendField('s]');
    this.setInputsInline(true);
    this.appendStatementInput("RDF_INPUT").setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(99);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript["STREAM_TIME_WINDOW"] = function (block) {
  var field_1_value =block.getFieldValue("1.FIELD_TIME_WINDOW_DROPDOWN");
  var field_2_value = block.getFieldValue("2.FIELD_TIME_WINDOW_DROPDOWN");
  var time_window_value=block.getFieldValue("TIME_WINDOW_NUMBER");
  var rdf_values = Blockly.JavaScript.statementToCode(
    block,
    "RDF_INPUT",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code =`STREAM ${field_1_value} @ ${field_2_value} WINDOW [${time_window_value}s]{\n${rdf_values}}\n`;
  return code;
};

Blockly.Blocks["CONSTANT_FILTER_FIELD"] = {
  init: function () {
    this.appendDummyInput().appendField('FILTER').appendField(new Blockly.FieldTextInput(''),
        'FILTER_CONDITION_TEXT');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(81);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};
Blockly.JavaScript["CONSTANT_FILTER_FIELD"] = function (block) {
  var filter_condition =block.getFieldValue("FILTER_CONDITION_TEXT");
  var code =`FILTER (${filter_condition})\n`;
  return code;
};

/************************************************RDF_FIELD***********************************************************/

Blockly.Blocks["CONSTANT_RDF_FIELD"] = {
  init: function () {
    this.appendDummyInput().appendField('SUBJECT').appendField(new Blockly.FieldDropdown(
      loadDictinaryByKey("sub_objects",SPARQL_DICTIONARY)), 'SUBJECT_DROPDOWN');
    this.appendDummyInput().appendField('PREDICATE').appendField(new Blockly.FieldDropdown(
      loadDictinaryByKey("predicates",SPARQL_DICTIONARY)), 'PREDICATE_DROPDOWN');
    this.appendDummyInput().appendField('OBJECT').appendField(new Blockly.FieldDropdown(
      loadDictinaryByKey("sub_objects",SPARQL_DICTIONARY)), 'OBJECT_DROPDOWN');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(56);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};
Blockly.JavaScript["CONSTANT_RDF_FIELD"] = function (block) {
  var subject_value =block.getFieldValue("SUBJECT_DROPDOWN");
  var predicate_value = block.getFieldValue("PREDICATE_DROPDOWN");
  var object_value=block.getFieldValue("OBJECT_DROPDOWN");
  var code =`${subject_value} ${predicate_value} ${object_value}.\n`;
  return code;
};

/************************************************RDF_FIELD***********************************************************/
Blockly.Blocks['example_checkbox'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('check box label:')
        .appendField(new Blockly.FieldCheckbox(true), "checkboxName");
  }
};
Blockly.JavaScript["example_checkbox"]=function(block){
  var checkbox_value=block.getFieldValue("checkboxName")
  return `${checkbox_value}`
}

Blockly.Blocks['example_dropdown'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('drop down:')
        .appendField(new Blockly.FieldDropdown([
            ['first item', 'ITEM1'],
            ['second item', 'ITEM2']
        ]), 'dropdownName');
    this.setOutput(true, "String");
  }
};

Blockly.JavaScript['example_dropdown']=function(block){
   var dropdown_value=block.getFieldValue("dropdownName")
  return `${dropdown_value}`
}

Blockly.Blocks['example_number'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("number:")
        .appendField(new Blockly.FieldNumber(100, 0, 100, 10), 'numberName');
  }
};

Blockly.Blocks['example_textinput'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("text input:")
        .appendField(new Blockly.FieldTextInput('default text'),
            'textName');
  }
};

Blockly.Blocks["regexInput"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("regex with ignored case")
      .appendField("/")
      .appendField(new Blockly.FieldTextInput("stub"), "regex")
      .appendField("/i");
    this.setColour(105);
    this.setOutput(true, "String");
  }
};

Blockly.JavaScript["regexInput"] = function (block) {
  let value_regex = block.getFieldValue("regex");
  var code = `/${value_regex}/i`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks["simplebot"] = {
  init: function () {
    this.appendDummyInput().appendField("Simple bot");
    this.appendValueInput("botToken").setCheck(null).appendField("bot token");
    this.appendDummyInput().appendField("do");
    this.appendStatementInput("simpleActions").setCheck(null);
    this.setInputsInline(false);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript["simplebot"] = function (block) {
  var value_bottoken = Blockly.JavaScript.valueToCode(
    block,
    "botToken",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var statements_simpleactions = Blockly.JavaScript.statementToCode(
    block,
    "simpleActions"
  );

  var code = `import TelegramBot from "node-telegram-bot-api";\nconst token = ${value_bottoken}\nconst bot = new TelegramBot(token, { polling: true});\napp = async () => {\n${statements_simpleactions}\n};\napp().then(() => console.log("started"));`;
  return code;
};

Blockly.Blocks["responceontext"] = {
  init: function () {
    this.appendValueInput("onText")
      .setCheck(null)
      .appendField("on text or regex");
    this.appendValueInput("responceText")
      .setCheck(null)
      .appendField("respond the following text");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript["responceontext"] = function (block) {
  var value_ontext = Blockly.JavaScript.valueToCode(
    block,
    "onText",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var value_responcetext = Blockly.JavaScript.valueToCode(
    block,
    "responceText",
    Blockly.JavaScript.ORDER_ATOMIC
  );

  var code = `bot.onText(\n\t${value_ontext},\n\tasync (msg) => {\n\t\tconst chatId = msg.chat.id;\n\t\treturn await bot.sendMessage(chatId, ${value_responcetext});\n\t}\n);\n`;
  return code;
};
