instrument_components.push(
    {
        legend:'Cyclic Voltammeter',
        events:[
          {
            "event":"save",
            "handler":function(e){
              $('#errors').html('')
              if([20,50,100,150].indexOf(e.form.get('scan_rate'))== -1){
                
                $('#errors').append('<div class="alert alert-danger">Method Incorrect Please check your values</div>')
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
              $.get('assets/data/CV/CV_'+e.form.get('file')+'_scan rate '+form.get('scan_rate')+'.csv',function(e){
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
                  // maxKey++;
                  debugger;
                  y2 = y.splice(maxKey)

                c3chart =  c3.generate({
                  bindto: '#chart',
                  data: {
                      x: 'x',
                      // xFormat: format,
                      columns: [['x'].concat(x),[modalForm.get('file')].concat(y),[modalForm.get('file')+'(reverse)'].concat(y2)], 
                      type: 'line'
                  },
                  point: {
                      show: false
                  },
                  axis: {
                      x: {
                          // type: 'timeseries',
                          // tick: {
                          //     format: format
                          // }
                          label: keys[0]
    
                      },
                      y: {
                          label: keys[1]
                      }
                  }
                });
                modalForm.trigger('close');
              })
  
            }.bind(null,e.form)
          ).on('cancel',function(){gform.instances.modal.trigger('close');}).modal()}
          }
        ],
        name:"CV",
        fields:[
          {name:"Purge time (min)",type:"number",value:1,min:1,step:0.25,max:2},
          {name:"Range",type:"custom_radio",value:'1uA',options:['1uA','10uA','100uA','1000uA']},
          {name:"t-equilibration (sec)",type:"number",value:0,min:0,step:10,max:60},
          {name:"E begin (V)",type:"number",value:-1,min:-1,step:0.05,max:0},
          {name:"E vertex1 (V)",type:"number",value:-1,min:-1,step:0.05,max:0},
          {name:"E vertex2 (V)",type:"number",value:0,min:0,step:0.05,max:1},
          {name:"E step (V)",type:"number",value:0,min:0,step:0.01,max:0.05},
          {name:"scan_rate",label:"Scan rate (V/s)",type:"number",value:0,min:0,step:0.01,max:0.25},
          {name:"Number of scans",type:"custom_radio",value:1,options:[1,2]}
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