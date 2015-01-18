// jasmine.getFixtures().fixturesPath = 'fixtures/';

describe("Testing Form-2-JSON", function(){

  var module, module_missing_selector, module_invalid_selector;

  beforeEach(function(){
    module = new Form2JSON("myForm");
    module_missing_selector = new Form2JSON("fakeElementId");
    // module_invalid_selector = new Form2JSON("title");

    // loadFixtures("index.html");
    module.load();
  });

  it("for has it been loaded", function(){
    expect(module instanceof Form2JSON).toBeTruthy();
  });


  describe("then expect DOM structural integrity to pass if", function(){

    it('provided selector exist', function(){
      expect(module.el).toBeDefined();
    });

    it('loaded element is HTML tag FORM', function(){
      expect(module.el.nodeName).toBe("FORM");
    });

    it('the loaded form contains at least one other form element', function(){
      expect(module.items.length).toBeGreaterThan(0);
      var formElement = false,
          formElements= ['text', 'textarea', 'select-one', 'select-multiple', 'checkbox', 'radio', 'hidden', 'button', 'submit', 'reset', 'file', 'image', 'password'];

      for (var i=0; i<=module.items.length; i++){
        if (formElements.indexOf(module.items[i].type)>-1){
          formElement = true;
          break;
        }
      }
      expect(formElement).toBeTruthy();
    });

    it('non-existing selector is provided but it silently fails and notifies in console', function(){
      expect(module_missing_selector.load()).toBeFalsy();
    });


    // it('to fail if loaded element is not the FORM element', function(){
    //   console.log(module_invalid_selector)
    //   expect(module_invalid_selector.el.nodeName).not.toBe("FORM");
    // });


  });

});
