device_components.push(
    {
        legend:'Fourier Transform Infrared Spectrometer (FTIR)',
        image:"ftir.png",
        points:false,

        reverse:true,
        chartConfig:{
          axis: {
              x: {
                  tick: {
                      // format(d) {
                      //   return this.data.xs[_.keys(this.data.xs)[0]][this.data.xs[_.keys(this.data.xs)[0]].length-(1+this.data.xs[_.keys(this.data.xs)[0]].indexOf(d))]
                      // },
                      values: (function(start,end,interval){
                        var temp = [];
                        for(var i = start; i<=end; i+=interval){
                        temp.push(i)
                        }
                        return temp;
                      })(400,4000,200)
                      
                  }
              }
          }
        },
        // chart:function(file, settings){

        //   $.get('assets/data/ftir/'+file+'.csv',function(file,e){
        //     globaltemp = _.csvToArray(e,{skip:1});
        //     keys = _.keys(globaltemp[0]);
        //     var x = []

        //     var y = [file]
        //     _.each(globaltemp,function(i){
        //       if(parseInt(i[keys[0]]) >= gform.instances['FTIR'].get('sample_holder')['range_start'] && parseInt(i[keys[0]]) <= gform.instances['FTIR'].get('sample_holder')['range_end']){
        //         x.push(i[keys[0]]);
        //         y.push(i[keys[1]]);
        //       }
        //     })
        //     resources.chart.instance =  c3.generate({
        //       bindto: '.chart',
        //       data: {
        //           x: 'x',
        //           // xFormat: format,
        //           columns: [['x'].concat(_.reverse(x)),y], 
        //           type: 'line'
        //       },
        //       point: {
        //           show: false
        //       },
        //       axis: {
        //           x: {
        //               tick: {
        //                   format(d) {
        //                     return this.data.xs[_.keys(this.data.xs)[0]][this.data.xs[_.keys(this.data.xs)[0]].length-(1+this.data.xs[_.keys(this.data.xs)[0]].indexOf(d))]
        //                   },
        //                   values: function(start,end,interval){
        //                     var temp = [];
        //                     for(var i = start; i<=end; i+=interval){
        //                     temp.push(i)
        //                     }
        //                     return temp;
        //                   }(400,4000,200)
                          
        //               },
        //               label: keys[0]
        //           },
        //           y: {
        //               label: keys[1]
        //           }
        //       }
        //     });
        //     if(typeof gform.instances.modal !== 'undefined')gform.instances.modal.trigger('close');
        //   }.bind(null,file))
        // },
        events:[
          {
            "event":"save",
            "handler":function(e){
              $('.chart').html('')

              // if(!e.form.validate())return false;
              resources.chart.data = {
                xs: {},
                columns: [],
                type: 'line',
                // instance:resources.chart.instance
              }
              if(!e.form.validate() || __.validate(__.findComponent().validationFields))return false;

                // var testForm = new gform({fields:__.findComponent().validationFields, data: e.form.get()})
    
                // if((config.validate !== "false") && !testForm.validate(true)){
                //     var errors = _.uniq(_.values(testForm.errors));
                //     if(config.errors)console.log(errors)
                //     if(errors.length > 1){
                //      $('.chart').append('<div class="alert alert-danger">Method Incorrect Please check your values</div>')
                //     } else {
                //      $('.chart').append('<div class="alert alert-danger">'+errors[0]+'</div>')
                //     }
                //     testForm.destroy();
                //     return false;
                // }
                // testForm.destroy();
              




                resources.form.modal = new gform({
                legend:"Sample Name",
                name:"modal",
                fields:[
                  {type:"smallcombo",name:"file",label:false,options:'ftir',value:"Background"}
                ]
              }).on('save',function(form,e){
                // __.findComponent().chart(e.form.get('file'),resources.form.primary.get());
                // if(parseInt(i[keys[0]]) >= gform.instances['FTIR'].get('sample_holder')['range_start'] && parseInt(i[keys[0]]) <= gform.instances['FTIR'].get('sample_holder')['range_end']){

                resources.data = [{
                  label: e.form.get('file'),
                  url: 'assets/data/ftir/'+e.form.get('file')+'.csv',
                  skip:1,
                  min:gform.instances['FTIR'].get('sample_holder')['range_start'],
                  max:gform.instances['FTIR'].get('sample_holder')['range_end'],
                }]
                __.fetchExternalData(resources.data).then(result => {
                  resources.chart.waiting = __.yieldArray(result);
                  __.chartFile(resources.chart.waiting.next().value)
                })

                if(e.form.get('file') == "Background"){
                  gform.collections.update('ftir',[
                    "Background",
                    "HCL1",
                    "HCL2",
                    "Polystyrene"
                  ])
                }

              }.bind(null,e.form)
            ).on('cancel',function(e){e.form.trigger('close');}).modal()}
          }
          
        ],
        name:"FTIR",
        sections:'tab',

        validationFields:[
          {legend: 'Sample Holder', type: 'fieldset',fields:[

          {label:"Number of Accumulations",name:"accumulations",type:"number",value:1,min:1,step:1,max:16,validate:[{type:"matches",value:16,message:"Check Accumulations"}]},
          {label:"Range start (cm<sup>-1</sup>)",name:"range_start",type:"number",value:360,min:360,step:10,max:8300,validate:[{type:"matches",value:400,message:"Check Range Start"}]},
          {label:"Range end (cm<sup>-1</sup>)",name:"range_end",type:"number",value:820,min:820,step:10,max:4000,validate:[{type:"numeric",message:"Check Range End"}]},
          {label:"Resolution (cm<sup>-1</sup>)",name:"resolution",type:"number",value:1,min:1,step:1,max:4,validate:[{type:"matches",value:1,message:"Check Resolution"}]},
          {label:"Interval (cm<sup>-1</sup>)",name:"interval",type:"number",value:1,min:1,step:1,max:4,validate:[{type:"matches",value:1,message:"Check Interval"}]},
  
          {label:"Units",type:"custom_radio",value:"A",raw:true,options:["A","T"],validate:[{type:"matches",value:"T",message:"Check Units"}]},
          {label:"Background",type:"custom_radio",value:"Air",options:["Air","Nitrogen","Sample matrix"],validate:[{type:"matches",value:"Nitrogen",message:"Check Background"}]},
        ]}],
        fields:[
          {legend: 'Sample Holder', type: 'fieldset',fields:[
            {label:"Number of Accumulations",name:"accumulations",type:"number",value:1,min:1,step:1,max:16,validate:[{type:"numeric"}]},
            {label:"Range start (cm<sup>-1</sup>)",name:"range_start",type:"number",value:360,min:360,step:10,max:8300,validate:[{type:"numeric"}]},
            {label:"Range end (cm<sup>-1</sup>)",name:"range_end",type:"number",value:3500,min:3500,step:10,max:4000,validate:[{type:"numeric"}]},
            {label:"Resolution (cm<sup>-1</sup>)",name:"resolution",type:"number",value:1,min:1,step:1,max:4,validate:[{type:"numeric"}]},
            {label:"Interval (cm<sup>-1</sup>)",name:"interval",type:"number",value:1,min:1,step:1,max:4,validate:[{type:"numeric"}]},
    
            {label:"Units",type:"custom_radio",value:"A",raw:true,options:["A","T"]},
            {label:"Background",type:"custom_radio",value:"Air",raw:true,options:["Air","Nitrogen","Sample matrix"]},
          ]}
        ]
      }
    
    )

    gform.collections.add('ftir',["Background"])


