instrument_components.push(
    {
        legend:'Fluorimeter',
        name:"F",
        image:"ls-45.jpg",
        chart:function(file, settings){

          $.get('assets/data/f/'+file+'.csv',function(file,e){
            debugger;
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
            $('.c3-lines').hide();
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
                  {type:"smallcombo",name:"file",label:false,options:'f'}
                ]
              }).on('save',function(form,e){
                globalfile = e.form.get('file');
                _.find(instrument_components,{legend:instruments['F'].label}).chart(e.form.get('file'))

              }.bind(null,e.form)
            ).on('cancel',function(){gform.instances.modal.trigger('close');}).modal()}
          }
          
        ],
        sections:'tab',
        fields:[
          {legend: 'Pre-Scan', type: 'fieldset',fields:[
            {name:"Excitation range from (nm)",type:"number",value:390,min:390,step:1,max:490},
            {name:"Excitation range to (nm)",type:"number",value:490,min:490,step:1,max:500},
            {name:"Emission range from (nm)",type:"number",value:400,min:400,step:1,max:740},
            {name:"Emission range to (nm)",type:"number",value:410,min:410,step:1,max:750},
            {name:"Scan Speed (nm/min)",type:"number",value:250,min:250,step:10,max:1000},
            {name:"Slit Width (nm)",type:"number",value:5,min:5,step:1,max:10},
            
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
          ]}
        ]
      }
    )

    gform.collections.add('f',[{label:"Emission 1",value:"Fluorescein_emission_1"},
    {label:"Emission 2",value:"Fluorescein_emission_2"},
    ])