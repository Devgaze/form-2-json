;(function (window) {

  'use strict';

  function Form2JSON(elName){

    this.formEl     = document.getElementById(elName),
    this.eList      = this.formEl.elements,
    this.output     = {};

    this._traverseForm();
    this.output = JSON.stringify(this.output);
    console.log(this.output);
  }

  Form2JSON.prototype._traverseForm = function (){
    for (var i=0; i<=this.eList.length; i++){

      var currentElement = this.eList[i];

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
            this.output[propertyName] = currentElement.value;
            break;
          case 'checkbox':
            if (!this.output[propertyName]){
              this.output[propertyName] = (checkboxInstanceNr > 0) ? [] : null;
            }

            if(checkboxInstanceNr > 0){
              this.output[propertyName].push(checkboxValue);
            } else {
              this.output[propertyName] = checkboxValue;
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
            this.output[currentElement.getAttribute('name')] = multiSelectValue;
            break;
          default:
            break;
        }
      }
    }
  }

  Form2JSON.prototype._getElementValue = function (el){

    return;
  }

  window.Form2JSON = Form2JSON;

})(window);