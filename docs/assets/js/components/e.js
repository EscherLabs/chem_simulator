device_components.push(
    {
        legend:'Electrophoresis',
        name:"E",
        sections:'tab',
        fields:[
          {legend: 'Gel preparation', type: 'fieldset',fields:[
            {name:"Matrix",type:"custom_radio",value:"Agarose",options:["Agarose","Polyacrylamide"]},
            {name:"Gel Density (%)",type:"number",value:0.05,min:0.05,step:0.05,max:3},
            {name:"Buffer",type:"custom_radio",value:"1 x TAE",options:["1 x TAE","1 x TBE"]},
            {name:"Sample Load (uL)",type:"number",value:5,min:5,step:5,max:25},
            {name:"Voltage (mV)",type:"number",value:80,min:80,step:5,max:140},
            {name:"Run time (min)",type:"number",value:10,min:10,step:5,max:120},
            {name:"Current (A)",type:"number",value:100,min:100,step:5,max:240}
          ]}
        ]
      }
    
    )