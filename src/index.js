;(function (ns) {

  'use strict';
  var obj = {};

  ns.Form2JSON = function(elID){

    var defaults = { delimiter: "." };

    this.o = {},
    this.elID = elID,
    this.el, this.items = null;

    if (arguments[1] && typeof arguments[1] === "object") {
      this.options = extendDefaults(defaults, arguments[1]);
    } else {
      this.options = defaults;
    }

  }

  Form2JSON.prototype.load = function(){

    if(!this.el){
      try {
        this.el = document.getElementById(this.elID);
        this.items  = this.el.elements;
      } catch (e) {
        ns.error = ('ERROR: Provided form element ID is not valid or the form is empty. Details: ', e);
        return false;
      }
    } else {
      this.o = {};
    }

    for (var i=0; i<=this.items.length; i++){
      var propName, propValue, currEl = this.items[i];

      if (typeof currEl !== 'undefined' && currEl.type != 'fieldset' && currEl.type != 'button') {
        propName  = currEl.getAttribute('name');
        propValue = getElValue(currEl, this.o);

        if (propName.indexOf(this.options.delimiter) !== -1){
          delimitedToObject(obj, propName.split(this.options.delimiter), propValue);
          objectToOutput(obj, this.o);
        } else {
          this.o[propName] = propValue;
        }
      }
    }

    this.o = JSON.stringify(this.o, undefined, 2);

  }

  function delimitedToObject (obj, path, value){
    var p = path, l = p.length - 1;
    for (var i = 0; i < l; i++) {
      obj = obj[p[i]] = {};
    }
    obj[p[l]] = value;
  }

  function objectToOutput(o, output){
    for (var p in o){
      if(p in output){
        if(typeof o[p] == 'object'){
          objectToOutput(o[p], output[p]);
        } else {
          output[p] = o[p]
        }
      } else {
        output[p] = o[p];
      }
    }
  }

  function getElValue(currEl, outputObj){
    var v   = null,
        lv  = [];

    if (typeof currEl !== 'undefined') {
      switch(currEl.type){
        case 'text':
        case 'radio':
        case 'textarea':
        case 'select-one':
          v = currEl.value || '';
          break;
        case 'checkbox':
          if (hasSiblings(currEl.name)){
            v = (currEl.name in outputObj) ? outputObj[currEl.name] : lv;
          }

          if(currEl.value != ""){
            if(currEl.value == "on"){
              v = currEl.checked;
            } else {
              if (hasSiblings(currEl.name) && currEl.checked){
                v.push(currEl.value);
              } else {
                if(currEl.checked) v = currEl.value;
              }
            }
          } else {
            v = currEl.checked;
          }
          break;
        case 'select-multiple':
          for(var i=0; i<=currEl.options.length-1; i++){
            if (typeof currEl.options[i] != 'undefined' && currEl.options[i].selected){
              lv.push(currEl.options[i].value);
            }
          }
          v = lv;
          break;
        default:
          break;
      }
    }
    return v;
  }

  function hasSiblings(elName){
    if (document.getElementsByName(elName).length > 1) return true;
    return false;
  }

  function extendDefaults(obj, props) {
    var p;
    for (p in props) {
      if (props.hasOwnProperty(p)) {
        obj[p] = props[p];
      }
    }
    return obj;
  }

})(window, undefined);