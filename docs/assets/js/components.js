instrument_components = [
  {
    // legend:'',
    name:"HOME",
    "actions":[],
    events:[
      {event:"save",handler:function(e){

      }}
    ],
    html:function(){
      debugger;
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

      return gform.renderString(`<div><div class="" style="margin:20px"><div class="input-group">
      <span class="input-group-addon"><i class="fa fa-filter"></i></span>    
      <label for="filter" class="sr-only">Filter</label>
      <input type="text" class="form-control filter" data-selector="{{filter.selector}}" data-score="{{filter.score}}" name="filter" placeholder="{{^filter.placeholder}}Filter...{{/filter.placeholder}}{{filter.placeholder}}">
      </div></div>
      `,{filter:{selector:"#home"}})+'<div id="home" style="background-image:url(assets/img/molecule_40.png);overflow:hidden;background-repeat:no-repeat;background-position:center;min-height:1000px">'+
      // '<center><img style="width:100px" src="assets/img/molecule.png"></a></center>'+
      
      gform.renderString(template,instruments["FTIR"])+
      gform.renderString(template,instruments["UV-Vis"])+
      gform.renderString(template,instruments["F"])+
      gform.renderString(template,instruments["GC-MS"])+
      gform.renderString(template,instruments["GC"])+
      gform.renderString(template,instruments["HPLC"])+
      gform.renderString(template,instruments["CV"])+
    '</div></div>';
  }()
    // fields:[
    //     {type:"output",label:false,value:'<div><img src="assets/img/UVVis1.jpg"></div>'}
    // ]
  },
      {
        legend:'Upload',
        name:"Upload",
        "actions":[{type:"save",label:"View",target:".gform-footer"}],
        events:[
          {event:"save",handler:function(e){
            var files = e.form.find('upload').el.querySelector('input').files

            // use the 1st file from the list
            f = files[0];
        
            var reader = new FileReader();
        
            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                  globdata = JSON.parse(e.target.result);

                   if(hash(globdata.name) !== globdata.check){
                    console.error("imposter")
                  }else{
                    globdata.data = _.map(globdata.data,function(i){
                      i.data = JSON.parse(i.data);
                      return i;
                    })
// _.each()

document.querySelector('.main #errors').innerHTML = "";
_.each(gform.instances,function(form){
  if(form.options.name !== "Upload"){
  form.destroy();
  }
})
_.each(globdata.data,function(instrument_component){
  el = gform.create(compontent);
  document.querySelector('.main #errors').append(el)

  myForm = new gform(_.extend({
    "actions":[{type:"save",label:"Run",target:".gform-footer"}],
    "data":instrument_component.data,
    "default": {
      "horizontal": true,edit:false
    },"horizontal": true
  },_.find(instrument_components, {name:instrument_component.name})),el.querySelector('.well'))

})


                    _.find(instrument_components,{legend:instruments[globdata.data[0].name].label}).chart(globdata.file,globdata.data[0].data.acquisition);
                  }
                };
              })(f);
        
              // Read in the image file as a data URL.
              reader.readAsText(f);

          }}
        ],
        fields:[
            {label:"Upload",type:"file"}
        ]
      }
  ]
   