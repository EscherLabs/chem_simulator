instrument_components.push(
    {
        legend:'Mass Spectrometer',
        name:"MS",
        fields:[
          {name:"Filament (eV)",type:"number",value:60,min:60,step:1,max:80},
          {name:"Scan range start (m/z)",type:"number",value:10,min:10,step:1,max:300},
          {name:"Scan range End (m/z)",type:"number",value:10,min:10,step:1,max:300},
          {name:"Scan rate (scan/s)",type:"number",value:1,min:1,step:1,max:5}
        ]
      }
    
    )