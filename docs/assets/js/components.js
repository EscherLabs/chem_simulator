instrument_components = [
      {
        legend:'Upload',
        name:"Upload",
        "actions":[{type:"save",label:"View",target:".gform-footer"}],
        events:[
          {event:"save",handler:function(e){
            var files = e.form.find('upload').el.querySelector('input').files

            // use the 1st file from the list
            f = files[0];
        
            var reader = new FileReader();
        
            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                  globdata = JSON.parse(e.target.result);

                   if(hash(globdata.name) !== globdata.check){
                    console.error("imposter")
                  }else{
                    globdata.data = _.map(globdata.data,function(i){
                      i.data = JSON.parse(i.data);
                      return i;
                    })
// _.each()

document.querySelector('.main #errors').innerHTML = "";
_.each(gform.instances,function(form){
  if(form.options.name !== "Upload"){
  form.destroy();
  }
})
_.each(globdata.data,function(instrument_component){
  el = gform.create(compontent);
  document.querySelector('.main #errors').append(el)

  myForm = new gform(_.extend({
    "actions":[{type:"save",label:"Run",target:".gform-footer"}],
    "data":instrument_component.data,
    "default": {
      "horizontal": true,edit:false
    },"horizontal": true
  },_.find(instrument_components, {name:instrument_component.name||"GC"})),el.querySelector('.well'))

})


                    _.find(instrument_components,{legend:instruments[globdata.data[0].name].label}).chart(globdata.file,globdata.data[0].data.acquisition);
                  }
                };
              })(f);
        
              // Read in the image file as a data URL.
              reader.readAsText(f);

          }}
        ],
        fields:[
            {label:"Upload",type:"file"}
        ]
      }
  ]
   