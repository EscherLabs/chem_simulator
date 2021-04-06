instrument_components.push(
    {
        legend:'Fluorimeter',
        name:"F",
        preform:true,
        image:"ls-45.png",
        chart:function(file,index, settings){
          var chartData;
          var filename = 'assets/data/f/'+((document.body.querySelector('.tab-pane.active').id == 'tabsprescan')?file:'session/'+gform.instances.F.get('session')+'/'+file)+'.csv'
          $.get(filename,function(file,e){
            // debugger;
            chartData = _.csvToArray('nm,a.u.\n'+e,{skip:0});
            keys = ['nm','a.u.']//_.keys(chartData[0]);
            var x = []

            var y = []
            var xIndex = 0;
            var yIndex = 1;
            if(typeof globalChart.xs[file] == 'undefined'){
              globalChart.xs[file] = "x"+gform.getUID()

              xIndex = globalChart.columns.length;
              globalChart.columns.push([globalChart.xs[file]]);
              yIndex = globalChart.columns.length;
              globalChart.columns.push([file]);
            }

            c3chart =  c3.generate({
              bindto: '.chart',
              data: globalChart,
              point: {
                  show: true
              },
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
                          
                      },
                      label: keys[0]
                  },
                  y: {
                      label: keys[1]
                  }
              }
            });
            $('.c3-lines').hide();
            // if(typeof gform.instances.modal !== 'undefined')gform.instances.modal.trigger('close');



            gform.instances.F.find('running').set(true);
            gform.instances.F.find('run').update({label:"<i class=\"fa fa-times\"></i> Stop","modifiers": "btn btn-danger"});
            (function (data) {
              var dataLength = data.length;
              var datapointer = 0;
              var caller = function () {
                var i = data[datapointer++];
                if(!isNaN(i[keys[0]] ) ) {
                  globalChart.columns[xIndex].push(i[keys[0]]);
                  globalChart.columns[yIndex].push(i[keys[1]]);
                  
                  c3chart.load(globalChart)
                }
                if(datapointer<dataLength && gform.instances.F.get('running')){
                  setTimeout(caller, 50);
                }else{
                  debugger;
                  if(gform.instances.F.get('running') && waiting.length){
                    _.find(instrument_components,{legend:instruments['F'].label}).chart(waiting.pop())

                  }else{
                    gform.instances.F.find('run').update({label:"Run","modifiers": "btn btn-success"})
                    gform.instances.F.find('running').set(false)
                  }
                  
                }
              }
              setTimeout(caller, 50);
            })(chartData);

            if(typeof gform.instances.modal !== 'undefined')gform.instances.modal.trigger('close');

          }.bind(null,file))
        },
        events:[
          {
            "event":"save",
            "handler":function(e){
              if(gform.instances.F.get('running')){
                gform.instances.F.find('running').set(false)
                gform.instances.F.find('run').update({label:"Run","modifiers": "btn btn-success"})

                return;
              }
              if(typeof globalDownloadableData !== 'undefined')delete globalDownloadableData;

              $('.chart').html('')
              if(!e.form.validate())return false;
              globalChart = {
                xs: {},
                columns: [],
                type: 'line'
              }
              waiting = [];
              //todo -- look at using gform validation for the following
              
                            // var errors = [];
                            // var data = e.form.get();
              // debugger;
              var validationConfig = _.find(instrument_components,{legend:instruments['F'].label}).validationFields;
              if(document.body.querySelector('.tab-pane.active').id == "tabsemission"){
                validationConfig = _.find(instrument_components,{legend:instruments['F'].label}).emissionValidationFields;
              }
              var testForm = new gform({fields:validationConfig,data:e.form.get()})

  
              if((hashParams.validate !== "false") && !testForm.validate(true)){
                var errors = _.uniq(_.values(testForm.errors));
                if(errors.length>1){
                  $('.chart').append('<div class="alert alert-danger">Method Incorrect Please check your values</div>')
                }else{
                  $('.chart').append('<div class="alert alert-danger">'+errors[0]+'</div>')
                }
                testForm.destroy();
                return false;
              }
              testForm.destroy();

              // if(typeof sessions[gform.instances.F.get('session')] == "undefined"){
              //   $('.chart').append('<div class="alert alert-danger">Invalid Session ID</div>')
              
              //   return;
              // }
              // debugger;
// if(document.body.querySelector('.tab-pane.active').id == 'tabsemission'){console.log(e.form.get('session'))}
switch(document.body.querySelector('.tab-pane.active').id){
  case 'tabsprescan':
    waiting.push('PreScan_Emission')
    _.find(instrument_components,{legend:instruments['F'].label}).chart('PreScan_Excitation')

    // _.find(instrument_components,{legend:instruments['F'].label}).chart('PreScan_Emission')

    break;
  // default:
    case 'tabsemission':

    var modalForm = new gform({
      legend:"Sample Name",
      actions:[{type:'cancel'},{type:'save',label:"Run"}],
      name:"modal",
      fields:[
        {type:"smallcombo",name:"file",label:false,options:function(){
          return sessions[gform.instances.F.get('session')];
        }}
      ]
    }).on('save',function(form,e){

      globalDownloadableData = 'session/'+gform.instances.F.get('session')+'/'+e.form.get('file');
      _.find(instrument_components,{legend:instruments['F'].label}).chart(e.form.get('file'))
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
            {label:"Excitation (nm)",name:"ems_excitation",type:"number",value:390,min:390,step:1,max:500,validate:[
              {type:"numeric",min:440,max:451,message:"Check Emission-Scan Excitation"}
            //   {type:"custom",test:function(e){
            //   if(!((e.value >=280 && e.value<=400) ||(e.value >=460 && e.value<=490)))return "Check Emission-Scan Excitation";

            // }}
              ]
            },
            {label:"Scan Speed (nm/min)",name:"ems_scan_speed",type:"number",validate:[{type:"numeric",min:250,max:1000,message:"Check Scan Speed"}]},
          ]}
        ],
        validationFields:[
          {label:"Slit Width (nm)",name:"slit_width",type:"number",validate:[{type:"matches",value:10,message:"Slit Width"}]},
         
          {label:"Session ID",name:"session",validate:[{type:"custom",test:function(a){
            return (typeof sessions[a.value] == "undefined")?"Invalid Session ID":false;
          }}]},

        ],
        fields:[
        //   {legend: 'Session',name:"session_container", type: 'fieldset', id:"",fields:[

        // ]},
        // {label:false,type:"output",target:".gform-footer"},

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
          {label:"Slit Width (nm)",name:"slit_width",type:"number",value:5,min:5,step:1,max:10},
          {label:false,value:false,name:"running",type:"switch",options:[{label:'',value:false},{label:"Collecting Data",value:true}],show:false},

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
        // {label:"Pre-Scan",value:"prescan"},
        {label:"Standard 1",value:"Std1_10"},
        {label:"Standard 2",value:"Std2_20"},
        {label:"Standard 3",value:"Std3_30"},
        {label:"Standard 4",value:"Std4_40"},
        {label:"Cereal 1",value:"cereal_1"},
        {label:"Cereal 2",value:"cereal_2"}
      ],
      221413:[
        // {label:"Pre-Scan",value:"prescan"},
        {label:"Standard 1",value:"Std1_10"},
        {label:"Standard 2",value:"Std2_25"},
        {label:"Standard 3",value:"Std3_40"},
        {label:"Standard 4",value:"Std4_50"},
        {label:"Cereal 1",value:"Cereal_1"},
        {label:"Cereal 2",value:"Cereal_2"}
      ],      
      221422:[
        // {label:"Pre-Scan",value:"prescan"},
        {label:"Standard 1",value:"Std1_10"},
        {label:"Standard 2",value:"Std2_20"},
        {label:"Standard 3",value:"Std3_30"},
        {label:"Standard 4",value:"Std4_40"},
        {label:"Cereal 1",value:"Cereal_1"},
        {label:"Cereal 2",value:"Cereal_2"}
      ],      
      221437:[
        // {label:"Pre-Scan",value:"prescan"},
        {label:"Standard 1",value:"Std1_10"},
        {label:"Standard 2",value:"Std2_20"},
        {label:"Standard 3",value:"Std3_30"},
        {label:"Standard 4",value:"Std4_40"},
        {label:"Cereal 1",value:"cereal_1"},
        {label:"Cereal 2",value:"cereal_2"}
      ],      
      221441:[
        // {label:"Pre-Scan",value:"prescan"},
        {label:"Standard 1",value:"Std1_10"},
        {label:"Standard 2",value:"Std2_20"},
        {label:"Standard 3",value:"Std3_30"},
        {label:"Standard 4",value:"Std4_40"},
        {label:"Cereal 1",value:"cereal_1"},
        {label:"Cereal 2",value:"cereal_2"}
      ],      
      221459:[
        // {label:"Pre-Scan",value:"prescan"},
        {label:"Standard 1",value:"Std1_10"},
        {label:"Standard 2",value:"Std2_20"},
        {label:"Standard 3",value:"Std3_30"},
        {label:"Standard 4",value:"Std4_40"},
        {label:"Cereal 1",value:"cereal_1"},
        {label:"Cereal 2",value:"cereal_2"}
      ],      
      221461:[
        // {label:"Pre-Scan",value:"prescan"},
        {label:"Standard 1",value:"Std1_10"},
        {label:"Standard 2",value:"Std2_20"},
        {label:"Standard 3",value:"Std3_30"},
        {label:"Standard 4",value:"Std4_40"},
        {label:"Cereal 1",value:"cereal_1"},
        {label:"Cereal 2",value:"cereal_2"}
      ],      
      221477:[
        // {label:"Pre-Scan",value:"prescan"},
        {label:"Standard 1",value:"KLNN_10"},
        {label:"Standard 2",value:"KLNN_20"},
        {label:"Standard 3",value:"KLNN_30"},
        {label:"Standard 4",value:"KLNN_40"},
        {label:"Cereal 1",value:"cereal_1"},
        {label:"Cereal 2",value:"cereal_2"}
      ],      
      221482:[
        // {label:"Pre-Scan",value:"prescan"},
        {label:"Standard 1",value:"KLNN_10"},
        {label:"Standard 2",value:"KLNN_20"},
        {label:"Standard 3",value:"KLNN_30"},
        {label:"Standard 4",value:"KLNN_40"},
        {label:"Cereal 1",value:"cereal_1"},
        {label:"Cereal 2",value:"cereal_2"}
      ],      
      221493:[
        // {label:"Pre-Scan",value:"prescan"},
        {label:"Standard 1",value:"Std1_10"},
        {label:"Standard 2",value:"Std2_20"},
        {label:"Standard 3",value:"Std3_30"},
        {label:"Standard 4",value:"Std4_40"},
        {label:"Cereal 1",value:"cereal_1"},
        {label:"Cereal 2",value:"cereal_2"}
      ],
  }


/*
Scan type: Emission
Start: integer between 480 and 520
End: integer between 521 and 550
Excitation: see above
Scan Speed: integers 100 to 1000

Can you please add a new parameter called "Slit Width (nm)"?  The input range should be integers from 5 to 10, but only 10 should be a valid entry.

*/

/*
Pre-Scan	Excitation range from (nm)	380
	Excitation range to (nm)	500
	Emission range from (nm)	510
	Emission range to (nm)	600
	Scan Speed (nm/min)	250 to 1000
Excitation Scan	not used	
Emission Scan	Start (nm)	490
	End (nm)	600
	Excitation (nm)	440 to 450
	Scan Speed (nm/min)	250 to 1000


  Pre-Scan, Standard 1, Standard 2, Standard 3, Standard 4, Cereal 1, Cereal 2
  */