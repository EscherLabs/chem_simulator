instrument_components.push(
    {
        legend:'UV-Vis Spectrophotometer',
        image:"UVVis1.png",
        chart:function(file, settings){
          $.get('assets/data/uvvis/'+file+'.CSV',function(e){
            globaltemp = _.csvToArray(e,{skip:0});
            keys = _.keys(globaltemp[0]);
            var x = ['x']
            var y = []
            _.each(globaltemp,function(i){
              if(parseInt(i[keys[0]]) >= settings['detection']['from'] && parseInt(i[keys[0]]) <= settings['detection']['to']){
                x.push(i[keys[0]]);
                y.push(i[keys[1]]);
              }
            })
            var maxKey = _.maxBy(_.keys(y), function (o) {
              return parseFloat(y[o])||0; 
            });
            maxKey++;
            c3chart =  c3.generate({
              bindto: '.chart',
              data: {
                  x: 'x',
                  // xFormat: format,
                  columns: [x,[_.find(gform.collections.get('uvvis'),{value:file}).label].concat(y)], 
                  type: 'line'
              },
              point: {
                  show: false
              },
              grid:{
                x:{
                  lines: [
                    {value: x[maxKey], text: x[maxKey]+"nm ( "+y[maxKey]+")", position: 'start'},
                ],
                }
              },
              tooltip: {
                format: {
                  title: function (x, index) { return x+'nm'; }
                }
              },
              axis: {
                  x: {
                      // type: 'timeseries',
                      tick: {
                          // format: format
  
                          // culling: {
                          //   max: 19
                          // }
                          values: function(start,end,interval){
                            // [400,600,800,1000,1200,1400,1600,1800,2000,2200,2400,2600,2800,3000,3200,3400,3600,3800,4000]
                            var temp = [];
                            for(var i = start; i<=end; i+=interval){
                            temp.push(i)
                            }
                            return temp;
                          }(100,1200,10)
                          
                      },
                      label: keys[0]
  
                  },
                  y: {
                      label: keys[1]
                  }
              }
            });
            if(typeof gform.instances.modal !== 'undefined')gform.instances.modal.trigger('close');
          })
        },
        events:[{
          "event": "save",
          "handler": function(e){
            $('.chart').html('')

            if(!e.form.validate())return false;

            //todo -- look at using gform validation for the following
            
                          // var errors = [];
                          // var data = e.form.get();
            debugger;
                          var testForm = new gform({fields:_.find(instrument_components,{legend:instruments['UV-Vis'].label}).validationFields,data:e.form.get()})
            
                          if(!testForm.validate(true)){
                            var errors = _.uniq(_.values(testForm.errors));
                            debugger;
                            if(errors.length>1){
                              $('.chart').append('<div class="alert alert-danger">Method Incorrect Please check your values</div>')
                            }else{
                              $('.chart').append('<div class="alert alert-danger">'+errors[0]+'</div>')
                            }
                            testForm.destroy();
                            return false;
                          }
                          testForm.destroy();
            

            new gform({
              legend:"Sample Name",
              name:"modal",
              fields:[
                {type:"smallcombo",name:"file",label:false,options:'uvvis',value:"BLANK2"}
              ]
            }).on('save',function(form,e){


              var a = '<center><div style="width:510px;height: 310px;background-position:0px -8px;background-image:url(assets/img/uv_vis_2.png)"></div></center>';
              var b = '<center><div style="width:510px;height: 310px;background-position: -1px -8px;background-image:url(assets/img/uv_vis_1.png)"></div></center>';
    
              new gform({legend:"Scanning...",name:"animate",fields:[{type:"output",value:'<div style="height:0">'+a+'</div>'+b}],actions:[]}).modal()
              var field = gform.instances.animate.fields[0];
              var fA = function(){field.set(a)};
              var fB = function(){field.set(b)};
    
              var actions = [
                fA,fB,fA,fB,//fA,fB,//,
                // function(){field.set('<center><i class=\"fa fa-spinner fa-spin\" style=\"font-size:60px;margin:20px auto;color:#d8d8d8\"></i></center>')},,
                function(){gform.instances.animate.trigger('close');},
                function(){

                  globalfile = e.form.get('file');
                  _.find(instrument_components,{legend:instruments['UV-Vis'].label}).chart(e.form.get('file'),gform.instances['UV-Vis'].get())
                }
              ];
    
              myint = launchInterval(actions,1000);
              e.form.trigger('close')

              gform.collections.update('uvvis',[
                {"label":"Blank",value:"BLANK2"},
                {"label":"1.00 PPM",value:"1PPM1"},
                {"label":"4.00 PPM",value:"4PPM1"},
                {"label":"10.0 PPM",value:"10PPM1"},
                {"label":"25.0 PPM",value:"25PPM1"},
                {"label":"Unknown Solution",value:"UNKNOWN1"}
              ])
            }.bind(null,e.form)).on('cancel',function(e){e.form.trigger('close');}).modal()
          }
        }],
        name:"UV-Vis",
        sections:'tab',
        validationFields:[

          {legend: 'Acquisition', type: 'fieldset',fields:[
            {label:"Wavelength range from (nm)",name:"from",type:"number",value:190,min:190,step:1,max:890},
            {label:"Wavelength range to (nm)",name:"to",type:"number",value:300,min:300,step:1,max:1100},
            {label:"Integration time (s)",type:"number",value:0.25,min:0.25,step:0.25,max:2,validate:[{type:"matches",value:0.5,message:"Check Integration time "}]},
            {label:"Interval (nm)",type:"number",value:1,min:1,step:1,max:4,validate:[{type:"matches",value:1, message:"Check Interval"}]},
          ]},
          {legend: 'Lamps',name:'lamps', type: 'fieldset',fields:[
            {label:"Tungsten",type:"switch",options:["Off","On"],validate:[{type:"matches", value:"On", message:"Check Lamp Settings","conditions": [
              {
                    "type": "test",
                    "test": function(e){
                      return ((e.owner.find({map:'acquisition.to'}).value >400) || (e.owner.find({map:'lamps.deuterium'}).value == "Off" && e.owner.find({map:'acquisition.from'}).value < 400 ));
                    }
              }
            ]}
          ]},
            {label:"Deuterium",type:"switch",options:["Off","On"],validate:[{type:"matches", value:"On", message:"Check Lamp Settings","conditions": [
              {
                    "type": "test",
                    "test": function(e){
                      return ((e.owner.find({map:'acquisition.from'}).value <300) || (e.owner.find({map:'lamps.tungsten'}).value == "Off" && e.owner.find({map:'acquisition.to'}).value > 300 ));

                    }
                    
                
              }
            ]}
          ]}
          ]},
        ],
        fields:[
          {legend: 'Acquisition', type: 'fieldset',fields:[
            {label:"Wavelength range from (nm)",name:"from",type:"number",value:190,min:190,step:1,max:890,validate:[{type:"numeric"}]},
            {label:"Wavelength range to (nm)",name:"to",type:"number",value:300,min:300,step:1,max:1100,validate:[{type:"numeric"}]},
            {label:"Integration time (s)",type:"number",value:0.25,min:0.25,step:0.25,max:2},
            {label:"Interval (nm)",type:"number",value:1,min:1,step:1,max:4},
            {label:"Path Length (cm)",type:"number",value:0.5,min:0.5,step:1,max:1}
          ]},
          {legend: 'Lamps',name:'lamps', type: 'fieldset',fields:[
            {label:"Tungsten",type:"switch",options:["Off","On"]},
            {label:"Deuterium",type:"switch",options:["Off","On"]}
          ]},
          {legend: 'Spectrum/Peak detection',name:"detection", type: 'fieldset',fields:[
            {label:"Find and annotate up to ___ peaks",type:"number",value:1,min:1,step:1,max:4},
            {label:"Data Type",type:"custom_radio",value:"Absorbance",options:["Absorbance","Transmittance"]},
            {label:"Display spectrum from (nm)",name:"from",type:"number",value:290,min:290,step:1,max:890},
            {label:"Display spectrum to (nm)",name:"to",type:"number",value:300,min:300,step:1,max:900}
          ]}
        ]
      }
    
    )
    gform.collections.add('uvvis',[
      {"label":"Blank",value:"BLANK2"}
    ])


    //ftir and uvvis need to run blank first