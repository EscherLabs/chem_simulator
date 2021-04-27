device_components.push(
    {
        legend:'Fluorimeter',
        name:"F",
        preform:true,
        animate:50,
        image:"ls-45.png",
        hideLines:true,
        formatFile: (name, settings) => {
          
          return {
          label: name,
          url :('assets/data/f/'+(file.indexOf('PreScan')>=0)?file:'session/'+settings+'/'+file)+'.csv',
          min: settings.acquisition.from,
          max: settings.acquisition.to,
          keys:['nm','a.u.']
        }
      },
        chartConfig:{   
          xs: {},
          columns: [],
          type: 'line',     
          axis: {
            x: {
                tick: {
                    values: function(start,end,interval){
                      var temp = [];
                      for(var i = start; i<=end; i+=interval){
                      temp.push(i)
                      }
                      return temp;
                    }(350,650,10)
                    
                }
            }
          }
        },
        events:[
          {
            "event":"save",
            "handler":function(e){
              if(state.running){
                state.running = false;
                resources.form.primary.find('run').update({label:"Run","modifiers": "btn btn-success"})
                return;
              }
              if(typeof resources.data !== 'undefined')resources.data=[];

              $('.chart').html('')
              // if(!e.form.validate())return false;

              
              
              //__.findComponent().chartConfig;

              resources.chart.data ={
                xs: {},
                columns: [],
                type: 'line',
                // instance:resources.chart.instance
              }

              var validationConfig = __.findComponent().validationFields;
              if(document.body.querySelector('.tab-pane.active').id == "tabsemission"){
                validationConfig = __.findComponent().emissionValidationFields;
              }
              // var testForm = new gform({fields:validationConfig,data:e.form.get()})

  
              // if((config.validate !== "false") && !testForm.validate(true)){
              //   var errors = _.uniq(_.values(testForm.errors));
              //   if(errors.length>1){
              //     $('.chart').append('<div class="alert alert-danger">Method Incorrect Please check your values</div>')
              //   }else{
              //     $('.chart').append('<div class="alert alert-danger">'+errors[0]+'</div>')
              //   }
              //   testForm.destroy();
              //   return false;
              // }
              // testForm.destroy();


              if(!e.form.validate() || __.validate(validationConfig))return false;

              switch(document.body.querySelector('.tab-pane.active').id){
                case 'tabsprescan':
                  resources.data = [{
                    label: 'PreScan_Excitation',
                    url: 'assets/data/f/PreScan_Excitation.csv',
                    skip:1,
                    keys:['nm','a.u.']
                  },
                  {
                    label: 'PreScan_Emission',
                    url: 'assets/data/f/PreScan_Emission.csv',
                    skip:1,
                    keys:['nm','a.u.']
                  }]
                    __.fetchExternalData(resources.data).then(result => {
                      resources.chart.waiting = __.yieldArray(result);
                      __.chartFile(resources.chart.waiting.next().value)
                    })
                  break;
                case 'tabsemission':

                  resources.form.modal = new gform({
                    legend:"Sample Name",
                    actions:[{type:'cancel'},{type:'save',label:"Run"}],
                    name:"modal",
                    fields:[
                      {type:"smallcombo", name:"file",label:false,options:() => sessions[resources.form.primary.get('session')]}
                    ]
                  }).on('save',function(form,e){
                    resources.data = [{
                      label: 'PreScan_Excitation',
                      url: 'assets/data/f/session/'+resources.form.primary.get('session')+'/'+e.form.get('file')+".csv",
                      skip:1,keys:['nm','a.u.']
                    }]
                    __.fetchExternalData(resources.data).then(result => {
                      resources.chart.waiting = __.yieldArray(result);
                      __.chartFile(resources.chart.waiting.next().value)
                    })
                  }.bind(null,e.form)


                ).on('cancel',function(e){e.form.trigger('close');}).modal()}
              }
          }
        ],
        sections:'tab',
        emissionValidationFields:[
          {legend: 'Emission-Scan', type: 'fieldset',fields:[
            {label:"Start (nm)",name:"ems_start",type:"number",validate:[{type:"matches",value:475,message:"Check Emission-Scan Start"}]},
            {label:"End (nm)",name:"ems_end",type:"number",validate:[{type:"matches",value:600,message:"Check Emission-Scan End"}]},
            {label:"Excitation (nm)",name:"ems_excitation",type:"number",value:390,min:390,step:1,max:500,validate:[{type:"numeric",min:440,max:451,message:"Check Emission-Scan Excitation"}]
            },
            {label:"Scan Speed (nm/min)",name:"ems_scan_speed",type:"number",validate:[{type:"numeric",min:250,max:1000,message:"Check Scan Speed"}]},
          ]}
        ],
        validationFields:[
          {label:"Slit Width (nm)",name:"slit_width",type:"number",validate:[{type:"matches",value:10,message:"Slit Width"}]},
         
          {legend: 'Pre-Scan',name:"prescan", type: 'fieldset', id:"prescan",fields:[
            {label:"Excitation range from (nm)",name:"ps_excitation_range_from",type:"number",value:390,min:370,step:1,max:490,validate:[{type:"matches",value:380,message:"Check Excitation Range from"}]},
            {label:"Excitation range to (nm)",name:"ps_excitation_range_to",type:"number",value:490,min:490,step:1,max:500,validate:[{type:"matches",value:500,message:"Check Excitation Range to"}]},
            {label:"Emission range from (nm)",name:"ps_emission_range_from",type:"number",value:400,min:400,step:1,max:740,validate:[{type:"matches",value:475,message:"Check Emission Range from"}]},
            {label:"Emission range to (nm)",name:"ps_emission_range_to",type:"number",value:410,min:410,step:1,max:750,validate:[{type:"matches",value:600,message:"Check Emission Range to"}]},
            {label:"Scan Speed (nm/min)",name:"ps_scan_speed",type:"number",value:250,min:250,step:10,max:1000,validate:[{type:"numeric",min:250,max:1000,message:"Check Scan Speed"}]},
            
          ]},
          {label:"Session ID",name:"session",validate:[{type:"custom",test:function(a){
            return (typeof sessions[a.value] == "undefined")?"Invalid Session ID":false;
          }}]},

        ],
        fields:[
        {label:"Session ID",name:"session",target:function(){return document.querySelector('#preform')}},

          {legend: 'Pre-Scan',name:"prescan", type: 'fieldset', id:"prescan",fields:[
            {label:"Excitation range from (nm)",name:"ps_excitation_range_from",type:"number",value:390,min:370,step:1,max:490},
            {label:"Excitation range to (nm)",name:"ps_excitation_range_to",type:"number",value:490,min:490,step:1,max:500},
            {label:"Emission range from (nm)",name:"ps_emission_range_from",type:"number",value:400,min:400,step:1,max:740},
            {label:"Emission range to (nm)",name:"ps_emission_range_to",type:"number",value:410,min:410,step:1,max:750},
            {label:"Scan Speed (nm/min)",name:"ps_scan_speed",type:"number",value:250,min:250,step:10,max:1000},
            
          ]},
          {legend: 'Excitation-Scan', type: 'fieldset', id:"excitation", fields:[
            {label:"Start (nm)",name:"exs_start",type:"number",value:390,min:390,step:1,max:590},
            {label:"End (nm)",name:"exs_end",type:"number",value:490,min:490,step:1,max:600},
            {label:"Emission (nm)",name:"exs_emission",type:"number",value:400,min:400,step:1,max:740},
            {label:"Scan Speed (nm/min)",name:"exs_scan_speed",type:"number",value:250,min:250,step:10,max:1000},
          ]},
          {legend: 'Emission-Scan', type: 'fieldset',id:"emission",fields:[
            {label:"Start (nm)",name:"ems_start",type:"number",value:400,min:400,step:1,max:740},
            {label:"End (nm)",name:"ems_end",type:"number",value:410,min:410,step:1,max:750},
            {label:"Excitation (nm)",name:"ems_excitation",type:"number",value:390,min:390,step:1,max:500},
            {label:"Scan Speed (nm/min)",name:"ems_scan_speed",type:"number",value:250,min:250,step:10,max:1000},
          ]},
          {label:"Slit Width (nm)",name:"slit_width",type:"number",value:5,min:5,step:1,max:10}
        ]
      }
    )

    // gform.collections.add('f',[{label:"Emission 1",value:"Fluorescein_emission_1"},
    // {label:"Emission 2",value:"Fluorescein_emission_2"},
    // ])
    gform.collections.add('F',[
      {label:"Pre-Scan",value:"prescan"},
      {label:"Pre-Scan Excitation",display:"Excitation,Emission",value:"prescan",search:"PreScan_Excitation",},
      {label:"Pre-Scan Emission",display:"Excitation,Emission",value:"prescan",search:"PreScan_Emission",},
      {label:"Pre-Scan",value:"prescan"},
      {label:"Standard 1",value:"standard_1"},
      {label:"Standard 2",value:"standard_2"},
      {label:"Standard 3",value:"standard_3"},
      {label:"Standard 4",value:"standard_4"},
      {label:"Cereal 1",value:"cereal_1"},
      {label:"Cereal 2",value:"cereal_2"}
    ])    
    gform.collections.add('f_sessions',[
      {label:"221413",value:"221413"},
      {label:"221422",value:"221422"},
      {label:"221437",value:"221437"},
      {label:"221441",value:"221441"},
      {label:"221459",value:"221459"},
      {label:"221461",value:"221461"},
      {label:"221477",value:"221477"},
      {label:"221482",value:"221482"},
      {label:"221493",value:"221493"},
      {label:"221402",value:"221402"}
    ])

    sessions = {
      221402:[
        {label:"Standard 1",value:"Std1_10"},
        {label:"Standard 2",value:"Std2_20"},
        {label:"Standard 3",value:"Std3_30"},
        {label:"Standard 4",value:"Std4_40"},
        {label:"Cereal 1",value:"cereal_1"},
        {label:"Cereal 2",value:"cereal_2"}
      ],
      221413:[
        {label:"Standard 1",value:"Std1_10"},
        {label:"Standard 2",value:"Std2_25"},
        {label:"Standard 3",value:"Std3_40"},
        {label:"Standard 4",value:"Std4_50"},
        {label:"Cereal 1",value:"Cereal_1"},
        {label:"Cereal 2",value:"Cereal_2"}
      ],      
      221422:[
        {label:"Standard 1",value:"Std1_10"},
        {label:"Standard 2",value:"Std2_20"},
        {label:"Standard 3",value:"Std3_30"},
        {label:"Standard 4",value:"Std4_40"},
        {label:"Cereal 1",value:"Cereal_1"},
        {label:"Cereal 2",value:"Cereal_2"}
      ],      
      221437:[
        {label:"Standard 1",value:"Std1_10"},
        {label:"Standard 2",value:"Std2_20"},
        {label:"Standard 3",value:"Std3_30"},
        {label:"Standard 4",value:"Std4_40"},
        {label:"Cereal 1",value:"cereal_1"},
        {label:"Cereal 2",value:"cereal_2"}
      ],      
      221441:[
        {label:"Standard 1",value:"Std1_10"},
        {label:"Standard 2",value:"Std2_20"},
        {label:"Standard 3",value:"Std3_30"},
        {label:"Standard 4",value:"Std4_40"},
        {label:"Cereal 1",value:"cereal_1"},
        {label:"Cereal 2",value:"cereal_2"}
      ],      
      221459:[
        {label:"Standard 1",value:"Std1_10"},
        {label:"Standard 2",value:"Std2_20"},
        {label:"Standard 3",value:"Std3_30"},
        {label:"Standard 4",value:"Std4_40"},
        {label:"Cereal 1",value:"cereal_1"},
        {label:"Cereal 2",value:"cereal_2"}
      ],      
      221461:[
        {label:"Standard 1",value:"Std1_10"},
        {label:"Standard 2",value:"Std2_20"},
        {label:"Standard 3",value:"Std3_30"},
        {label:"Standard 4",value:"Std4_40"},
        {label:"Cereal 1",value:"cereal_1"},
        {label:"Cereal 2",value:"cereal_2"}
      ],      
      221477:[
        {label:"Standard 1",value:"KLNN_10"},
        {label:"Standard 2",value:"KLNN_20"},
        {label:"Standard 3",value:"KLNN_30"},
        {label:"Standard 4",value:"KLNN_40"},
        {label:"Cereal 1",value:"cereal_1"},
        {label:"Cereal 2",value:"cereal_2"}
      ],      
      221482:[
        {label:"Standard 1",value:"KLNN_10"},
        {label:"Standard 2",value:"KLNN_20"},
        {label:"Standard 3",value:"KLNN_30"},
        {label:"Standard 4",value:"KLNN_40"},
        {label:"Cereal 1",value:"cereal_1"},
        {label:"Cereal 2",value:"cereal_2"}
      ],      
      221493:[
        {label:"Standard 1",value:"Std1_10"},
        {label:"Standard 2",value:"Std2_20"},
        {label:"Standard 3",value:"Std3_30"},
        {label:"Standard 4",value:"Std4_40"},
        {label:"Cereal 1",value:"cereal_1"},
        {label:"Cereal 2",value:"cereal_2"}
      ],
  }