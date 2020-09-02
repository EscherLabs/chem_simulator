instrument_components.push(
    {
        legend:'Cyclic Voltammeter',
        events:[
          {
            "event":"save",
            "handler":function(e){
              debugger;
              if([20,50,100,150].indexOf(e.form.get('scan_rate'))== -1)return false;
              var files = [
                'BLANK',
                'Standard 1, 2mM',
                'Standard 2, 4mM',
                'Standard 3, 6mM',
                'Standard 4, 8mM',
                'Unkown'
  
              ];
              var modalForm = new gform({
                legend:"Sample Name",
                fields:[
                  {type:"smallcombo",name:"file",label:false,options:files}
                ]
              }).on('save',function(form,e){
              $.get('assets/data/cv/CV_'+e.form.get('file')+'_scan rate '+form.get('scan_rate')+'.csv',function(e){
                globaltemp = _.csvToArray(e,{skip:5});
                keys = _.keys(globaltemp[0]);
                var x = ['x']
                var y = [modalForm.get('file')]
                _.each(globaltemp,function(i){
                  x.push(i[keys[0]]);
                  y.push(i[keys[1]]);
                })
    
                c3chart =  c3.generate({
                  bindto: '#chart',
                  data: {
                      x: 'x',
                      // xFormat: format,
                      columns: [x,y], 
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
          ).modal()}
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