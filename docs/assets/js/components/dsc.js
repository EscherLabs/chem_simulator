instrument_components.push(
    {
        legend:'Differential Scanning Calorimeter',
        name:"DSC",
        sections:'tab',
        fields:[
          {legend: 'Oven', type: 'fieldset',fields:[
            {name:"Start Temperature (°C)",type:"number",value:10,min:50,step:1,max:600},
            {name:"Ramp (C/min)",type:"number",value:5,min:5,step:1,max:20},
            {name:"Final Temperature (°C)",type:"number",value:50,min:50,step:1,max:600}
            
          ]},
          {legend: 'Gas', type: 'fieldset',fields:[
            {name:"Gas Pressure (psi)",type:"number",value:0,min:0,step:1,max:100},
            {name:"Purge Flow (L/min)",type:"number",value:0,min:0,step:1,max:20}
          ]}
        ]
      }
    
    )