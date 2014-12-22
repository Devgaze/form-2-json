;(function (window) {

  'use strict';

  var formEl,
      eList,
      output = {};

  function extend(x, y) {
    for(var k in y) {
      if(y.hasOwnProperty(k)) {
        x[k] = y[k];
      }
    }
    return x;
  }

  Form2JSON.prototype.options = {
      aggregator: ':'
    // , corelator:  '|'
    // , numerator:  '#'
  }
  function Form2JSON(elName, options){

    formEl  = document.getElementById(elName),
    eList   = formEl.elements,
    output  = {},
    extend(this.options, options);

    _traverseForm();
    console.log(JSON.stringify(output));
  }


  function _traverseForm (){
    for (var i=0; i<=eList.length; i++){

      var currentElement = eList[i];

      if (typeof currentElement !== 'undefined') {

        // handle different value attributes
        var multiSelectValue    = [],
            checkboxValue       = (currentElement.checked) ? currentElement.value : null,
            propertyName        = currentElement.getAttribute('name'),
            checkboxInstanceNr  = document.getElementsByName(propertyName).length;

        switch(currentElement.type){
          case 'text':
          case 'radio':
          case 'textarea':
          case 'select-one':
            output[propertyName] = currentElement.value;
            break;
          case 'checkbox':
            if (!output[propertyName]){
              output[propertyName] = (checkboxInstanceNr > 0) ? [] : null;
            }

            if(checkboxInstanceNr > 0){
              output[propertyName].push(checkboxValue);
            } else {
              output[propertyName] = checkboxValue;
            }
            break;
          case 'select-multiple':
            for(var j=0; j<=currentElement.options.length-1; j++){
              if (typeof currentElement.options[j] != 'undefined' && currentElement.options[j].selected){
                multiSelectValue.push(currentElement.options[j].value);
              } else {
                multiSelectValue.push(null);
              }
            }
            output[currentElement.getAttribute('name')] = multiSelectValue;
            break;
          default:
            break;
        }
      }
    }
  }

  window.Form2JSON = Form2JSON;

})(window);