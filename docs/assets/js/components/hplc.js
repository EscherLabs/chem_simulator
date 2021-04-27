device_components.push(
    {
    legend:'High Performance Liquid Chromatograph',
    name:"HPLC",
    sections:'tab',
    methods:{
      onAdd:function(e){
        if(e.field.index >0){
          var temp = e.form.find({map:'solvent_pump.gradient.'+(e.field.index-1)});
          e.field.fields[0].update({min:(temp.get('time')+1),value:(temp.get('time')+1)})
          e.field.fields[1].update({value:(100 - (temp.get('solvent_b')+1))})
          e.field.fields[2].update({min:(temp.get('solvent_b')+1),value:(temp.get('solvent_b')+1)})
        }

      }
    },
    "events": [
      {
        "event": "modal",
        "handler": "onAdd"
      }
    ],
    fields:[
      {legend: 'Solvent Pump', type: 'fieldset',fields:[
        {legend: 'Solvent', type: 'fieldset',fields:[
          {name:"A",type:"custom_radio",value:"Water",options:["Water","0.1% formic acid"]},
          {name:"B",type:"custom_radio",value:"Methanol",options:["Methanol","Acetonitrile"]}
        ]},   
        {legend: 'Isocratic', type: 'fieldset',fields:[
          {name:"Solvent A Fraction (%)",type:"number",value:0,min:0,max:100,step:1},
          {name:"Solvent B Fraction (%)",type:"number",value:0,min:0,max:100,step:1},

          
        ]},  
        {legend: 'Gradient',array:{min:0,max:20}, type: 'table',fields:[
          {label:"Time (min)",name:'time',type:"number",value:0,min:0,max:12,validate:[{type:'numeric'}]},
          {label:"Solvent A (%)",name:"a",type:"number",min:0,max:100,step:1,edit:false,value:function(e){
              if(e.initial.parent.index == e.field.parent.index && e.field.name == "solvent_b"){
                  return 100 - parseInt(e.field.get());
              }else{
                  return e.initial.value || 0  
              }
          }},
          {label:"Solvent B (%)",name:"solvent_b",type:"number",value:0,min:0,max:100,step:1},
        ]},
        
      ]},
      {legend: 'Injector', type: 'fieldset',fields:[
        {name:"Volume (uL)",type:"number",value:10,min:10,step:10,max:50}
      ]},
      {legend: 'Detector', type: 'fieldset',fields:[
        {name:"Wavelength 1 (nm)",type:"number",value:290,min:290,step:1,max:400},
        {name:"Wavelength 2 (nm)",type:"number",value:290,min:290,step:1,max:400},
        {name:"Wavelength 3 (nm)",type:"number",value:290,min:290,step:1,max:400},
        {name:"Wavelength 4 (nm)",type:"number",value:290,min:290,step:1,max:400},
        {name:"Reference (nm)",type:"number",value:580,min:580,step:1,max:600},
        {name:"Acquisition Time (min)",type:"number",value:0,min:0,step:.1,max:10}
      ]}
    ]
  }
  )