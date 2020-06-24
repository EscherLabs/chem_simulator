builder = function(formin){
  path = [];
  formname = formin;
  myform = JSON.parse((Lockr.get(formname) || "{}"))
  mainForm = function(){
    var form = myform;
    _.each(path,function(p){
      form = _.find(form.fields,{name:p})
    })
    if(!path.length){
      new gform({
        name:"editor",
        data: form,
        actions:[],
        fields: [
          {name:"legend",label:"Label"},
          {name:"name",label:"Name"},
          // {name:"default",label:false,type:'fieldset',fields:[
          //   {name:"horizontal",label:"Horizontal",type:"checkbox",options:[{label:""},{label:"Yes"}]}
          // ]},
          {name:"horizontal",label:"Horizontal",type:"checkbox",options:[{label:""},{label:"Yes"}],map:"default.horizontal"},

          {name:"horizontal",label:"Horizontal",value:true,type:"checkbox",show:false,parse:true},
          {type: 'switch',format:{label:""}, label: 'Custom Actions', name: 'actions', show:[{name:"type",value:['output'],type:"not_matches"}],parse:[{type:"not_matches",value:false}]},
          {type: 'fieldset',columns:12,array:true, label:false,name:"actions",show:[{name:"actions",value:true,type:"matches"}],fields:[
            
            {name:"type",columns:6,label:"Type",type:"smallcombo",options:["cancel","save"],parse:[{type:"requires"}]},
            // {name:"name",columns:6,label:"Name"},
            {name:"action",columns:6,label:"Action",parse:[{type:"requires"}]},
            {name:"label",columns:6,label:"Label",parse:[{type:"requires"}]},
            {name:"modifiers",columns:6,label:"Classes",type:"smallcombo",parse:[{type:"requires"}],options:[
              {label:"Danger",value:"btn btn-danger"},
              {label:"Success",value:"btn btn-success"},
              {label:"Info",value:"btn btn-info"}]}

          ],parse:[{name:"actions",value:true,type:"matches"},{type:"requires"}]},

        ],
        legend: 'Edit Form',
      }, '#mainform').on('input:type',function(e){
        if(e.field.value == 'cancel'){
          e.field.parent.set({
            "label":"<i class=\"fa fa-times\"></i> Cancel",
            "action":"cancel",
            "modifiers": "btn btn-danger"})
        }
      }).on('input', _.throttle(function(e){
        // form = _.extend(_.pick(form,fields),e.form.get());
        myform = _.extend(_.pick(form,"fields"),e.form.get());

        // if(typeof e.form.get().actions == 'undefined'){
        //   delete form.actions;
        // }
        Lockr.set(formname, JSON.stringify(myform, undefined, "\t"));
        // if(typeof e.field !== 'undefined' && e.field.name == 'horizontal'){
        //   renderBuilder()
        // }

      }) ).on('input:horizontal',function(){
        renderBuilder();
      })
    }else{
      var formConfig = new Cobler.types[gform.types[form.type].base]();
      $("#mainform").html(gform.renderString(accordion))    
      $('.panelOptions').toggle(!!_.find(formConfig.fields,{target:"#collapseOptions .panel-body"}));
      $('.panelValidation').toggle(!!_.find(formConfig.fields,{target:"#collapseValidation .panel-body"}));
      $('.panelBasic').toggle(!!_.find(formConfig.fields,{target:"#collapseBasic .panel-body"}));
      $('.panelConditions').toggle(!!_.find(formConfig.fields,{target:"#collapseConditions .panel-body"}));
      $('.panelDisplay').toggle(!!_.find(formConfig.fields,{target:"#collapseDisplay .panel-body"}));
      $('.panelEvents').toggle(!!_.find(formConfig.fields,{target:"#collapseEvents .panel-body"}));
      $('.panelGrid').toggle(!!_.find(formConfig.fields,{target:"#collapseGrid .panel-body"}));

      new gform({
        name:"editor",
        nomanage:true,
        default:{type:"text",columns:6},
        data: form,
        actions:[],
        clear:false,
        fields: formConfig.fields,
        legend: 'Edit Fieldset',
      }, '#mainform').on('change', function(e){
        // form = _.extend(form,e.form.get())
        // Lockr.set('form', JSON.stringify(myform, undefined, "\t"));
        var workingForm = myform;
          _.each(path,function(p){
            workingForm = _.find(workingForm.fields,{name:p})
          })
          
        // workingForm = 
        _.extend(workingForm,e.form.get())
        
        Lockr.set(formname, JSON.stringify(myform, undefined, "\t"));

      })
      

    }
  }
  renderBuilder = function(){
    var form = myform;
    var map = "";

    _.each(path,function(p){
      form = _.find(form.fields,{name:p})
      map += form.name+',';
    })
    mapper =  new gform(_.extend(myform,{actions:[]}));
    $('.target').html(gform.renderString(
        `<ul id="myUL" class="nav nav-sidebar">
        {{#fields}}

          {{#isFieldset}}
          <li><a class="mcaret {{#active}}mcaret-down{{/active}}" data-map="{{id}}">{{{label}}}{{^label}}{{name}}{{/label}}</a>
          {{>mainTemplate}}
          </li>
          {{/isFieldset}}
          {{/fields}}
        </ul>`,{fields: mapper.fields,mainTemplate:`<ul class="nav nested  {{#active}}active{{/active}}">
        {{#fields}}

          {{#isFieldset}}
          <li><a class="mcaret {{#active}}mcaret-down{{/active}}" data-map="{{id}}">{{{label}}}{{^label}}{{name}}{{/label}}</a>
            {{>mainTemplate}}
          </li>
          {{/isFieldset}}
          {{/fields}}
        </ul>`, isFieldset: function(item,render){
          // debugger;
          this.active = path.lastIndexOf(this.name) !== -1
          if(gform.types[this.type||'text'].base == 'section' ){
            return render(item);
          }else{
            return gform.m('<li class=""><a href="#" data-map="{{id}}">{{{label}}}{{^label}}{{name}}{{/label}} <span class="sr-only">{{name}}</span></a></li>', this)
          }
        }})
    )
    //  debugger;
    //  var toggler = document.getElementsByClassName("mcaret");
    //  var i;
  
    //  for (i = 0; i < toggler.length; i++) {
    //    toggler[i].addEventListener("click", function() {
    //      this.parentElement.querySelector(".nested").classList.toggle("active");
    //      this.classList.toggle("mcaret-down");
    //    });
    //  }
    
    if(typeof cb === 'undefined'){

      cb = new Cobler({formTarget:$('#form') ,disabled: false, targets: [document.getElementById('editor')],items:[[]]})
      list = document.getElementById('sortableList');
      cb.addSource(list);
      cb.on('activate', function(e){
        if(list.className.indexOf('hidden') == -1){
          list.className += ' hidden';
        }
        $('#form').removeClass('hidden');
      })
      cb.on('deactivate', function(){
        if(typeof gform.instances.editor !== 'undefined'){
            gform.instances.editor.destroy();
        }
        list.className = list.className.replace('hidden', '');
        $('#form').addClass('hidden');
        mainForm();
      })
      document.getElementById('sortableList').addEventListener('click', function(e) {
        cb.deactivate();
        cb.collections[0].addItem(e.target.dataset.type);
      })
      cb.on("change", function(){
        var workingForm = myform;
        _.each(path,function(p){
          workingForm = _.find(workingForm.fields,{name:p})
        })
        workingForm.fields = cb.toJSON()[0];
        
        Lockr.set(formname, JSON.stringify(myform, undefined, "\t"));
      })
      cb.on('remove', function(e){
        if(typeof gform.instances.editor !== 'undefined' && gform.instances.editor.options.cobler == e[0]){
          cb.deactivate();
        }
      });
    }

    if(typeof form !== 'undefined'){
      var temp = $.extend(true, {}, form);
      for(var i in temp.fields){
        // var mapOptions = new gform.mapOptions(temp.fields[i],undefined,0,gform.collections)
        // temp.fields[i].options = mapOptions.getobject()
        switch(temp.fields[i].type) {
          case "select":
          case "radio":
          case "scale":
          case "range":
          // case "grid":
          case "user":
          case "groups":
          case "smallcombo":
            temp.fields[i].widgetType = 'collection';
            break;
          case "checkbox":
          case "switch":
            temp.fields[i].widgetType = 'bool';
            break;
          case "fieldset":
          case "table":
          case "template":
          case "grid":
            temp.fields[i].widgetType = 'section';
            break;
          default:
            temp.fields[i].widgetType = 'input';
        }
      }
      
      list.className = list.className.replace('hidden', '');
      cb.collections[0].load(temp.fields);
    }
    // mainForm(form,map);

    if(typeof gform.instances.editor !== 'undefined'){
      gform.instances.editor.destroy();
    }
    mainForm();

  } 
 





  $('.target').on('click','[data-map]', function(e) {
  // path = _.compact(e.currentTarget.dataset.map.split(','));
  // var temp = e.currentTarget.parentElement.parentElement.parentElement.querySelector(".nested");

  // path = [];
  // if(temp !== null){
    // gform.toggleClass(temp,"active")
    // temp.classList.toggle("active");
    // e.currentTarget.classList.toggle("mcaret-down");
    // gform.toggleClass(e.currentTarget,"mcaret-down")
    // var element = mapper.find({id:e.currentTarget.dataset.map});
    var field = mapper.find({id:e.currentTarget.dataset.map})
    if(gform.types[field.type].base !== 'section'){
      clickableIndex = field.parent.fields.indexOf(field)

      field = field.parent;
    }else{
      clickableIndex =null;
    }
    path = (field.path||'').split('/').join('').split('.')||[];

  // }
  if(typeof clickableIndex == 'undefined' || clickableIndex == null ){

  cb.deactivate();
  renderBuilder()
  }else{
    debugger;
    cb.deactivate();
    cb.collections[0].activate($('.slice')[clickableIndex])
    // cb.collections[0].getItems()[clickableIndex].edit()
  }
  });
  renderBuilder();
  return {
    save:function(value){
      Lockr.set(formname, value||Lockr.get(formname));

    },
    get:function(){
      return Lockr.get(formname)
    }
  }
}
document.addEventListener('DOMContentLoaded', function(){
  // myform = JSON.parse((Lockr.get('form') || "{}"));
  // path = [];
  // renderBuilder();
  // hashparams.form
  // hashParams = QueryStringToHash(document.location.hash.substr(1) || '')
debugger;
gform.getUID = generateUUID;
  myBuilder = new builder(hashParams.form||'form')
});


