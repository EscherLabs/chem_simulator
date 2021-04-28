
downloadForm = function() {
    var fileOptions = [
        {label:"Configuration",value:"config"}
    ];
    if(resources.data.length){
        fileOptions.push({label:"Data File(s)",value:"data"});
    }
    if(document.querySelector('.chart.c3 svg') instanceof SVGElement){
        fileOptions.push({label:"Image",value:"image",show:false});
    }

    resources.form.modal = new gform({
    legend: "Download",
    name: "modal",
    fields: [{label:"Your name",name:"name",required:true},{show:(fileOptions.length>1),label:"Files",type:"radio",multiple:true,options:fileOptions,required:true}],
    actions: [{type:'cancel'},{type:'save',label:"<i class=\"fa fa-cogs\"></i> Download"}]
  }).
  on('save', function(e) {
    let files = e.form.get('files')

    //if we will have more than one file then use zip
    if(files.length >1 || (_.includes(files,'data') && resources.data.length>1)) __.openZip('Simulator_Files');//useZip = true;

    if(_.includes(files, 'config') || files.length==0) {
        __.download({
            data:{
                name: e.form.get('name'),
                version: '0.0.1',
                files: (_.map(resources.data,function(item){return _.pick(item,'label','url','keys','pick','min','max')}) || []),
                data: _.map(__.findDevice().components, function(component){
                    return {
                        name: component, 
                        data: JSON.stringify(resources.form.primary)
                    }
                }),
                check :hash(e.form.get('name'))
            },
            label:e.form.get('name') + '_' + config.device,
            extension:'json'
        })
    }

    if(_.includes(files,'data')){
        _.each(resources.data, function(file){
            __.download({
                label: file.label,
                data: file.content,
                extension:'csv'
            })
        })
    }

    if(_.includes(files, 'image')){
        inlineAllStyles();
        var temp = document.querySelector('.chart.c3 svg');
        if(_.isNull(temp))return;


        temp.prepend(gform.create('<rect width="100%" height="100%" fill="white" />'))
        canvg(document.querySelector('#canvas'), temp.outerHTML);

        // var svgElement = document.querySelector('.chart.c3 svg');
        // let {width, height} = svgElement.getBBox(); 
        // let clonedSvgElement = svgElement.cloneNode(true);
        // let outerHTML = clonedSvgElement.outerHTML,
        // blob = new Blob([outerHTML],{type:'image/svg+xml;charset=utf-8'})
        // let URL = window.URL || window.webkitURL || window;
        // let blobURL = URL.createObjectURL(blob);

        // let image = new Image();
        // image.onload = () => {
        //    let canvas = document.querySelector('#canvas');//document.createElement('canvas');
           
        //    canvas.width = width;
           
        //    canvas.height = height;
        //    let context = canvas.getContext('2d');
        //    // draw image in canvas starting left-0 , top - 0  
        //    context.drawImage(image, 0, 0, width, height );
        //   //  downloadImage(canvas); need to implement
        // };
        // image.src = blobURL;
        // let canvas = document.querySelector('#canvas');//document.createElement('canvas');
           
        // canvas.width = width;
        
        // canvas.height = height;
        // let context = canvas.getContext('2d');
        // // draw image in canvas starting left-0 , top - 0  
        // context.drawImage(image, 0, 0, width, height );


        __.download({
            url:document.getElementById("canvas").toDataURL("image/png"),
            label:'temp',
            extension:'png'
        })
    }
    __.download(moment().format('MM-DD_Hmmss')+'_simFiles')

    e.form.trigger('close');
  }).
  on('cancel',function(e){e.form.trigger('close');}).modal();
}


let resources = {
    chart: {regions:[]},
    file: {},
    form: {},
    data: [],
    files: [],
}
let state = {running:false}

function init(){
  if(status.skipInit){status.skipInit =false;return;}
  if(typeof resources.chart.instance !== 'undefined') {
    resources.chart.instance.destroy()
    delete resources.chart.instance;
  }
  
  config = QueryStringToHash(document.location.hash.substr(1) || '')
  $('li.active').removeClass('active')
  $('#'+config.device).addClass('active')
    
  document.querySelector('.main').innerHTML = "";
  _.each(gform.instances,function(form){
    form.destroy();
  })
  resources.device = __.findDevice();;

  _.each(resources.device.components,function(device_component){
    let component = __.findComponent(device_component);

    __.renderCreate(component.html, null, '.main')

    if(component.fields){
      __.renderCreate(component_template, component, '.main');

      resources.form.primary = new gform(_.extend({
        "actions": [
          {
            type:"save",
            label:"Run",
            target:".gform-footer"
          }],
        "strict": false,
        "name":"primary",
        "data": config,
        "default": {
          "horizontal": true
        },"horizontal": true
      }, component), '.form').on('save',function(){
        if(!_.isUndefined(config.config)){
          setHash()
        }
      })
    }

  })
}

_.each(devices, function(device,key) {
  __.renderCreate('<li id="{{.}}"><a href="#device={{.}}">{{.}}</a></li>', device, '.target ul.nav')
  __.renderCreate('<li id="{{.}}"><a href="#device={{.}}">{{.}}</a></li>', device, '#navbar ul.nav')
})
window.onhashchange = init;
init();
