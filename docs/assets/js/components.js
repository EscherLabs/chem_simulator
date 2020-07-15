instrument_components = [
    {
      legend:'Gas Chromatograph',
      sections:'tab',
      name:'GC',
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
          {legend: 'Temperature Program',array:{min:1}, type: 'table',fields:[
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
            {label:"Temperature (°C)",type:"number",value:100,min:100,max:250,step:5},
            {label:"Ramp (°C/min)",type:"number",value:10,min:10,max:20,step:1},
            {label:"Hold time (min)",name:"hold_time",type:"number",value:0,min:0,max:5,step:1}
          ]},
          
        ]}
      ]}
      ,
    {
      legend:'Cyclic Voltammeter',
      name:"CV",
      fields:[
        {name:"Purge time (min)",type:"number",value:1,min:1,step:0.25,max:2},
        {name:"Range",type:"custom_radio",value:'1uA',options:['1uA','10uA','100uA','1000uA']},
        {name:"t-equilibration (sec)",type:"number",value:0,min:0,step:10,max:60},
        {name:"E begin (V)",type:"number",value:-1,min:-1,step:0.05,max:0},
        {name:"E vertex1 (V)",type:"number",value:-1,min:-1,step:0.05,max:0},
        {name:"E vertex2 (V)",type:"number",value:0,min:0,step:0.05,max:1},
        {name:"E step (V)",type:"number",value:0,min:0,step:0.01,max:0.05},
        {name:"Scan rate (V/s)",type:"number",value:0,min:0,step:0.01,max:0.25},
        {name:"Number of scans",type:"custom_radio",value:1,options:[1,2]}
      ]
    },
    {
      legend:'Fourier Transform Infrared Spectrometer',
      name:"FTIR",
      sections:'tab',
      fields:[
        {legend: 'Sample Holder', type: 'fieldset',fields:[
          {name:"Number of Accumulations",type:"number",value:1,min:1,step:1,max:16},
          {name:"Range start (cm-1)",type:"number",value:360,min:360,step:10,max:8300},
          {name:"Range end (cm-1)",type:"number",value:820,min:820,step:10,max:4000},
          {name:"Resolution (cm-1)",type:"number",value:1,min:1,step:1,max:4},
          {name:"Interval (cm-1)",type:"number",value:1,min:1,step:1,max:4},
  
          {name:"Units",type:"custom_radio",value:"A",options:["A","T"]},
          {name:"Background",type:"custom_radio",value:"Air",options:["Air","Sample matrix"]},
        ]}
      ]
    },
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
    },
    {
      legend:'UV-Vis Spectrophotometer',
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
    },
    {
      legend:'Mass Spectrometer',
      name:"MS",
      fields:[
        {name:"Filament (eV)",type:"number",value:60,min:60,step:1,max:80},
        {name:"Scan range start (m/z)",type:"number",value:10,min:10,step:1,max:300},
        {name:"Scan range End (m/z)",type:"number",value:10,min:10,step:1,max:300},
        {name:"Scan rate (scan/s)",type:"number",value:1,min:1,step:1,max:5}
      ]
    },
    {
      legend:'High Performance Liquid Chromatograph',
      name:"HPLC",
      sections:'tab',
      methods:{
        onAdd:function(e){
          debugger;
          if(e.field.index >0){
            var temp = e.form.find({map:'solvent_pump.gradient.'+(e.field.index-1)})
            ;
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
    },
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
      },
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
      },
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
  ]
   