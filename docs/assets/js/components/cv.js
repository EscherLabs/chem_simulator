device_components.push(
    {
        legend:'Cyclic Voltammeter',
        image:"CV1.png",
        description:"",
        // reverse:true,
        hideLines:true,
        post: () => {
          let columns = resources.chart.data.columns;
          let x = columns[0].slice(1)
          let y = columns[1].slice(1)
          let x2 = columns[2].slice(1)
          let y2 = columns[3].slice(1)

          var maxKey = _.maxBy(_.keys(y), function (o) {
            return parseFloat(y[o])||0; 
          });

          var minKey = _.minBy(_.keys(y2), function (o) {
            return parseFloat(y2[o])||0; 
          });
          resources.chart.instance.xgrids(
            [
              {value: x[maxKey], text: x[maxKey]+"V ( "+y[maxKey]+")", position: 'start'},
              {value: x2[minKey], text: x2[minKey]+"V ( "+y2[minKey]+")", position: 'start'},
              ]
          );
        },
        validationFields:[
          {name:'scan_rate',options:[{value:null,label:''},.02,.05,.1,.15],type:"select",validate:[{type:"required",message:"Check your Scan Rate"}]},
          {name:'e_begin',validate:[{type:"numeric",min:-0.25,message:'Check your E Begin Voltage'}]},
          // {name:'e_step',validate:[{type:"numeric",min:-0.25}]},
          // {name:'scans',validate:[{type:"matches",value:"1",message:"Check your number of scans"}]},
          // {name:'scan_rate',validate:[]},
        ],
        events:[
          {
            "event":"save",
            "handler":function(e){
              $('.chart').html('')

              // if(!e.form.validate())return false;
              if(!e.form.validate() || __.validate(__.findComponent().validationFields))return false;
              // var testForm = new gform({fields:__.findComponent().validationFields,data:e.form.get()})

              // if((config.validate !== "false") && !testForm.validate(true)){
              //   var errors = _.values(testForm.errors);
              //   if(errors.length>1){
              //     $('.chart').append('<div class="alert alert-danger">Method Incorrect Please check your values</div>')
              //   }else{
              //     $('.chart').append('<div class="alert alert-danger">'+errors[0]+'</div>')
              //   }
              //   testForm.destroy();
              //   return false;
              // }
              // testForm.destroy();





              resources.chart.data = {
                xs: {},
                columns: [],
                type: 'line',
                // instance:resources.chart.instance
              }

              resources.form.modal =  new gform({
                legend:"Sample Name",
                name:"modal",
                fields:[
                  {type:"smallcombo",name:"file",label:false,options:'cv'}
                ]
              }).on('save',function(e){          
                let settings = resources.form.primary.get();
                resources.data = [{
                  label: e.form.get('file'),
                  skip: 5,
                  min: settings['e_begin'],
                  max: settings['e_end'],
                  split: true,
                  url: 'assets/data/CV/CV_'+e.form.get('file')+'_scan rate '+(settings.scan_rate*1000)+'.csv'
                }];

                __.fetchExternalData(resources.data).then(result => {
                  resources.chart.waiting = __.yieldArray(result);
                  __.chartFile(resources.chart.waiting.next().value)
                })

            }
          ).on('cancel',function(e){e.form.trigger('close');}).modal()}
          }
        ],
        name:"CV",
        fields:[
          {label:"Purge time (min)",name:"purge_time",type:"number",value:1,min:1,step:0.25,max:2,validate:[{type:'numeric'}]},
          {label:"Range",name:"range",type:"custom_radio",value:'1uA',options:['1uA','10uA','100uA','1000uA']},
          {label:"t-equilibration (sec)",name:"t_equilibration",type:"number",value:0,min:0,step:10,max:60,validate:[{type:'numeric'}]},
          {label:"E begin (V)",name:"e_begin",type:"number",value:-1,min:-1,step:0.05,max:0,validate:[{type:'numeric'}]},
          // {label:"E vertex1 (V)",name:"e_vertex1",type:"number",value:-1,min:-1,step:0.05,max:0,validate:[{type:'numeric'}]},
          {label:"E end (V)",name:"e_end",type:"number",value:0,min:0,step:0.05,max:1,validate:[{type:'numeric'}]},
          {label:"E step (V)",name:"e_step",type:"number",value:0,min:0,step:0.01,max:0.05,validate:[{type:'numeric'}]},
          {label:"Scan rate (V/s)",name:"scan_rate",type:"number",value:0,min:0,step:0.01,max:0.25,validate:[{type:'numeric'}]},
          {label:"Number of scans",name:"scans",type:"custom_radio",value:"1",options:["1","2"]}
        ]
      }
)

gform.collections.add('cv', [
  'Blank',
  'Standard 1, 2mM',
  'Standard 2, 4mM',
  'Standard 3, 6mM',
  'Standard 4, 8mM',
  'Unkown'
])