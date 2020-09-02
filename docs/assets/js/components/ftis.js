instrument_components.push(
    {
        legend:'Fourier Transform Infrared Spectrometer',
        chart:function(file, settings){

          $.get('assets/data/ftir/'+file+'.csv',function(file,e){
            globaltemp = _.csvToArray(e,{skip:1});
            keys = _.keys(globaltemp[0]);
            var x = []

            //herer eist asdfwe
            var y = [file]
            _.each(globaltemp,function(i){
              if(parseInt(i[keys[0]]) >= gform.instances['FTIR'].get('sample_holder')['Range start (cm-1)'] && parseInt(i[keys[0]]) <= gform.instances['FTIR'].get('sample_holder')['Range end (cm-1)']){
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
                          format(d) {
                            return this.data.xs[_.keys(this.data.xs)[0]][this.data.xs[_.keys(this.data.xs)[0]].length-(1+this.data.xs[_.keys(this.data.xs)[0]].indexOf(d))]
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
            gform.instances.modal.trigger('close');
          }.bind(null,file))
        },
        events:[
          {
            "event":"save",
            "handler":function(e){
              var modalForm = new gform({
                legend:"Sample Name",
                name:"modal",
                fields:[
                  {type:"smallcombo",name:"file",label:false,options:'ftir',value:"Background"}
                ]
              }).on('save',function(form,e){
                globalfile = e.form.get('file');
                _.find(instrument_components,{legend:instruments['FTIR'].label}).chart(e.form.get('file'))

              }.bind(null,e.form)
            ).on('cancel',function(){gform.instances.modal.trigger('close');}).modal()}
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

    gform.collections.add('ftir',["Background",
    "Cyclohexane reference",
    "Polystyrene standard",
    "Sample 1 in Cyclohexane"])