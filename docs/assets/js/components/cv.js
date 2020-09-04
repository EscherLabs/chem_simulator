instrument_components.push(
    {
        legend:'Cyclic Voltammeter',
        img:"assets/img/CV1.png",
        description:"Here is a description of what this is maybe how it works, maybe some links to reference materials, or maybe some instructions",
        events:[
          {
            "event":"save",
            "handler":function(e){
              $('#chart').html('')


e.form.validate();
              var errors = [];
debugger;
              if([20,50,100,150].indexOf((e.form.get('scan_rate')*1000))== -1){
                
                $('#chart').append('<div class="alert alert-danger">Method Incorrect Please check your values</div>')
                return false;
              }
  // if(e.form.get('E begin (V)')){
    // debugger;
  // }
              /*
Purge time: 1-2 min
any range
any t-equil
E begin = -0.25
E vertex 1 = -0.25
E vertex 2 = 0.4
E step = 0.001 to 0.005
Scan rates of ONLY 0.020, 0.050, 0.100, and 0.150  V/s.
Number of scans: Only 1
              */
             
              var modalForm = new gform({
                legend:"Sample Name",
                fields:[
                  {type:"smallcombo",name:"file",label:false,options:'cv'}
                ]
              }).on('save',function(form,e){

                globalfile = e.form.get('file');
              $.get('assets/data/CV/CV_'+e.form.get('file')+'_scan rate '+(form.get('scan_rate')*1000)+'.csv',function(e){
                globaltemp = _.csvToArray(e,{skip:5});
                keys = _.keys(globaltemp[0]);
                var x = []
                var y = []
                _.each(globaltemp,function(i){
                  x.push(i[keys[0]]);
                  y.push(i[keys[1]]);
                })

                var maxKey = _.maxBy(_.keys(x), function (o) {
                   return parseFloat(x[o])||0; 
                  });

                y2 = _.reverse(y.splice(maxKey))
                var maxKey1 = _.maxBy(_.keys(y), function (o) {
                    return parseFloat(y[o])||0; 
                  });

                var maxKey2 = _.minBy(_.keys(y2), function (o) {
                    return parseFloat(y2[o])||0; 
                  });

                c3chart =  c3.generate({
                  bindto: '#chart',
                  data: {
                      x: 'x',
                      // xFormat: format,
                      columns: [['x'].concat(x),[modalForm.get('file')].concat(y),[modalForm.get('file')+' '].concat(y2)], 
                      type: 'line'
                  },
                  // point: {
                  //     show: false
                  // },

              grid:{
                x:{
                  lines: [
                    {value: x[maxKey1], text: x[maxKey1]+"V ( "+y[maxKey1]+")", position: 'start'},
                    {value: x[maxKey2], text: x[maxKey2]+"V ( "+y2[maxKey2]+")", position: 'start'},
                ],
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

                modalForm.trigger('close');
              })
  
            }.bind(null,e.form)
          ).on('cancel',function(){gform.instances.modal.trigger('close');}).modal()}
          }
        ],
        name:"CV",
        fields:[
          {label:"Purge time (min)",name:"purge_time",type:"number",value:1,min:1,step:0.25,max:2},
          {label:"Range",name:"range",type:"custom_radio",value:'1uA',options:['1uA','10uA','100uA','1000uA']},
          {label:"t-equilibration (sec)",name:"t_equilibration",type:"number",value:0,min:0,step:10,max:60},
          {label:"E begin (V)",name:"e_begin",type:"number",value:-1,min:-1,step:0.05,max:0},
          {label:"E vertex1 (V)",name:"e_vertex1",type:"number",value:-1,min:-1,step:0.05,max:0},
          {label:"E vertex2 (V)",name:"e_vertex2",type:"number",value:0,min:0,step:0.05,max:1},
          {label:"E step (V)",name:"e_step",type:"number",value:0,min:0,step:0.01,max:0.05},
          {label:"Scan rate (V/s)",name:"scan_rate",type:"number",value:0,min:0,step:0.01,max:0.25,validate:[{type:'numeric'}]},
          {label:"Number of scans",name:"scans",type:"custom_radio",value:1,options:[1,2]}
        ]
      }
)

gform.collections.add('cv', [
  'BLANK',
  'Standard 1, 2mM',
  'Standard 2, 4mM',
  'Standard 3, 6mM',
  'Standard 4, 8mM',
  'Unkown'
])