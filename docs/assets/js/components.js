device_components = [
  {
    // legend:'',
    name:"HOME",
    "actions":[],
    events:[
      {event:"save",handler:function(e){

      }}
    ],
    html:function(){
      // var template = '<a href="#device={{device}}"><img style="width:300px" src="assets/img/{{image}}"></a>'
      // var template = '<a href="#device={{device}}"><div><img style="width:300px" src="assets/img/{{image}}"></div></a>'
      var template = `<div class="col-md-6 filterable">
        <a href="#device={{device}}">
        <div class="well device" style="overflow:hidden;">
          <img style="float:right;height:100px" src="assets/img/{{image}}">
          <span><h3>{{label}}</h3><p>{{description}}</p></span>
        </div>
        </a>
      </div>`;
      return gform.renderString(`<div><div class="row" style="margin:20px 0">
      <div class="col-md-9">
      <div class="input-group">
      <span class="input-group-addon"><i class="fa fa-filter"></i></span>    
      <label for="filter" class="sr-only">Filter</label>
      <input type="text" class="form-control filter" data-selector="{{filter.selector}}" data-score="{{filter.score}}" name="filter" placeholder="{{^filter.placeholder}}Filter...{{/filter.placeholder}}{{filter.placeholder}}">
      </div>
      </div>
      <div class="col-md-3">
      <a class="btn btn-success pull-right" href="#device=Upload"><i class="fa fa-upload"></i> Upload</a>
      </div>
      </div>
      `,{filter:{selector:"#home"}})+'<div id="home" style="background-image:url(assets/img/molecule_40.png);overflow:hidden;background-repeat:no-repeat;background-position:center;min-height:1000px">'+
      // '<center><img style="width:100px" src="assets/img/molecule.png"></a></center>'+
      _.reduce(devices,function(template,r,device){
        if(['Home','Upload'].indexOf(device.label) >=0)return r;
        return r+ gform.renderString(template,device);
      }.bind(null,template),"")+
    '</div></div>';
  }()
    // fields:[
    //     {type:"output",label:false,value:'<div><img src="assets/img/UVVis1.jpg"></div>'}
    // ]
  },
      {
        legend:'Upload',
        name:"Upload",
        // "actions":[{type:"save",label:"View",target:".gform-footer"}],
        html:'<div class="well" id="my-dropzone"></div>',
        actions:[],
        events:[
          {event:"success",handler:function(e){
            gform.types[e.field.type].dataURItoBlob(e.field.value.dataURI).text().then(text => {
              let uploadData = JSON.parse(text);
                if(hash(uploadData.name) !== uploadData.check){
                console.error("imposter")
                done(`Imposter`);
                return;
              }else{
                uploadData.data = _.map(uploadData.data,function(i){
                  i.data = JSON.parse(i.data);
                  return i;
                })
                resources.device = __.findDevice(uploadData.data[0].name)//__.findComponent(uploadData.data[0].name);
              
          //         el = __.renderCreate(compontent);

          //         $('.main >.row >.col-md-12 > .target').append(el);
                _.each(uploadData.data, function(device_component){
                  config = device_component.data
                  resources.form.primary = new gform(_.extend({
                    "actions":[],
                    "strict": false,
                    "name":"primary",
                    "data": config,
                    "default": {
                      "horizontal": true, edit:false
                    },"horizontal": true
                  }, __.findComponent(device_component.name)), '.form')
                })

                resources.chart.data = {
                  xs: {},
                  columns: [],
                  type: 'line',
                  onclick:__.findComponent(uploadData.data[0].name).pointClick,
                  // instance:resources.chart.instance
                }
                resources.data = uploadData.files;
                if(uploadData.file)resources.data = [__.findComponent(uploadData.data[0].name).formatFile(uploadData.file,config)];

                __.fetchExternalData(resources.data).then(result => {
                  resources.chart.waiting = __.yieldArray(result);
                  __.chartFile(resources.chart.waiting.next().value)
                })

                // _.find(device_components,{legend:devices[uploadData.data[0].name].label}).chart(uploadData.file,uploadData.data[0].data);
              }
            });
          }}
          // {event:"initialized",handler:function(e){
          //   // if(typeof myDropzone !== 'undefined')return;
          //   myDropzone = new Dropzone("#my-dropzone",{
          //     maxFilesize: 10, // Mb
          //     accept: localAcceptHandler,url:"#"
          //   ,
          //   init:function(){
          //   this._sendIntercept = function(file, options={}) {
          //     return new Promise((resolve,reject) => {
          //       if(!options.readType) {
          //         const mime = file.type;
          //         // const textType = a(_textTypes).any(type => {
          //         //   const re = new RegExp(type);
          //         //   return re.test(mime);
          //         // });
          //         options.readType = 'readAsText';//textType ? 'readAsText' : 'readAsDataURL';
          //       }
          //       let reader = new window.FileReader();

          //       reader.onload = () => {
          //         resolve(reader.result);
          //       };
          //       reader.onerror = () => {
          //         reject(reader.result);
          //       };
            
          //       // run the reader
          //       reader[options.readType](file);
          //     });
          //   }
          //   this.localSuccess = function(file,done) {
          //     _.each(gform.instances,function(form){
          //       if(form.options.name !== "Upload"){
          //         form.destroy();
          //       }
          //     })
          //     $('.main >.row >.col-md-8 > .target,.main >.row >.col-md-12 > .target').html('').removeClass('well').parent().removeClass('col-md-8').addClass('col-md-12')


          //     uploadData = JSON.parse(file.contents);

          //      if(hash(uploadData.name) !== uploadData.check){
          //       console.error("imposter")
          //       done(`Imposter`);
          //       return;
          //     }else{
          //       uploadData.data = _.map(uploadData.data,function(i){
          //         i.data = JSON.parse(i.data);
          //         return i;
          //       })
          //       // _.each()

          //       // document.querySelector('.main #errors').innerHTML = "";
                
          //       _.each(uploadData.data,function(device_component){
          //         el = __.renderCreate(compontent);

          //         $('.main >.row >.col-md-12 > .target').append(el);//.parent().removeClass('well')

          //         myForm = new gform(_.extend({
          //         "actions":[{type:"save",label:"Run",target:".gform-footer"}],
          //         "data":device_component.data,
          //         "default": {
          //           "horizontal": true,edit:false
          //         },"horizontal": true
          //         },_.find(device_components, {name:device_component.name})),el.querySelector('.form'))

          //       })


          //       _.find(device_components,{legend:devices[uploadData.data[0].name].label}).chart(uploadData.file,uploadData.data[0].data);
          //     }
          //     myDropzone.removeAllFiles()

          //     done();

          //   }
          // }});

          // }}
        ],
        fields:[
          {type:"base64_file","label":false,target:function(){return document.querySelector('#my-dropzone')}}
        ]
      }
  ]
   