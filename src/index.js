;(function (ns) {

  'use strict';

  var obj     = {};
  ns.settings = {
                  delimiter: "."
                };

  ns.load = function (el){
    ns.o = {};

    if(!ns.el){
      ns.el = document.getElementById(el);
      ns.items  = ns.el.elements;
    }

    mapForm();
    ns.o = JSON.stringify(ns.o, undefined, 2);
  }

  function mapForm(){
    for (var i=0; i<=ns.items.length; i++){
      var currEl = ns.items[i];

      if (typeof currEl !== 'undefined' && currEl.type != 'fieldset' && currEl.type != 'button') {
        var propName  = currEl.getAttribute('name'),
            propValue = getElValue(currEl);

        if (propName.indexOf(ns.settings.delimiter) !== -1){
          delimitedToObject(obj, propName.split(ns.settings.delimiter), propValue);
          objectToOutput(obj, ns.o);
        } else {
          ns.o[propName] = propValue;
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
            v = (currEl.name in ns.o) ? ns.o[currEl.name] : lv;
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


})( window.Form2JSON = window.Form2JSON || {} );