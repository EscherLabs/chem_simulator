instrument_components.push(
    {
        legend:'Differential Scanning Calorimeter',
        name:"DSC",
        // sections:'tab',
        fields:[
          {label:"Sample ID",name:"sample_id",type:"select",options:"DSC"},
          {label:"Nitrogen Flow (mL/min)",name:"nitrogen_flow", value:20,edit:false},

          {label:"Sample Weight (mg)",name:"sample_weight",type:"number",value:3,min:2.5,max:6,step:.001},
            {legend: 'Temperature Program',name:"temperature_program",array:{min:1}, type: 'table',fields:[
              {label:"Time (min)",edit:false,name:"time",type:"number",template:"{{value}}{{^value}}(origin){{/value}}",value:function(e){
                  if(e.initial.parent.index == e.field.parent.index && e.field.name == "time"){
                      var old = e.field.parent.parent.find({name:"temperature_program",index:e.initial.parent.index-1});
                      if(old){
                          old = old.get();
                          return old.time+old.hold_time;
                      }
                      return 0;
                  }else{
                      return e.initial.value   
                  }
              }},
              {label:"Temperature (°C)",name:"temperature",type:"number",value:100,step:5,validate:[{type:'numeric'}]},
              {label:"Rate (°C/min)",name:"rate",type:"number",value:10,min:10,max:20,step:1},
              {label:"Hold time (min)",name:"hold_time",type:"number",value:0,min:0,max:5,step:1}
            ]},
            
          // ]}
        ],
        chart:function(file,index, settings){

          $.get('assets/data/dsc/'+file+index+'.csv',function(file,e){
            globaltemp = _.csvToArray('sec,J/s\n'+e,{skip:0});
            debugger;
            keys = ['sec','J/s']//_.keys(globaltemp[0]);
            // Time (sec),Heat Flow (J/s)
            var x = []

            var y = [_.find(gform.collections.get('DSC'),{search:file}).display]
            _.each(globaltemp,function(i){
              // if(parseInt(i[keys[0]]) >= gform.instances['F'].get('sample_holder')['Range start (cm-1)'] && parseInt(i[keys[0]]) <= gform.instances['FTIR'].get('sample_holder')['Range end (cm-1)']){
                x.push(i[keys[0]]);
                y.push(i[keys[1]]);
              // }
            })
            c3chart =  c3.generate({
              bindto: '.chart',
              data: {
                  x: 'x',
                  // xFormat: format,
                  columns: [['x'].concat(x),y], 
                  type: 'line'
              },
              point: {
                  show: true
              },
              // tooltip: {
              //   format: {
              //     title: function (x, index) {
              //       debugger;
              //        return x+'cm-1'; 
              //     }
              //   }
              // },
              axis: {
                  x: {
                      tick: {
                          // format(d) {
                          //   return this.data.xs[_.keys(this.data.xs)[0]][this.data.xs[_.keys(this.data.xs)[0]].length-(1+this.data.xs[_.keys(this.data.xs)[0]].indexOf(d))]
                          // },
                          values: function(start,end,interval){
                            var temp = [];
                            for(var i = start; i<=end; i+=interval){
                            temp.push(i)
                            }
                            return temp;
                          }(0,550,10)
                          
                      },
                      label: keys[0]
                  },
                  y: {
                      label: keys[1]
                  }
              }
            });
            $('.c3-lines').hide();
            if(typeof gform.instances.modal !== 'undefined')gform.instances.modal.trigger('close');
          }.bind(null,file))
        },
        events:[
          {
            "event":"save",
            "handler":function(e){

              $('.chart').html('')

              if(!e.form.validate())return false;
  
              //todo -- look at using gform validation for the following
              
                            // var errors = [];
                            // var data = e.form.get();
              var testForm = new gform({fields:_.find(instrument_components,{legend:instruments['DSC'].label}).validationFields,data:e.form.get()})

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
              // var temp = gform.instances.F.get()['emission-scan']['Excitation (nm)'];

              // globalfile = e.form.get('file');

 //               $('.chart').append('<div class="alert alert-danger">Invalid Sample - Check Emission-Scan Excitation</div>')
              var sample_id = e.form.get('sample_id').split('_')[0]
              var closestFind = _.findIndex(mass_map[sample_id], function(search,sample,index) {
                return (search == sample)
                
                }.bind(null,e.form.get('sample_weight')) 
              )
              if(closestFind>=0 && typeof closestFind !== 'undefined'){
                if(sample_id == 'Indium'){
                  // debugger;
                  if(e.form.get('sample_id') == "Indium_calibration"){
                    closestFind = _.random(0, 3);
                    globalIndium = closestFind;
                  }else{
                    closestFind = _.random(0, 3);
                    while(closestFind == globalIndium){
                      closestFind = _.random(0, 3);
                    }
                  }
                }
                _.find(instrument_components,{legend:instruments['DSC'].label}).chart(sample_id,(closestFind+1))
              }else{
               $('.chart').append('<div class="alert alert-danger">Invalid Sample - Check Sample Mass</div>')
              } 
              
            

          }
          }
          
        ],
        sections:'tab',

        validationFields:[

          // {label:"Nitrogen Flow (mL/min)",name:"nitrogen_flow", value:20,edit:false},
          {legend: 'Temperature Program',name:"temperature_program",array:{min:1}, type: 'table',fields:[],validate:[{type:"custom",test:function(a){
            if(a.form.options.data.temperature_program.length !==2)return "Invalid temperature Profile";
            switch(a.form.options.data.sample_id){
              case "dppc":
              case "dspc":
                if(a.form.options.data.temperature_program[0].temperature != 30 ||
                a.form.options.data.temperature_program[0].rate != 0 ||
                a.form.options.data.temperature_program[0].hold_time != 0 ||
                a.form.options.data.temperature_program[1].temperature != 60 ||
                a.form.options.data.temperature_program[1].rate != 5 ||
                a.form.options.data.temperature_program[1].hold_time != 0 
                )return "Invalid temperature Profile";
                break;
              default:
                if(a.form.options.data.temperature_program[0].temperature != 100 ||
                  a.form.options.data.temperature_program[0].rate != 0 ||
                  a.form.options.data.temperature_program[0].hold_time != 0 ||
                  a.form.options.data.temperature_program[1].temperature != 180 ||
                  a.form.options.data.temperature_program[1].rate != 20 ||
                  a.form.options.data.temperature_program[1].hold_time != 0 
                )return "Invalid temperature Profile";


            }
          }}]}

        ],
      }
    
    )

    mass_map = {
      Indium:[5.8998],
      DPPC:[3.040, 3.880, 3.960, 4.210, 3.700],
      DSPC:[2.920, 3.100, 3.980, 3.980, 3.800]
    }
    gform.collections.add('DSC',[{label:"Indium Calibration",value:"Indium_calibration",search:'Indium',display:"Indium"},
    {label:"DPPC",value:"DPPC",search:"DPPC",display:"DPPC"},
    {label:"DSPC",value:"DSPC",search:"DSPC",display:"DSPC"},
    {label:"Indium Post-check",value:"Indium_post_check"},
    ])