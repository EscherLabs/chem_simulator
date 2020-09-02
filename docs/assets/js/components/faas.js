instrument_components.push(
    {
        legend:'Flame Atomic Absorption Spectrophotometer',
        name:"FAAS",
        sections:'tab',
        fields:[
          {legend: 'Lamp', type: 'fieldset',fields:[
            {name:"Element",type:"text"},
            {name:"Wavelength (nm)",type:"number"},
            {name:"Max. Current (mA)",type:"number",value:10,min:10,step:1,max:30},
            {name:"Slit (nm)",type:"number",value:.1,min:.1,step:.1,max:2}
            
          ]},
          {legend: 'Flame', type: 'fieldset',fields:[
            {name:"Fuel Gas 1",type:"custom_radio",value:"Air",options:["Air","Nitrous Oxide","Acetylene"]},
            {name:"Fuel Gas 2",help:"(Note: must differ from Gas 1)",type:"custom_radio",value:"Air",options:["Air","Nitrous Oxide","Acetylene"]},

            {name:"Fuel Gas 1 Pressure (psi)",type:"number",value:0,min:0,step:1,max:100},
            {name:"Fuel Gas 2 Pressure (psi)",type:"number",value:0,min:0,step:1,max:100},
            {name:"Gas Flow 1 (L/min)",type:"number",value:0,min:0,step:1,max:10},
            {name:"Gas Flow 2 (L/min)",type:"number",value:0,min:0,step:1,max:10}

          ]},
          {legend: 'Detector', type: 'fieldset',fields:[
            {name:"Detection type",type:"custom_radio",value:"Abosrbance",options:["Abosrbance","Transmittance"]},
            {name:"Measeurement time (s)",type:"number",value:.5,min:.5,step:.5,max:10},
            {name:"Pause (s)",type:"number",value:.5,min:.5,step:.5,max:3},
            {name:"Number of re-samples",type:"number",value:1,min:1,step:1,max:5}
          ]}
        ]
      }
    
    )