;(function (ns) {

  'use strict';
  var obj = {};

  ns.Form2JSON = function(elID){

    var defaults = { delimiter: "." };
    this.o = {};
    this.elID, this.el, this.items = null;

    if (arguments[1] && typeof arguments[1] === "object") {
      this.options = extendDefaults(defaults, arguments[0]);
    }

  }

  Form2JSON.prototype.load = function(){

    if(!this.elID){
      try {
        this.el = document.getElementById(el);
        this.items  = this.el.elements;
      } catch (e) {
        ns.error = ('ERROR: Provided form element ID is not valid or the form is empty. Details: ', e);
        return false;
      }
    }
    mapForm();
    this.o = JSON.stringify(this.o, undefined, 2);

  }


  // ns.load = function (el){
  //   ns.o = {};

  //   if(!ns.el){
  //     try {
  //       ns.el = document.getElementById(el);
  //       ns.items  = ns.el.elements;
  //     } catch (e) {
  //       ns.error = ('ERROR: Provided form element ID is not valid or the form is empty. Details: ', e);
  //       return false;
  //     }

  //   }

  //   mapForm();
  //   ns.o = JSON.stringify(ns.o, undefined, 2);
  // }

  function mapForm(){
    for (var i=0; i<=this.items.length; i++){
      var propName, propValue, currEl = this.items[i];

      if (typeof currEl !== 'undefined' && currEl.type != 'fieldset' && currEl.type != 'button') {
        propName  = currEl.getAttribute('name');
        propValue = getElValue(currEl);

        if (propName.indexOf(this.settings.delimiter) !== -1){
          delimitedToObject(obj, propName.split(this.settings.delimiter), propValue);
          objectToOutput(obj, this.o);
        } else {
          this.o[propName] = propValue;
        }
      }
    }
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

  function getElValue(currEl){
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
            v = (currEl.name in this.o) ? ns.o[currEl.name] : lv;
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