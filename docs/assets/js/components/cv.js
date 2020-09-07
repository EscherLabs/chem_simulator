instrument_components.push(
    {
        legend:'Cyclic Voltammeter',
        image:"CV1.png",
        description:"",
        chart:function(file, settings){
          $.get('assets/data/CV/CV_'+file+'_scan rate '+(settings.scan_rate*1000)+'.csv',function(e){
            globaltemp = _.csvToArray(e,{skip:5});
            keys = _.keys(globaltemp[0]);
            var x = []
            var y = []
            // _.each(globaltemp,function(i){
            //   x.push(i[keys[0]]);
            //   y.push(i[keys[1]]);
            // })

            _.each(globaltemp,function(i){
              if(parseFloat(i[keys[0]]) >= settings['e_begin'] && parseFloat(i[keys[0]]) <= settings['e_end']){
                x.push(i[keys[0]]);
                y.push(i[keys[1]]);
              }
            })
            var splitKey = _.maxBy(_.keys(x), function (o) {
               return parseFloat(x[o])||0; 
              });
            if(x[(parseInt(splitKey)-1)] !== x[(parseInt(splitKey)+1)]){
              splitKey++
            }
            y2 = _.reverse(y.splice(splitKey))
            var maxKey = _.maxBy(_.keys(y), function (o) {
                return parseFloat(y[o])||0; 
              });

            var minKey = _.minBy(_.keys(y2), function (o) {
                return parseFloat(y2[o])||0; 
              });
            c3chart =  c3.generate({
              bindto: '.chart',
              data: {
                  x: 'x',
                  // xFormat: format,
                  columns: [['x'].concat(x),[file].concat(y),[file+' '].concat(y2)], 
                  type: 'line'
              },
              // point: {
              //     show: false
              // },

          grid:{
            x:{
              lines: function(){
                if(minKey != 0 && maxKey != (y.length-1)){
                return [
                {value: x[maxKey], text: x[maxKey]+"V ( "+y[maxKey]+")", position: 'start'},
                {value: x[minKey], text: x[minKey]+"V ( "+y2[minKey]+")", position: 'start'},
                ]
                }else{return [];}
            }(),
            }
          },
              axis: {
                  x: {
                      label: keys[0]
},
                  y: {
                      label: keys[1]
                  }
              }
            });
            $('.c3-lines').hide();

            gform.instances.modal.trigger('close');
          })

        },
        events:[
          {
            "event":"save",
            "handler":function(e){
              $('.chart').html('')


if(!e.form.validate())return false;

//todo -- look at using gform validation for the following

              var errors = [];
              var data = e.form.get();
              if([20,50,100,150].indexOf((data.scan_rate*1000))== -1){
                errors.push('Check your Scan Rate')

              }
              if(data.e_begin < -0.25){
                errors.push('Check your E Begin Voltage')
              } 
              // // if(data.e_vertex1 !== -0.25){
              // //   errors.push('Check your E Vertex 1')
              // // }
              // if(data.e_end !== 0.4){
              //   errors.push('Check your E Vertex 2')
              // }
              if(data.e_step <= -0.001 || data.e_step >=0.005){
                errors.push('Check your E Step')
              }//.1 .05

              if(data.scans !== "1"){
                errors.push('Check your number of scans')
              }

              
             if(errors.length >1){
              $('.chart').append('<div class="alert alert-danger">Method Incorrect Please check your values</div>')
              return false;
             }
             if(errors.length == 1){
              $('.chart').append('<div class="alert alert-danger">'+errors[0]+'</div>')
              return false;
             }

              var modalForm = new gform({
                legend:"Sample Name",
                name:"modal",
                fields:[
                  {type:"smallcombo",name:"file",label:false,options:'cv'}
                ]
              }).on('save',function(form,e){

                globalfile = e.form.get('file');

                
                _.find(instrument_components,{legend:instruments['CV'].label}).chart(e.form.get('file'),form.get())

            }.bind(null,e.form)
          ).on('cancel',function(){gform.instances.modal.trigger('close');}).modal()}
          }
        ],
        name:"CV",
        fields:[
          {label:"Purge time (min)",name:"purge_time",type:"number",value:1,min:1,step:0.25,max:2,validate:[{type:'numeric'}]},
          {label:"Range",name:"range",type:"custom_radio",value:'1uA',options:['1uA','10uA','100uA','1000uA']},
          {label:"t-equilibration (sec)",name:"t_equilibration",type:"number",value:0,min:0,step:10,max:60,validate:[{type:'numeric'}]},
          {label:"E begin (V)",name:"e_begin",type:"number",value:-1,min:-1,step:0.05,max:0,validate:[{type:'numeric'}]},
          // {label:"E vertex1 (V)",name:"e_vertex1",type:"number",value:-1,min:-1,step:0.05,max:0,validate:[{type:'numeric'}]},
          {label:"E end",name:"e_end",type:"number",value:0,min:0,step:0.05,max:1,validate:[{type:'numeric'}]},
          {label:"E step (V)",name:"e_step",type:"number",value:0,min:0,step:0.01,max:0.05,validate:[{type:'numeric'}]},
          {label:"Scan rate (V/s)",name:"scan_rate",type:"number",value:0,min:0,step:0.01,max:0.25,validate:[{type:'numeric'}]},
          {label:"Number of scans",name:"scans",type:"custom_radio",value:1,options:[1,2]}
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