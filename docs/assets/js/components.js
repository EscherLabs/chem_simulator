instrument_components = [
      {
        legend:'Upload',
        name:"Upload",
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
                    debugger;

                    _.find(instrument_components,{legend:instruments[globdata.data[0].name].label}).chart("UNKNOWN1",globdata.data[0].data.acquisition);
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
   