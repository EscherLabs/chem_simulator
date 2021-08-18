device_components.push(
    {
        legend:'Fourier Transform Infrared Spectrometer (FTIR)',
        image:"ftir.png",
        points:false,
        reverse:true,
        description:`
        <div id="zoom-actions">
        <span class="zoom" style="width:12opx;display: inline-block;"></span>
        <span class="reset" style="width:12opx;display: inline-block;"></span>
        <span class="undo" style="width:12opx;display: inline-block;"></span>
        </div>`,
        chartConfig:{
          transition:{duration:0},
          axis: {
              x: {
                  tick: {
                      // format(d) {
                      //   return this.data.xs[_.keys(this.data.xs)[0]][this.data.xs[_.keys(this.data.xs)[0]].length-(1+this.data.xs[_.keys(this.data.xs)[0]].indexOf(d))]
                      // },
                      // values: (function(start,end,interval){
                      //   var temp = [];
                      //   for(var i = start; i<=end; i+=interval){
                      //   temp.push(i)
                      //   }
                      //   return temp;
                      // })(400,4000,100)
                      
                  }
              }
          }
        },
        tickValues: () => (function(start,end,interval){
          var temp = [];
          for(var i = start; i<=end; i+=interval){
            temp.push(i)
          }
          return temp;
        })(resources.data[0].min,resources.data[0].max,100),

        pointClick:function(d, i) {
          resources.chart.instance.regions.remove();
          if(_.findIndex(resources.chart.regions,{value:d.x}) !== -1){
            resources.chart.regions.splice(_.findIndex(resources.chart.regions,{value:d.x}),1)
            
          }else{
            resources.chart.regions.push({value: d.x, text: d.value})
          }
          resources.chart.regions = _.uniqBy(resources.chart.regions,'value');
          resources.chart.instance.regions([]);

          if(resources.chart.regions.length>2){  
            resources.chart.regions.shift()
          }
          resources.chart.instance.xgrids(resources.chart.regions);

          
          __.findComponent().updateActions();

          var sorted = _.sortBy(resources.chart.regions,'value')

          if(resources.chart.regions.length>1){ 
            resources.chart.instance.regions([
            {axis: 'x', start: sorted[0].value, end: sorted[1].value, class: 'regionX',label:''},
            ])
          }
          // setTimeout(function(){
            // resources.chart.instance.zoom(resources.chart.instance.zoom())
          // },360)

        },
        updateActions: ()=>{
          gform.types.button.edit.call(resources.form.primary.find('zoom'),(resources.chart.regions.length>1))
          gform.types.button.show.call(resources.form.primary.find('zoom'),(resources.chart.regions.length>1 || resources.chart.zooms.length))
          gform.types.button.show.call(resources.form.primary.find('zoom_reset'),(resources.chart.zooms.length))
          gform.types.button.show.call(resources.form.primary.find('zoom_undo'),(resources.chart.zooms.length>1))
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
        "actions": [
        {
          type:"save",
          label:"Run",
          target:".gform-footer"
        },{
          type:"button",
          label:"<i fa fa-zoom></i> Zoom to selection",
          target:()=> document.querySelector("#zoom-actions .zoom"),
          action:'zoom',
          columns:4,
          show:false,
          name:"zoom"
        },{
          type:"button",
          label:"<i fa fa-zoom></i>Reset Zoom",
          target:()=> document.querySelector("#zoom-actions .reset"),
          action:'zoom_reset',
          show:false,
          columns:4,"modifiers": "btn btn-primary",
          name:"zoom_reset"
        },{
          type:"button",
          label:"<i fa fa-zoom></i>Undo Zoom",
          target:()=> document.querySelector("#zoom-actions .undo"),
          action:'zoom_undo',
          show:false,
          columns:4,
          "modifiers": "btn btn-info",
          name:"zoom_undo"
        }],
        events:[
          {
            event:'zoom_reset',
            handler:function(){

              resources.chart.zooms = [];
              resources.chart.regions = [];
              resources.chart.instance.xgrids(resources.chart.regions);
              resources.chart.instance.regions([])
              resources.chart.instance.load(resources.chart.data)
              __.findComponent().updateActions();

            }
          },{
            event:'zoom_undo',
            handler:function(){
              resources.chart.zooms.shift()
              resources.chart.regions = [];
              resources.chart.instance.xgrids(resources.chart.regions);
              resources.chart.instance.regions([])
              resources.chart.instance.load(resources.chart.zooms[0]||resources.chart.data)
              __.findComponent().updateActions();
            }
          },
          {
            event:'zoom',
            handler: function(){
              let globaltemp = resources.data[0].data;

              var sorted = _.sortBy(resources.chart.regions,'value')
    
              var zoomData = _.cloneDeep(resources.chart.data)
              var searchStart = {[_.keys(globaltemp[0])[0]]:sorted[0].value+''}
              var searchend = {[_.keys(globaltemp[0])[0]]:sorted[1].value+''}

              // searchStart[_.keys(globaltemp[0])[0]] = sorted[0].value+'';
              // searchend[_.keys(globaltemp[0])[0]] = sorted[1].value+'';
              
              zoomData.offsets = _.cloneDeep(resources.chart.data).columns[0].reverse().slice(_.findIndex(globaltemp,searchStart)+1,_.findIndex(globaltemp,searchend)+2)

              zoomData.columns[0] = zoomData.columns[0].slice(_.findIndex(globaltemp,searchStart)+1,_.findIndex(globaltemp,searchend)+2)
              zoomData.columns[1] = zoomData.columns[1].slice(_.findIndex(globaltemp,searchStart)+1,_.findIndex(globaltemp,searchend)+2)
              zoomData.columns[0].unshift(resources.chart.data.columns[0][0])
              zoomData.columns[1].unshift(resources.chart.data.columns[1][0])
              
              resources.chart.regions = [];
              resources.chart.instance.xgrids(resources.chart.regions);
              resources.chart.instance.regions([])

              resources.chart.zooms.unshift(zoomData);

              __.findComponent().updateActions();

              resources.chart.instance.load(zoomData)

            }
          },
          {
            "event":"save",
            "handler":function(e){
              $('.chart').html('')

              // if(!e.form.validate())return false;
              resources.chart.data = {
                xs: {},
                columns: [],
                type: 'line',
                onclick:__.findComponent().pointClick,

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
                let url = 'assets/data/ftir/'+e.form.get('file')+'.csv';
                if(e.form.get('file') == "HCl")url = 'assets/data/ftir/'+e.form.get('file')+(_.random()+1)+'.csv';
                resources.data = [{
                  label: e.form.get('file'),
                  url: url,
                  skip:1,
                  keys:['Wavenumber (cm-1)','% Transmittance'],
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
                    "HCl",
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
          {label:"Range start (cm<sup>-1</sup>)",name:"range_start",type:"number",value:360,min:360,step:10,max:8300,validate:[{type:"numeric",min:400, max:2500,message:"Check Range Start"}]},
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


