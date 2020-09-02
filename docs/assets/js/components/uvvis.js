instrument_components.push(
    {
        legend:'UV-Vis Spectrophotometer',
        chart:function(file, settings){
  
          $.get('assets/data/uvvis/'+file+'.csv',function(e){
            globaltemp = _.csvToArray(e,{skip:0});
            // globaltemp.pop();
            keys = _.keys(globaltemp[0]);
            var x = ['x']
            var y = ['Sample']
            _.each(globaltemp,function(i){
              if(parseInt(i[keys[0]]) > settings['Wavelength range from (nm)'] && parseInt(i[keys[0]]) < settings['Wavelength range to (nm)']){
                x.push(i[keys[0]]);
                y.push(i[keys[1]]);
              }
            })
            var maxKey = _.maxBy(_.keys(y), function (o) { return parseFloat(y[o])||0; });
  
            
            c3chart =  c3.generate({
              bindto: '#chart',
              data: {
                  x: 'x',
                  // xFormat: format,
                  columns: [x,y], 
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
                          }(100,1200,100)
                          
                      },
                      label: keys[0]
  
                  },
                  y: {
                      label: keys[1]
                  }
              }
            });
            gform.instances.modal.trigger('close');
          })
        },
        events:[{
          "event": "save",
          "handler": function(e){
            var a = '<center><div style="width:510px;height: 310px;background-position:0px -8px;background-image:url(assets/img/uv_vis_2.png)"></div></center>';
            var b = '<center><div style="width:510px;height: 310px;background-position: -1px -8px;background-image:url(assets/img/uv_vis_1.png)"></div></center>';
  
            new gform({name:"animate",fields:[{type:"output",value:'<div style="height:0">'+a+'</div>'+b}],actions:[]}).modal()
            var field = gform.instances.animate.fields[0];
            var fA = function(){field.set(a)};
            var fB = function(){field.set(b)};
  
            var actions = [
              fA,fB,fA,fB,fA,fB,//,
              // function(){field.set('<center><i class=\"fa fa-spinner fa-spin\" style=\"font-size:60px;margin:20px auto;color:#d8d8d8\"></i></center>')},,
              function(){gform.instances.animate.trigger('close');},
              function(){
  
                var files = [
                  {"label":"Blank",value:"BLANK2"},
                  {"label":"1.00 PPM",value:"1PPM1"},
                  {"label":"4.00 PPM",value:"4PPM1"},
                  {"label":"10.0 PPM",value:"10PPM1"},
                  {"label":"25.0 PPM",value:"25PPM1"},
                  {"label":"Unknown Solution",value:"UNKNOWN1"}
                ];
                new gform({
                  legend:"Sample Name",
                  name:"modal",
                  fields:[
                    {type:"smallcombo",name:"file",label:false,options:files,value:"BLANK2"}
                  ]
                }).on('save',function(form,e){
                  
                  _.find(instrument_components,{legend:instruments['UV-Vis'].label}).chart(e.form.get('file'),gform.instances['UV-Vis'].get('acquisition'))
                }.bind(null,e.form)).modal()
                
              }
            ];
  
            myint = launchInterval(actions,1000);
          }
        }],
        name:"UV-Vis",
        sections:'tab',
        fields:[
          {legend: 'Acquisition', type: 'fieldset',fields:[
            {name:"Wavelength range from (nm)",type:"number",value:290,min:290,step:1,max:890},
            {name:"Wavelength range to (nm)",type:"number",value:300,min:300,step:1,max:900},
            {name:"Integration time (s)",type:"number",value:0.25,min:0.25,step:0.25,max:2},
            {name:"Interval (nm)",type:"number",value:1,min:1,step:1,max:4},
            {name:"Path Length (cm)",type:"number",value:0.5,min:0.5,step:1,max:1}
          ]},
          {legend: 'Lamps', type: 'fieldset',fields:[
            {name:"Tungsten",type:"switch",options:["Off","On"]},
            {name:"Deuterium",type:"switch",options:["Off","On"]}
          ]},
          {legend: 'Spectrum/Peak detection', type: 'fieldset',fields:[
            {name:"Find and annotate up to ___ peaks",type:"number",value:1,min:1,step:1,max:4},
            {name:"Data Type",type:"custom_radio",value:"Absorbance",options:["Absorbance","Transmittance"]},
            {name:"Display spectrum from (nm)",type:"number",value:290,min:290,step:1,max:890},
            {name:"Display spectrum to (nm)",type:"number",value:300,min:300,step:1,max:900}
          ]}
        ]
      }
    
    )