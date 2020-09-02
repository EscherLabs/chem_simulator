instrument_components.push(
    {
        legend:'Gas Chromatograph',
        sections:'tab',
        name:'GC',
        methods:{
          onAdd:function(e){
            if(e.field.index > 0){
              var temp = e.form.find({map:'column_oven.temperature_program.'+(e.field.index-1)})
              ;
              e.field.find('temperature').update({min:temp.get('temperature'),value:temp.get('temperature'),max:250})
              // e.field.fields[1].update({value:(100 - (temp.get('solvent_b')+1))})
              // e.field.fields[2].update({min:(temp.get('solvent_b')+1),value:(temp.get('solvent_b')+1)})
            }else{
              e.field.find('temperature').update({min:100,max:150})
  
            }
  
          },    
          done:function(e){
            var temp =  e.form.filter({name:'temperature_program'})
            _.reduce(e.form.filter({name:'temperature_program'}),function(time,item){
              item.update({time:time})
              time += parseInt(item.get('hold_time'))
              return time;
            },0)
  
          }
        },
        "events": [
          {
            "event": "modal",
            "handler": "onAdd"
          },
          {
            "event": "done",
            "handler": "done"
          }
        ],
        fields:[
          {legend: 'Detector', type: 'fieldset',fields:[
            {name:"Temperature (°C)",type:"number",value:100,min:100,max:200,step:5,validate:[{type:'numeric'}]},
            {name:"Current/Sensitivity",type:"custom_radio",value:"Low",options:["Low","Medium","High"]},
            {name:"TCD Range",type:"custom_radio",value:"x1",options:["x1","x10"]},
          ]},
          {legend: 'Injector', type: 'fieldset',fields:[
            {name:"Temperature (°C)",type:"number",value:100,min:100,max:200,step:5},
          ]},
          {legend: 'Column Oven', type: 'fieldset',fields:[
            {legend: 'Isothermal', type: 'fieldset',fields:[
              {name:"Temperature (°C)",type:"number",value:100,min:100,max:200,step:5},
              {name:"Run time (min)",type:"number",value:0,min:0,max:10,step:.5},
            ]},
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
              {label:"Ramp (°C/min)",name:"ramp",type:"number",value:10,min:10,max:20,step:1},
              {label:"Hold time (min)",name:"hold_time",type:"number",value:0,min:0,max:5,step:1}
            ]},
            
          ]}
        ]}
    
    )