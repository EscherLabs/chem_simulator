instrument_components.push(
    {
        legend:'Fourier Transform Infrared Spectrometer',
        events:[
          {
            "event":"save",
            "handler":function(e){
  
              var files = ["Background",
              "Cyclohexane reference",
              "Polystyrene standard",
              "Sample 1 in Cyclohexane"];
  
              var modalForm = new gform({
                legend:"Sample Name",
                fields:[
                  {type:"smallcombo",name:"file",label:false,options:files,value:"Background"}
                ]
              }).on('save',function(form,e){
  
                $.get('assets/data/ftir/'+e.form.get('file')+'.csv',function(e){
                  globaltemp = _.csvToArray(e,{skip:1});
                  keys = _.keys(globaltemp[0]);
                  var x = []
                  var y = ['Sample']
                  _.each(globaltemp,function(i){
                    debugger;
                    if(parseInt(i[keys[0]]) > gform.instances['FTIR'].get('sample_holder')['Range start (cm-1)'] && parseInt(i[keys[0]]) < gform.instances['FTIR'].get('sample_holder')['Range end (cm-1)']){
                      x.push(i[keys[0]]);
                      y.push(i[keys[1]]);
                    }
                  })
                  c3chart =  c3.generate({
                    bindto: '#chart',
                    data: {
                        x: 'x',
                        // xFormat: format,
                        columns: [['x'].concat(_.reverse(x)),y], 
                        type: 'line'
                    },
                    point: {
                        show: false
                    },
                    tooltip: {
                      format: {
                        title: function (x, index) { return x+'cm-1'; }
                      }
                    },
                    axis: {
                        x: {
                            tick: {
                                format(d) {
                                  return this.data.xs.Sample[this.data.xs.Sample.length-(1+this.data.xs.Sample.indexOf(d))]
                                },
                                values: function(start,end,interval){
                                  var temp = [];
                                  for(var i = start; i<=end; i+=interval){
                                  temp.push(i)
                                  }
                                  return temp;
                                }(400,4000,100)
                                
                            },
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
        name:"FTIR",
        sections:'tab',
        fields:[
          {legend: 'Sample Holder', type: 'fieldset',fields:[
            {name:"Number of Accumulations",type:"number",value:1,min:1,step:1,max:16},
            {name:"Range start (cm-1)",type:"number",value:360,min:360,step:10,max:8300},
            {name:"Range end (cm-1)",type:"number",value:820,min:820,step:10,max:4000},
            {name:"Resolution (cm-1)",type:"number",value:1,min:1,step:1,max:4},
            {name:"Interval (cm-1)",type:"number",value:1,min:1,step:1,max:4},
    
            {name:"Units",type:"custom_radio",value:"A",options:["A","T"]},
            {name:"Background",type:"custom_radio",value:"Air",options:["Air","Sample matrix"]},
          ]}
        ]
      }
    
    )