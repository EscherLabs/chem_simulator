instrument_components.push(
    {
        legend:'Fluorimeter',
        name:"F",
        image:"ls-45.png",
        chart:function(file, settings){

          $.get('assets/data/f/'+file+'.csv',function(file,e){
            // debugger;
            globaltemp = _.csvToArray('nm,a.u.\n'+e,{skip:0});
            keys = ['nm','a.u.']//_.keys(globaltemp[0]);
            var x = []

            //herer eist asdfwe
            var y = [_.find(gform.collections.get('f'),{value:file}).label]
            _.each(globaltemp,function(i){
              // if(parseInt(i[keys[0]]) >= gform.instances['F'].get('sample_holder')['Range start (cm-1)'] && parseInt(i[keys[0]]) <= gform.instances['FTIR'].get('sample_holder')['Range end (cm-1)']){
                x.push(i[keys[0]]);
                y.push(i[keys[1]]);
              // }
            })
            c3chart =  c3.generate({
              bindto: '.chart',
              data: {
                  x: 'x',
                  // xFormat: format,
                  columns: [['x'].concat(x),y], 
                  type: 'line'
              },
              point: {
                  show: true
              },
              // tooltip: {
              //   format: {
              //     title: function (x, index) {
              //       debugger;
              //        return x+'cm-1'; 
              //     }
              //   }
              // },
              axis: {
                  x: {
                      tick: {
                          // format(d) {
                          //   return this.data.xs[_.keys(this.data.xs)[0]][this.data.xs[_.keys(this.data.xs)[0]].length-(1+this.data.xs[_.keys(this.data.xs)[0]].indexOf(d))]
                          // },
                          values: function(start,end,interval){
                            var temp = [];
                            for(var i = start; i<=end; i+=interval){
                            temp.push(i)
                            }
                            return temp;
                          }(400,750,5)
                          
                      },
                      label: keys[0]
                  },
                  y: {
                      label: keys[1]
                  }
              }
            });
            $('.c3-lines').hide();
            if(typeof gform.instances.modal !== 'undefined')gform.instances.modal.trigger('close');
          }.bind(null,file))
        },
        events:[
          {
            "event":"save",
            "handler":function(e){

              $('.chart').html('')

              if(!e.form.validate())return false;
  
              //todo -- look at using gform validation for the following
              
                            // var errors = [];
                            // var data = e.form.get();
              // debugger;
              var testForm = new gform({fields:_.find(instrument_components,{legend:instruments['F'].label}).validationFields,data:e.form.get()})

              if(!testForm.validate(true)){
                var errors = _.uniq(_.values(testForm.errors));
                // debugger;
                if(errors.length>1){
                  $('.chart').append('<div class="alert alert-danger">Method Incorrect Please check your values</div>')
                }else{
                  $('.chart').append('<div class="alert alert-danger">'+errors[0]+'</div>')
                }
                testForm.destroy();
                return false;
              }
              testForm.destroy();

              var modalForm = new gform({
                legend:"Sample Name",
                name:"modal",
                fields:[
                  {type:"smallcombo",name:"file",label:false,options:'f'}
                ]
              }).on('save',function(form,e){
                var temp = gform.instances.F.get()['emission-scan']['Excitation (nm)'];

                globalfile = e.form.get('file');

                if(
                  (temp >=280 && temp<=400  && globalfile == "Fluorescein_emission_2")||
                  (temp >=460 && temp<=490 && globalfile == "Fluorescein_emission_1")
                ){
                  $('.chart').append('<div class="alert alert-danger">Invalid Sample - Check Emission-Scan Excitation</div>')
                  if(typeof gform.instances.modal !== 'undefined')gform.instances.modal.trigger('close');
                  return false;
                }
                _.find(instrument_components,{legend:instruments['F'].label}).chart(e.form.get('file'))

              }.bind(null,e.form)
            ).on('cancel',function(e){e.form.trigger('close');}).modal()}
          }
          
        ],
        sections:'tab',

        validationFields:[

          {name:"Slit Width (nm)",type:"number",validate:[{type:"matches",value:10,message:"Slit Width"}]},
          {legend: 'Emission-Scan', type: 'fieldset',fields:[
            {name:"Start (nm)",type:"number",validate:[{type:"numeric",min:480,max:520,message:"Check Emission-Scan Start"}]},
            {name:"End (nm)",type:"number",validate:[{type:"numeric",min:521,max:550,message:"Check Emission-Scan End"}]},
            {name:"Excitation (nm)",type:"number",value:390,min:390,step:1,max:500,validate:[{type:"custom",test:function(e){
              if(!((e.value >=280 && e.value<=400) ||(e.value >=460 && e.value<=490)))return "Check Emission-Scan Excitation";

            }}]},
            {name:"Scan Speed (nm/min)",type:"number",validate:[{type:"numeric",min:100,max:1000,message:"Check Scan Speed"}]},
          ]}
  ],
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
          ]},
          {name:"Slit Width (nm)",type:"number",value:5,min:5,step:1,max:10}

        ]
      }
    )

    gform.collections.add('f',[{label:"Emission 1",value:"Fluorescein_emission_1"},
    {label:"Emission 2",value:"Fluorescein_emission_2"},
    ])



/*
Scan type: Emission
Start: integer between 480 and 520
End: integer between 521 and 550
Excitation: see above
Scan Speed: integers 100 to 1000

Can you please add a new parameter called "Slit Width (nm)"?  The input range should be integers from 5 to 10, but only 10 should be a valid entry.

*/