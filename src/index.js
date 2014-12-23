;(function (ns) {
  'use strict';

  ns.el       = null,
  ns.o        = {},
  ns.settings = {
    delimiter: "."
  };

  ns.load = function (el){
    if(ns.el){
      ns.o = {}; // Firefox needs this
    } else {
      ns.el = document.getElementById(el);
    }
    ns.items  = ns.el.elements;
    parseForm();
    console.log(JSON.stringify(ns.o))
  }

  // privates
  function extend(x, y) {
    for(var k in y) {
      if(y.hasOwnProperty(k)) {
        x[k] = y[k];
      }
    }
    return x;
  }

  function parseForm(){
    for (var i=0; i<=ns.items.length; i++){

      var currEl = ns.items[i];

      if (typeof currEl !== 'undefined') {

        // handle different value attributes
        var listValues    = [],
            propName      = currEl.getAttribute('name'),
            checkSiblings = document.getElementsByName(propName).length;

        switch(currEl.type){
          case 'text':
          case 'radio':
          case 'textarea':
          case 'select-one':
            ns.o[propName] = currEl.value;
            break;
          case 'checkbox':
            if (!ns.o[propName]){
              ns.o[propName] = (checkSiblings > 1) ? [] : currEl.checked;
            }
            console.log (checkSiblings)
            if(checkSiblings > 1){
              if (currEl.checked){
                // if (currEl.value != "" && currEl.value != "on")
                ns.o[propName].push(currEl.value);
              }
            }
            break;
          case 'select-multiple':
            for(var j=0; j<=currEl.options.length-1; j++){
              if (typeof currEl.options[j] != 'undefined' && currEl.options[j].selected){
                listValues.push(currEl.options[j].value);
              }
            }
            ns.o[currEl.getAttribute('name')] = listValues;
            break;
          default:
            break;
        }
      }
    }
  }

})( window.Form2JSON = window.Form2JSON || {} );