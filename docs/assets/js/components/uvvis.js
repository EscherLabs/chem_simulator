device_components.push(
    {
        legend:'UV-Vis Spectrophotometer',
        image:"UVVis1.png",
        points:false,
        animatePreview:true,
        formatFile: (name, settings) => {
            return {
            label: name,
            url :`assets/data/uvvis/${name}.csv`,
            min: settings.acquisition.from,
            max: settings.acquisition.to}
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
                    }(100,1200,10)
                    
                }
            }
          },tooltip: {
            format: {
              title: function (x, index) { return x+'nm'; }
            }
          }
        },
        post:()=>{
          
          let columns = resources.chart.data.columns;
          let x = columns[0].slice(1)
          let y = columns[1].slice(1)

          var maxKey = _.maxBy(_.keys(y), function (o) {
            return parseFloat(y[o])||0; 
          });
          // maxKey++;
          resources.chart.instance.xgrids(
            [
              {value: x[maxKey], text: x[maxKey]+"nm ( "+y[maxKey]+")", position: 'start'}
              ]
          );
            
        },
        // chart:function(file, settings){
        //   // const fetchExternalData = files => {
        //   //   return Promise.all(
        //   //     files.map(file =>
        //   //       fetch(file.url)
        //   //     )
        //   //   )
        //   //   .then(
        //   //     responses => Promise.all(
        //   //       responses.map(response => response.text())
        //   //     )
        //   //   ).then(results =>
        //   //     results.reduce((files, result, idx) => {
        //   //       files[idx].content = result;
        //   //       files[idx].data = _.csvToArray(result,{skip:0});
        //   //       return files;
        //   //       // return {...acc,[items[idx].label]:processedData}
        //   //     }, files)
        //   //   );
        //   // };

        //   var chartData;
        //   var filename = 'assets/data/f/'+((document.body.querySelector('.tab-pane.active').id == 'tabsprescan')?file:'session/'+resources.form.primary.get('session')+'/'+file)+'.csv'
        //   // resources.data = [{
        //   //   label: 'F',
        //   //   url: filename
        //   // }]
        //   // fetchExternalData(resources.data)
        //   // .then(result => {
        //   //   console.log("result", result[0].data);
        //   //   // console.log('todo1', result["todo1"]);
        //   // })

          
        //   $.get('assets/data/uvvis/'+file+'.CSV',function(e){
        //     globaltemp = _.csvToArray(e,{skip:0});
        //     keys = _.keys(globaltemp[0]);
        //     var x = ['x']
        //     var y = []
        //     _.each(globaltemp,function(i){
        //       if(parseInt(i[keys[0]]) >= settings['detection']['from'] && parseInt(i[keys[0]]) <= settings['detection']['to']){
        //         x.push(i[keys[0]]);
        //         y.push(i[keys[1]]);
        //       }
        //     })
        //     var maxKey = _.maxBy(_.keys(y), function (o) {
        //       return parseFloat(y[o])||0; 
        //     });
        //     maxKey++;
        //     resources.chart.instance =  c3.generate({
        //       bindto: '.chart',
        //       data: {
        //           x: 'x',
        //           // xFormat: format,
        //           columns: [x,[_.find(gform.collections.get('uvvis'),{value:file}).label].concat(y)], 
        //           type: 'line'
        //       },
        //       point: {
        //           show: false
        //       },
        //       grid:{
        //         x:{
        //           lines: [
        //             {value: x[maxKey], text: x[maxKey]+"nm ( "+y[maxKey]+")", position: 'start'},
        //         ],
        //         }
        //       },
        //       tooltip: {
        //         format: {
        //           title: function (x, index) { return x+'nm'; }
        //         }
        //       },
        //       axis: {
        //           x: {
        //               // type: 'timeseries',
        //               tick: {
        //                   // format: format
  
        //                   // culling: {
        //                   //   max: 19
        //                   // }
        //                   values: function(start,end,interval){
        //                     // [400,600,800,1000,1200,1400,1600,1800,2000,2200,2400,2600,2800,3000,3200,3400,3600,3800,4000]
        //                     var temp = [];
        //                     for(var i = start; i<=end; i+=interval){
        //                     temp.push(i)
        //                     }
        //                     return temp;
        //                   }(100,1200,10)
                          
        //               },
        //               label: keys[0]
  
        //           },
        //           y: {
        //               label: keys[1]
        //           }
        //       }
        //     });
        //     if(typeof gform.instances.modal !== 'undefined')gform.instances.modal.trigger('close');
        //   })
        // },
        events:[{
          "event": "save",
          "handler": function(e){
            $('.chart').html('')

            resources.chart.data ={
              xs: {},
              columns: [],
              type: 'line',
              // instance:resources.chart.instance
            }

            // validationFieldsFluorimeter
            if(!e.form.validate() || __.validate(__.findComponent().validationFields2021))return false;

            resources.form.modal = new gform({
              legend:"Sample Name",
              name:"modal",

              actions:[{type:'cancel'},{type:'save',label:"Run"}],
              fields:[
                {type:"smallcombo",name:"file",label:false,options:'uvvis',value:"BLANK"}
              ]
            }).on('save',function(form,e){
              if(typeof resources.data !== 'undefined')resources.data =[];

     
              let settings = resources.form.primary.get();


              resources.data = [{
                label: _.find(gform.collections.get('uvvis'),{value:e.form.get('file')}).label||e.form.get('file'),
                url: 'assets/data/uvvis/BLUEDYE/'+e.form.get('file')+".csv",

                min: settings.acquisition.from,
                max: settings.acquisition.to,
                skip:1,
                keys:['Wavelength (nm)','Absorbance (AU)']
              }]
              if(__.attr('animatePreview',false,__.findComponent())){
                var a = '<center><div style="width:510px;height: 310px;background-position:0px -8px;background-image:url(assets/img/uv_vis_2.png)"></div></center>';
                var b = '<center><div style="width:510px;height: 310px;background-position: -1px -8px;background-image:url(assets/img/uv_vis_1.png)"></div></center>';
      
                new gform({legend:"Scanning...",name:"animate",fields:[{type:"output",value:'<div style="height:0">'+a+'</div>'+b}],actions:[]}).modal()
                var field = gform.instances.animate.fields[0];
                var fA = function(){field.set(a)};
                var fB = function(){field.set(b)};
      
                var actions = [
                  fA,fB,fA,fB,
                  function(){gform.instances.animate.trigger('close');},
                  function(){
                    __.fetchExternalData(resources.data).then(result => {
                      resources.chart.waiting = __.yieldArray(result);
                      __.chartFile(resources.chart.waiting.next().value)
                    })
                  }
                ];
                __.schedule(actions)
              }else{
                __.fetchExternalData(resources.data).then(result => {
                  resources.chart.waiting = __.yieldArray(result);
                  __.chartFile(resources.chart.waiting.next().value)
                })
                // __.findComponent().chart(e.form.get('file'),resources.form.primary.get())
              }
              e.form.trigger('close')

              gform.collections.update('uvvis',[
                {"label":"Blank",value:"BLANK"},
                {"label":"0.00 PPM",value:"NOPPM"},
                {"label":"5.00 PPM",value:"5PPM"},
                {"label":"10.0 PPM",value:"10PPM"},
                {"label":"25.0 PPM",value:"20PPM"},
                {"label":"Unknown Solution 1",value:"UNK1"},
                {"label":"Unknown Solution 2",value:"UNK2"},
                {"label":"Unknown Solution 3",value:"UNK3"},
                {"label":"Unknown Solution 4",value:"UNK4"},
                {"label":"Unknown Solution 5",value:"UNK5"},
                {"label":"Unknown Solution 6",value:"UNK6"}

                // {"label":"Blank",value:"BLANK2_2"},
                // {"label":"1.00 PPM",value:"1PPM1"},
                // {"label":"4.00 PPM",value:"4PPM1"},
                // {"label":"10.0 PPM",value:"10PPM1"},
                // {"label":"25.0 PPM",value:"25PPM1"},
                // {"label":"Unknown Solution",value:"UNKNOWN1"}

                // {"label":"Blank",value:"BLANK2_2"},
                // {"label":"1.00 ppm Dye",value:"2021-1ppm"},
                // {"label":"5.00 ppm Dye",value:"2021-5ppm"},
                // {"label":"10.00 ppm Dye",value:"2021-10ppm"},
                // {"label":"Dye Unknown",value:"2021-unknown"},
                // {"label":"100ppb Riboflavin",value:"100ppb_Riboflavin"}
              ])
            }.bind(null,e.form)).on('cancel',function(e){e.form.trigger('close');}).modal()
          }
        }],
        name:"UV-Vis",
        sections:'tab',
        validationFields:[

          {legend: 'Acquisition', type: 'fieldset',fields:[
            {label:"Wavelength range from (nm)",name:"from",type:"number",value:190,min:190,step:1,max:890},
            {label:"Wavelength range to (nm)",name:"to",type:"number",value:300,min:300,step:1,max:1100},
            {label:"Integration time (s)",type:"number",value:0.25,min:0.25,step:0.25,max:2,validate:[{type:"matches",value:0.5,message:"Check Integration time "}]},
            {label:"Interval (nm)",type:"number",value:1,min:1,step:1,max:4,validate:[{type:"matches",value:1, message:"Check Interval"}]},
          ]},
          {legend: 'Lamps',name:'lamps', type: 'fieldset',fields:[
            {label:"Tungsten",type:"switch",options:["Off","On"],validate:[{type:"matches", value:"On", message:"Check Lamp Settings","conditions": [
              {
                    "type": "test",
                    "test": function(e){
                      return ((e.owner.find({map:'acquisition.to'}).value >400) || (e.owner.find({map:'lamps.deuterium'}).value == "Off" && e.owner.find({map:'acquisition.from'}).value < 400 ));
                    }
              }
            ]}
          ]},
            {label:"Deuterium",type:"switch",options:["Off","On"],validate:[{type:"matches", value:"On", message:"Check Lamp Settings","conditions": [
              {
                    "type": "test",
                    "test": function(e){
                      return ((e.owner.find({map:'acquisition.from'}).value <300) || (e.owner.find({map:'lamps.tungsten'}).value == "Off" && e.owner.find({map:'acquisition.to'}).value > 300 ));

                    }
                    
                
              }
            ]}
          ]}
          ]},
        ],
        validationFieldsFluorimeter:[

          {legend: 'Acquisition', type: 'fieldset',fields:[
            {label:"Wavelength range from (nm)",name:"from",type:"number",min:300,step:1,max:450,validate:[{type:"matches",value:380,message:"Check Wavelength range from"}]},
            {label:"Wavelength range to (nm)",name:"to",type:"number",min:700,step:1,max:750,validate:[{type:"matches",value:500,message:"Check Wavelength range to"}]},
            {label:"Integration time (s)",type:"number",value:0.25,min:0.25,step:0.25,max:2,validate:[{type:"matches",value:0.5,message:"Check Integration time"}]},
            {label:"Interval (nm)",type:"number",value:1,min:1,step:1,max:4,validate:[{type:"matches",value:1, message:"Check Interval"}]},
            {label:"Path Length (cm)",type:"number",value:0.5,min:0.5,step:0.5,max:1,validate:[{type:"matches",value:1, message:"Check Path Length"}]}
          ]},
          {legend: 'Lamps',name:'lamps', type: 'fieldset',fields:[

          {label:"Tungsten",type:"switch",options:["Off","On"],validate:[{type:"matches", value:"On", message:"Check Lamp Settings","conditions": [
            {
              "type": "matches",
              "value": "On"
            }
          ]}
        ]},
      ]},
      {legend: 'Spectrum/Peak detection',name:"detection", type: 'fieldset',fields:[
        {label:"Find and annotate up to ___ peaks",type:"number",min:1,step:1,max:2,validate:[{type:"matches",value:1, message:"Check Peak Annotation"}]},
        {label:"Data Type",type:"custom_radio",value:"Absorbance",options:["Absorbance","Transmittance"],validate:[{type:"matches",value:"Absorbance", message:"Check Data Type"}]},
        {label:"Display spectrum from (nm)",name:"from",type:"number",min:300,step:1,max:450,validate:[{type:"matches",value:380,message:"Check Display spectrum from"}]},
        {label:"Display spectrum to (nm)",name:"to",type:"number",min:700,step:1,max:750,validate:[{type:"matches",value:500,message:"Check Display spectrum to"}]},
      ]}
    ],
        validationFields2021:[

          {legend: 'Acquisition', type: 'fieldset',fields:[
            {label:"Wavelength range from (nm)",name:"from",type:"number",min:300,step:1,max:450,validate:[{type:"matches",value:500,message:"Check Wavelength range from"}]},
            {label:"Wavelength range to (nm)",name:"to",type:"number",min:700,step:1,max:750,validate:[{type:"matches",value:700,message:"Check Wavelength range to"}]},
            {label:"Integration time (s)",type:"number",value:0.25,min:0.25,step:0.25,max:2,validate:[{type:"matches",value:0.5,message:"Check Integration time"}]},
            {label:"Interval (nm)",type:"number",value:1,min:1,step:1,max:4,validate:[{type:"matches",value:1, message:"Check Interval"}]},
            {label:"Path Length (cm)",type:"number",value:0.5,min:0.5,step:0.5,max:1,validate:[{type:"matches",value:1, message:"Check Path Length"}]}
          ]},
          {legend: 'Lamps',name:'lamps', type: 'fieldset',fields:[
          //   {label:"Tungsten",type:"switch",options:["Off","On"],validate:[{type:"matches", value:"On", message:"Check Lamp Settings","conditions": [
          //     {
          //         "type": "test",
          //         "test": function(e){
          //           return ((e.owner.find({map:'acquisition.to'}).value >400) || (e.owner.find({map:'lamps.deuterium'}).value == "Off" && e.owner.find({map:'acquisition.from'}).value < 400 ));
          //         }
          //     }
          //   ]}
          // ]},
          //   {label:"Deuterium",type:"switch",options:["Off","On"],validate:[{type:"matches", value:"On", message:"Check Lamp Settings","conditions": [
          //     {
          //           "type": "test",
          //           "test": function(e){
          //             return ((e.owner.find({map:'acquisition.from'}).value <300) || (e.owner.find({map:'lamps.tungsten'}).value == "Off" && e.owner.find({map:'acquisition.to'}).value > 300 ));
          //           }
          //     }
          //   ]}
          // ]}
          {label:"Tungsten",type:"switch",options:["Off","On"],validate:[{type:"matches", value:"On", message:"Check Lamp Settings","conditions": [
            {
              "type": "matches",
              "value": "On"
            }
          ]}
        ]},
          {label:"Deuterium",type:"switch",options:["Off","On"],validate:[{type:"matches", value:"On", message:"Check Lamp Settings","conditions": [
            {
              "type": "matches",
              "value": "On"
            }
          ]}
        ]}
          ]},
          {legend: 'Spectrum/Peak detection',name:"detection", type: 'fieldset',fields:[
            {label:"Find and annotate up to ___ peaks",type:"number",min:1,step:1,max:2,validate:[{type:"matches",value:1, message:"Check Peak Annotation"}]},
            {label:"Data Type",type:"custom_radio",value:"Absorbance",options:["Absorbance","Transmittance"],validate:[{type:"matches",value:"Absorbance", message:"Check Data Type"}]},
            {label:"Display spectrum from (nm)",name:"from",type:"number",min:300,step:1,max:450,validate:[{type:"matches",value:500,message:"Check Display spectrum from"}]},
            {label:"Display spectrum to (nm)",name:"to",type:"number",min:700,step:1,max:750,validate:[{type:"matches",value:700,message:"Check Display spectrum to"}]},
          ]}
        ],
        fields:[
          {legend: 'Acquisition', type: 'fieldset',fields:[
            {label:"Wavelength range from (nm)",name:"from",type:"number",value:190,min:190,step:1,max:890,validate:[{type:"numeric"}]},
            {label:"Wavelength range to (nm)",name:"to",type:"number",value:300,min:300,step:1,max:1100,validate:[{type:"numeric"}]},
            {label:"Integration time (s)",type:"number",value:0.25,min:0.25,step:0.25,max:2},
            {label:"Interval (nm)",type:"number",value:1,min:1,step:1,max:4},
            {label:"Path Length (cm)",type:"number",value:0.5,min:0.5,step:0.5,max:1}
          ]},
          {legend: 'Lamps',name:'lamps', type: 'fieldset',fields:[
            {label:"Tungsten",type:"switch",options:["Off","On"]},
            {label:"Deuterium",type:"switch",options:["Off","On"]}
          ]},
          {legend: 'Spectrum/Peak detection',name:"detection", type: 'fieldset',fields:[
            {label:"Find and annotate up to ___ peaks",type:"number",value:1,min:1,step:1,max:4},
            {label:"Data Type",type:"custom_radio",value:"Absorbance",options:["Absorbance","Transmittance"]},
            {label:"Display spectrum from (nm)",name:"from",type:"number",value:290,min:290,step:1,max:890},
            {label:"Display spectrum to (nm)",name:"to",type:"number",value:300,min:300,step:1,max:900}
          ]}
        ]
      }
    
    )
    gform.collections.add('uvvis',[
      {"label":"Blank",value:"BLANK"}
    ])


    //ftir and uvvis need to run blank first