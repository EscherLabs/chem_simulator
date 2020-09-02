instrument_components.push(
    {
        legend:'Fluorimeter',
        name:"F",
        sections:'tab',
        fields:[
          {legend: 'Pre-Scan', type: 'fieldset',fields:[
            {name:"Excitation range from (nm)",type:"number",value:390,min:390,step:1,max:490},
            {name:"Excitation range to (nm)",type:"number",value:490,min:490,step:1,max:500},
            {name:"Emission range from (nm)",type:"number",value:400,min:400,step:1,max:740},
            {name:"Emission range to (nm)",type:"number",value:410,min:410,step:1,max:750},
            {name:"Scan Speed (nm/min)",type:"number",value:250,min:250,step:10,max:1000},
          ]},
          {legend: 'Excitation-Scan', type: 'fieldset',fields:[
            {name:"Start (nm)",type:"number",value:390,min:390,step:1,max:590},
            {name:"End (nm)",type:"number",value:490,min:490,step:1,max:600},
            {name:"Emission (nm)",type:"number",value:400,min:400,step:1,max:740},
            {name:"Scan Speed (nm/min)",type:"number",value:250,min:250,step:10,max:1000},
          ]},
          {legend: 'Emission-Scan', type: 'fieldset',fields:[
            {name:"Start (nm)",type:"number",value:400,min:400,step:1,max:740},
            {name:"End (nm)",type:"number",value:410,min:410,step:1,max:750},
            {name:"Excitation (nm)",type:"number",value:390,min:390,step:1,max:500},
            {name:"Scan Speed (nm/min)",type:"number",value:250,min:250,step:10,max:1000},
          ]}
        ]
      }
    
    )