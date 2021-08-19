var QueryStringToHash = function(query) {
    var query_string = {};
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      pair[0] = decodeURIComponent(pair[0]);
      pair[1] = decodeURIComponent((pair[1] || "").split('+').join(' '));
        // If first entry with this name
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = pair[1];
        // If second entry with this name
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [ query_string[pair[0]], pair[1] ];
        query_string[pair[0]] = arr;
        // If third or later entry with this name
      } else {
        query_string[pair[0]].push(pair[1]);
      }
    } 
    return query_string;
  };
//   _.mixin({
//     score: function(base, abbr, offset) {
  
//       offset = offset || 0;
      
//       if(abbr.length === 0) return 0.9;
//       if(abbr.length > base.length) return 0.0;
      
//       for (var i = abbr.length; i > 0; i--) {
//         var sub_abbr = abbr.substring(0,i);
//         var index = base.indexOf(sub_abbr);
        
//         if(index < 0) continue;
//         if(index + abbr.length > base.length + offset) continue;
        
//         var next_string = base.substring(index+sub_abbr.length);
//         var next_abbr = null;
        
//         if(i >= abbr.length) {
//           next_abbr = '';
//         } else {
//           next_abbr = abbr.substring(i);
//         }
//         var remaining_score   = _.score(next_string, next_abbr,offset+index);
        
//         if (remaining_score > 0) {
//           var score = base.length-next_string.length;
          
//           if(index !== 0) {     
//             var c = base.charCodeAt(index-1);
//             if(c==32 || c == 9) {
//               for(var j=(index-2); j >= 0; j--) {
//                 c = base.charCodeAt(j);
//                 score -= ((c == 32 || c == 9) ? 1 : 0.15);
//               }
//             } else {
//               score -= index;
//             }
//           }
          
//           score += remaining_score * next_string.length;
//           score /= base.length;
//           return(score);
//         }
//       }
//       // return(0.0);
//         return(false);
//     }
//   })

  function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return 'f'+uuid.split('-').join('').split(' ').join('');
};

_.mixin({
  score: function(base, abbr, offset) {

    offset = offset || 0; // TODO: I think this is unused... remove
    
    if(abbr.length === 0) return 0.9;
    if(abbr.length > base.length) return 0.0;
    
    for (var i = abbr.length; i > 0; i--) {
      var sub_abbr = abbr.substring(0,i);
      var index = base.indexOf(sub_abbr);
      
      if(index < 0) continue;
      if(index + abbr.length > base.length + offset) continue;
      
      var next_string = base.substring(index+sub_abbr.length);
      var next_abbr = null;
      
      if(i >= abbr.length) {
        next_abbr = '';
      } else {
        next_abbr = abbr.substring(i);
      }
      // Changed to fit new (jQuery) format (JSK)
      var remaining_score   = _.score(next_string, next_abbr,offset+index);
      
      if (remaining_score > 0) {
        var score = base.length-next_string.length;
        
        if(index !== 0) {     
          var c = base.charCodeAt(index-1);
          if(c==32 || c == 9) {
            for(var j=(index-2); j >= 0; j--) {
              c = base.charCodeAt(j);
              score -= ((c == 32 || c == 9) ? 1 : 0.15);
            }
          } else {
            score -= index;
          }
        }
        
        score += remaining_score * next_string.length;
        score /= base.length;
        return(score);
      }
    }
    // return(0.0);
      return( false );
  },

  csvToArray: function(csvString,options) {
    debugger;
    options = _.extend({skip:0},options)
    var trimQuotes = function (stringArray) {
      if(stringArray == null)return [];
      for (var i = 0; i < stringArray.length; i++) {
          // stringArray[i] = _.trim(stringArray[i], '"');
          if(stringArray[i][0] == '"' && stringArray[i][stringArray[i].length-1] == '"'){
            stringArray[i] = stringArray[i].substr(1,stringArray[i].length-2)
          }
          stringArray[i] = stringArray[i].split('""').join('"')
      }
      return stringArray;
    }
    var csvRowArray    = csvString.split('﻿')[0].split(/\n/);
    csvRowArray.splice(0,options.skip);
    
    // csvRowArray.shift()
    var keys = (options.keys)?options.keys:trimQuotes(csvRowArray.shift().match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g));
    var objectArray     = [];
    
    while (csvRowArray.length) {
        var rowCellArray = trimQuotes(csvRowArray.shift().match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g));
        if(rowCellArray.length){
          var rowObject    = _.zipObject(keys, rowCellArray);
          objectArray.push(rowObject);
        }
    }
    return(objectArray);
  },
  csvify: function(data, columns, title){

    var csv = '"'+_.map(columns,'label').join('","')+'"\n';
    labels = _.map(columns,'name')
    var empty = _.zipObject(labels, _.map(labels, function() { return '';}))
    csv += _.map(data,function(d){
        return JSON.stringify(_.map(_.values(_.extend(empty,_.pick(d,labels))),function(item){
          if(typeof item == 'string'){
            return item.split('"').join('""');
          }else{return item}
        }))
        //return JSON.stringify(_.values(_.extend(empty,_.pick(d,labels))))
    },this)
    .join('\n') 
    .replace(/(^\[)|(\]$)/mg, '')
    // .split('\"').join("")
  
    var link = document.createElement("a");
    link.setAttribute("href", 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    link.setAttribute("download", (title||"GrapheneDataGrid")+".csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
    return(true);
  }

});


function processFilter(options){
  options = options || {};
	var	currentTarget = options.currentTarget || this.currentTarget;
	var collection;
	if(this.selector){
		collection = $(this.selector).find('.filterable')
	}else{
		collection = $('.filterable');
	}
	collection.each(
	function(){
    if(_.score($(this).text().replace(/\s+/g, " ").toLowerCase(), $(currentTarget).val().toLowerCase() ) > ($(currentTarget).data('score') || 0.40)){
      $(this).removeClass('hidden');
		}else{
			$(this).addClass('hidden');
		}
	});
}

filterTimer = null;
$('body').on('keyup','[name=filter]', function(event){
	this.currentTarget = event.currentTarget;
	this.selector = $(this).data('selector');
	if(!$(this).hasClass("delay")){
		processFilter.call(this);
	}else{
  	clearTimeout(filterTimer);
  	filterTimer=setTimeout($.proxy(processFilter, this), 300);
	}
});

 
function localAcceptHandler(file, done) {
  this._sendIntercept(file).then(result => {
    file.contents = result;
    if(typeof(this.localSuccess) === 'function') {
      this.localSuccess(file, done);
    } else {
      done(); // empty done signals success
    }
  }).catch(result => {
    if(typeof(this.localFailure) === 'function') {
      file.contents = result;
      this.localFailure(file, done);
    } else {
      if(typeof(this.localFailure) === 'string') {
        done(this.localFailure);
      }else{
        done(`Failed to upload file ${file.name}`);
        console.warn(file);
      }
    }
  });
}Dropzone.autoDiscover = false;

var inlineAllStyles = function() {
  $('defs').remove();
  var chartStyle, selector;
  // Get rules from c3.css
  for (var i = 0; i <= document.styleSheets.length - 1; i++) {
      if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf('c3.min.css') !== -1) {
          if (document.styleSheets[i].rules !== undefined) {
              chartStyle = document.styleSheets[i].rules;
          } else {
              chartStyle = document.styleSheets[i].cssRules;
          }
      }

  }
  if (chartStyle !== null && chartStyle !== undefined) {
      // SVG doesn't use CSS visibility and opacity is an attribute, not a style property. Change hidden stuff to "display: none"
      var changeToDisplay = function() {
          if ($(this).css('visibility') === 'hidden' || $(this).css('opacity') === '0') {
              $(this).css('display', 'none');
          }
      };
      // Inline apply all the CSS rules as inline
      for (i = 0; i < chartStyle.length; i++) {

          if (chartStyle[i].type === 1) {
              selector = chartStyle[i].selectorText;
              styles = makeStyleObject(chartStyle[i]);
              $('svg *').each(changeToDisplay);
              $(selector).not($('.c3-chart path')).css(styles);
          }
          $('.c3-chart path')
              .filter(function() {
                  return $(this).css('fill') === 'none';
              })
              .attr('fill', 'none');

          $('.c3-chart path')
              .filter(function() {
                  return !$(this).css('fill') === 'none';
              })
              .attr('fill', function() {
                  return $(this).css('fill');
              });
      }
  }
  let nodes = document.querySelectorAll('.c3-chart-lines .c3-circles');
  for (var i = 0, len = nodes.length; i < len; i++) {

      _.each(nodes[i].children,function(node){
        node.style.fill = [
          "rgb(31, 119, 180)",
          "rgb(255, 127, 14)",
          "rgb(44, 160, 44)",
          "rgb(214, 39, 40)",
          "rgb(148, 103, 189)",
          "rgb(140, 86, 75)"
        ][i];
      })
      $('.c3-legend-item-tile')[i].style.stroke = [
        "rgb(31, 119, 180)",
        "rgb(255, 127, 14)",
        "rgb(44, 160, 44)",
        "rgb(214, 39, 40)",
        "rgb(148, 103, 189)",
        "rgb(140, 86, 75)"
      ][i];
  }

};



// Create an object containing all the CSS styles.
// TODO move into inlineAllStyles
var makeStyleObject = function(rule) {
  var styleDec = rule.style;
  var output = {};
  var s;
  for (s = 0; s < styleDec.length; s++) {
      output[styleDec[s]] = styleDec[styleDec[s]];
  }
  return output;
};

function getBase64String(dataURL) {
  var idx = dataURL.indexOf('base64,') + 'base64,'.length;
  return dataURL.substring(idx);
}

hash = function(s){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

const __ = (function(){
  let actionBuffer = [];
  let timer = null;
  let jsZip = null;
  let folder;
  let api = {
    schedule: function (actions, opts){
      let options = _.extend({period:1000},opts);
      actionBuffer = actionBuffer.concat(actions||[]);
      if(timer == null) {
        timer = setInterval(function() {
          if(actionBuffer.length) {
            if(typeof actionBuffer[0] == "function") {
              actionBuffer.shift().call(this)
            } else {
              actionBuffer.shift()
            }
          }
          if(!actionBuffer.length) {
            clearInterval(timer);
            timer = null;
          }
        }, options.period)
      }
      return timer;
    },
    renderCreate: function(string, data, target){
      if(typeof string == 'undefined' || !string)return false;
    
      const el = gform.create(gform.renderString(string, data||{}));
      if(typeof target !== 'undefined' && document.querySelector(target) !== null){
        document.querySelector(target).append(el);
      }
      return el;
    },
    findDevice: function(device) {
      return devices[device||config.device||"HOME"]
    },
    findComponent: function(component) {
      if(typeof resources.device!== 'undefined' && resources.device.components.length && typeof component == 'undefined')component= resources.device.components[0];
      return _.find(device_components, {name:component||"HOME"})
    },
    openZip:function(folderName){
      jsZip = new JSZip();
      folder = jsZip.folder(folderName);
    },
    processData:(data, file)=>{
      file.keys = file.keys||_.keys(data[0]);
      if(file.split){
        file.keys[2] = file.keys[0]+ ' ';
        file.keys[3] = file.keys[1]+ ' ';
      }
      let keys = file.keys;
      let x =[];
      let y = [];
      data.forEach(element => {
        if(typeof element[keys[0]] !== 'undefined' && typeof element[keys[1]] !== 'undefined'){

          let val = parseFloat(element[keys[0]]);
          if((typeof file.min == 'undefined' || val >= file.min) && (typeof file.max == 'undefined' || val <= file.max)){
              x.push(element[keys[0]]);
              y.push(element[keys[1]]);
            
          }
        }
      });
      x = (__.component.reverse)?_.reverse(x):x;
      if(file.split){
        let splitKey = _.maxBy(_.keys(x), function (o) {
          return parseFloat(x[o])||0; 
        });
        if(x[(parseInt(splitKey)-1)] !== x[(parseInt(splitKey)+1)]){
          splitKey++
        }
        x2 = _.reverse(x.splice(splitKey))
        y2 = _.reverse(y.splice(splitKey))
      }
      return x.map((element, index) => {
        let obj = {}
        obj[keys[0]] = element;
        obj[keys[1]] = y[index];
        if(file.split && typeof x2[index] !== 'undefined' ){
          obj[keys[2]] = x2[index];
          obj[keys[3]] = y2[index];
        }
        return obj;
      })
    },
    download: function(options){
      if(typeof options == 'string'){
        if(jsZip !== null){
          jsZip.generateAsync({type:"blob"}).then(function (content) {
              content = URL.createObjectURL(content);
              __.download({url:content, label: options, extension: "zip"});
              jsZip = null;
          });
        }
        return;
      }
      if(typeof options.data == 'object'){
        options.data = JSON.stringify(options.data)
      }
      if(typeof options.data !== 'string' && typeof options.url !== 'string'){
        console.error("Download data must be string")
        return false;
      }
      
      switch(options.extension){
        // case 'svg':
        //   options.url = "data:image/svg+xml;charset=utf-8,";
        //   break;
        case 'png':
          options.url = options.url||"data:image/png;charset=utf-8,"
          break;
        case 'json':
          options.url = options.url||"data:application/json;charset=utf-8,"
          break;
          case 'csv':
          options.url = options.url||"data:text/csv;charset=utf-8,"
          break;
        default:
          options.extension = options.extension||'json'
          options.url = options.url||"";
      }
      let fileName =  (options.label||"data")+'.'+options.extension;


      if(typeof jsZip == "undefined" || jsZip == null || options.extension == 'zip'){
        var link = document.createElement("a");
        link.setAttribute("href", (typeof options.data !== 'undefined' && options.data.indexOf('data:')!== 0)?options.url + encodeURIComponent(options.data):options.url);
    
        link.setAttribute("download", fileName);
    
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);
        return(true);
      }else{
        folder.file(fileName, (options.data)?btoa(options.data):getBase64String(options.url), {base64 : true});
      }
    },fetchExternalData: files => {
      return Promise.all(
        files.map(file => fetch(file.url, {
          method: 'get',
          headers: {
              'content-type': 'text/csv;charset=UTF-8',
              //'Authorization': //in case you need authorisation
          }
      }))
      )
      .then(
        responses => Promise.all(
          responses.map(response => {
            return response.text();
          })
        )
      ).then(results =>
        results.reduce((files, result, idx) => {
          files[idx].data = __.processData(_.csvToArray(result, files[idx]),files[idx]);
          files[idx].content = result;
          return files;
        }, files)
      );
    },yieldArray: function* (data){
      yield* data;
    },chartFiles: files => {

    },
    //check if attributes is set on component or is overridden via config options
    attr:(attr,defaultVal, activeComponent, overRide)=> (config[attr] !== (overRide||"false") && typeof (activeComponent||__.component)[attr] !== 'undefined')?(activeComponent||__.component)[attr]:defaultVal,
    chartFile: (file, fileIndex=0) => {
        let chart = resources.chart;
        let columns = chart.data.columns;
        let keys = file.keys;
        let run = resources.form.primary.find('run');
        const activeComponent = __.component;

        if(typeof chart.data.xs[file.label] == 'undefined') {
          chart.data.xs[file.label] = "x"+gform.getUID()
          chart.data.xs[file.label+' '] = "x"+gform.getUID()
          chart.data.columns.push([chart.data.xs[file.label]]);
          chart.data.columns.push([file.label]);
          if(file.split) {
            chart.data.columns.push([chart.data.xs[file.label+' ']]);
            chart.data.columns.push([file.label+' ']);
          }
        }

        let settings = _.defaultsDeep({},activeComponent.chartConfig,{
          zoom:{enabled: true,onzoom: () => {  
            let regions = d3.selectAll(".chart .c3-region")._groups[0];  
            regions.forEach(regionElement => {
                let region = d3.select(regionElement);
                let rectangle = d3.select(regionElement).select("rect");
                rectangle.transition().duration(0).attr('width', region.attr('width'));
                rectangle.transition().duration(0).attr('x', region.attr('x'));
            });
        }},
          bindto: '.chart',
          // transition: {
          //   duration: 0
          // },
          data: chart.data,
          point: {
              show: __.attr('points', true, null, "on")
          },
          axis: {
              x: {
                tick: {
                  format(d) {
                    // debugger;
                    // if(this.data.targets[0].values.length){
                    //data = this.data.xs[_.keys(this.data.xs)[0]][this.data.xs[_.keys(this.data.xs)[0]]
                    let data = [];
                    if(typeof __.component.tickValues == 'function'){
                      data = __.component.tickValues();
                    }else{
                      data = __.component.chartConfig.axis.x.tick.values;
                    }
                      var result = (__.component.reverse)? data[data.length-(1+data.indexOf(d))] :null;
                      if(!result){
                        // let serarch =
                        // resources.chart.zooms[0]

                        let index = this.data.xs[_.keys(this.data.xs)[0]].indexOf(d);

                        result = (__.component.reverse)?
                          (resources.chart.zooms.length)?
                            resources.chart.zooms[0].offsets[index-1]:

                            this.data.xs[_.keys(this.data.xs)[0]].reverse()[index]
                          // this.data.xs[_.keys(this.data.xs)[0]][this.data.xs[_.keys(this.data.xs)[0]].length-(1+index)]
                        :d;
                        // result = this.data.xs[_.keys(this.data.xs)[0]].reverse()[index]; 
                      }else{
                        result +=(resources.data[0].max-resources.data[0].min)%100;
                      }
                   return result;
                      // }else{
                    //   var data = __.component.chartConfig.axis.x.tick.values;
                      // return (__.component.reverse)? data[data.length-(1+data.indexOf(d))] :d;


                    // }
                  }
                },
                  label: keys[0]
              },
              y: {
                  label: keys[1]
              }
          },
        });
        if(typeof __.component.tickValues == 'function'){
          settings.axis.x.tick.values = __.component.tickValues();
        }
        chart.instance =  c3.generate(settings);

        $('.c3-lines').toggle(!activeComponent.hideLines);

        state.running = true;
        if(run)run.update({label:"<i class=\"fa fa-times\"></i> Stop","modifiers": "btn btn-danger"});

        if(typeof chart.points == 'undefined') chart.points = __.yieldArray(file.data);
        
        mycaller = () => {
          let point = chart.points.next();
          if(!point.done){
            let index = fileIndex*2*((file.split||0)*2);
            columns[index].push(point.value[keys[0]]);
            columns[index+1].push(point.value[keys[1]]);
            if(file.split){
              debugger;
              if(typeof point.value[keys[2]] !== 'undefined'){
                columns[index+2].push(point.value[keys[2]]);
                columns[index+3].push(point.value[keys[3]]);
              }
            }
            if(state.running){
            
              if(__.attr('animate',0,activeComponent)){

                chart.instance.load(chart.data)

                $('.c3-lines').toggle(!activeComponent.hideLines);

                setTimeout(mycaller, __.attr('animate',0,activeComponent));
              }else{
                mycaller();
              }
            }
          }else{
            file = chart.waiting.next();
            if(state.running &&  !file.done){
              delete chart.points;
              __.chartFile(file.value, ++fileIndex)
            }else{
              if(!__.attr('animate',0,activeComponent)){                
                chart.instance.load(chart.data);
                if(typeof activeComponent.post == "function"){
                  activeComponent.post();
                };
                $('.c3-lines').toggle(!activeComponent.hideLines);
              }
              delete chart.points;
              if(run)run.update({label:"Run","modifiers": "btn btn-success"});
              state.running = false;
            }
          }
        }
        mycaller();
        if(typeof gform.instances.modal !== 'undefined')gform.instances.modal.trigger('close');
      },
      validate: (fields) => {
        let testForm = new gform({fields:fields, data:resources.form.primary.get()})
        let errors;
        if((config.validate !== "false") && !testForm.validate(true)){
          errors = _.uniq(_.values(_.map(testForm.filter({valid:false}), 'errors')));
          if(errors.length>1){
            console.log(errors)
            $('.chart').append('<div class="alert alert-danger">Method Incorrect Please check your values</div>')
          }else{
            $('.chart').append('<div class="alert alert-danger">'+errors[0]+'</div>')
          }
        }
        testForm.destroy();
        return errors||false;
      }

  }
  Object.defineProperty(api, "component", {
    get: () => _.find(device_components, {name:(typeof resources.device!== 'undefined' && resources.device.components.length)?resources.device.components[0]:"HOME"}),
    enumerable: true
  });
  return api;
  }())
  

const component_template = `<div class="row">
<div class="col-md-4 form-horizontal" style="">{{#preform}}<div class="well" id="preform"></div>{{/preform}}<img id="preview" src="" /><div class="well form" style="overflow:hidden"></div></div>
<div class="col-md-8" style="">
  {{#image}}<div class="well" style="overflow:hidden">
    <div><img style="float:right;height:150px" src="assets/img/{{image}}"></div>
    <span><h3>{{legend}}</h3><p>{{{description}}}</p></span>
  </div>{{/image}}
  <div class="well target" style="height:550px;">
    <div class="chart"></div>
  </div>
</div>
</div>
`;

function setHash(params) {
status.skipInit = true;
if(typeof params !== 'undefined') {
config = $.param(_.extend(config,params));
resources.form.set(config)
}else{
config = $.param(_.reduce(resources.form.primary.get(), function(config, item, key){
  if(typeof item == "object"){
    config = _.reduce(item, function(config, _item, _key){
      config[_key] = _item;
      return config;
    }, config)
    delete config[key];
  }else{
    config[key] = item;
  }
  return config;
}, config));
}
location.hash = config;
config = QueryStringToHash(document.location.hash.substr(1) || '')
return config;
}


//gform extensions

gform.types['file'] = gform.types['text'] 

gform.types['number']= _.extend({}, gform.types['input'],{
  get:function(){
    return parseFloat(this.el.querySelector('input[name="' + this.name + '"]').value);
  },
  render: function(){
    return gform.render(this.type, this).split('value=""').join('value="'+this.value+'"')
  }
});
gform.types['save'].setLabel =function(){};



var mime_type_icon_map = {
  // Media
  image: "fa-file-image-o",
  audio: "fa-file-audio-o",
  video: "fa-file-video-o",
  // Documents
  "application/pdf": "fa-file-pdf-o",
  "application/msword": "fa-file-word-o",
  "application/vnd.ms-word": "fa-file-word-o",
  "application/vnd.oasis.opendocument.text": "fa-file-word-o",
  "application/vnd.openxmlformats-officedocument.wordprocessingml":
    "fa-file-word-o",
  "application/vnd.ms-excel": "fa-file-excel-o",
  "application/vnd.openxmlformats-officedocument.spreadsheetml":
    "fa-file-excel-o",
  "application/vnd.oasis.opendocument.spreadsheet": "fa-file-excel-o",
  "application/vnd.ms-powerpoint": "fa-file-powerpoint-o",
  "application/vnd.openxmlformats-officedocument.presentationml":
    "fa-file-powerpoint-o",
  "application/vnd.oasis.opendocument.presentation": "fa-file-powerpoint-o",
  "text/plain": "fa-file-text-o",
  "text/html": "fa-file-code-o",
  "application/json": "fa-file-code-o",
  // Archives
  "application/gzip": "fa-file-archive-o",
  "application/zip": "fa-file-archive-o"
}
gform.stencils.base64_file = `
  <style>
    .files .badge{position:absolute;right:10px;bottom:10px;overflow:hidden;text-overflow:ellipsis;max-width:50%}
    .files .badge:hover{max-width:fit-content}
    </style>
  <div class="row clearfix form-group {{modifiers}}" data-type="{{type}}">
    {{>_label}}
    {{#label}}
    {{^horizontal}}<div class="col-md-12">{{/horizontal}}
    {{#horizontal}}<div class="col-md-8">{{/horizontal}}
    {{/label}}
    {{^label}}
    <div class="col-md-12">
    {{/label}}
      {{#pre}}<div class="input-group col-xs-12"><span class="input-group-addon">{{{pre}}}</span>{{/pre}}
      {{^pre}}{{#post}}<div class="input-group">{{/post}}{{/pre}}
        {{#multiple}}
        <small class="count text-muted pull-left" style="display:block;text-align:left;margin:5px">0/{{max}}</small>
  
        <div style="overflow:hidden;margin-bottom: 10px;"><div class="btn-group pull-right" role="group" aria-label="...">
          <button type="button" class="btn btn-danger gform-clear-all" {{^value}}disabled{{/value}}><i class="fa fa-times"></i> Clear</button>
        </div></div>
        {{/multiple}}
        <div class="dropzone dz-clickable" id="{{id}}"><div class="dz-message">Drop files here to upload</div>
        </div>

        <ul class="files list-group" style="border: none;margin: 0;padding: 0;min-height:0">
        </ul>
      {{#post}}<span class="input-group-addon">{{{post}}}</span></div>{{/post}}
      {{^post}}{{#pre}}</div>{{/pre}}{{/post}}
  
      {{>_addons}}
      {{>_actions}}
    </div>
  </div>
  `;
  
  gform.stencils.base64_file_preview = `<li class="list-group-item ">
    <div><div class="btn-group pull-right" role="group" aria-label="...">
          <button type="button" class="btn btn-danger gform-remove" title="Remove"><i class="fa fa-times"></i></button>
          <button type="button" class="btn btn-info gform-replace" title="Replace"><i class="fa fa-refresh"></i></button>
        </div></div>
        <span class="badge">{{name}}</span>
    <div style="background: #eee;text-align: center;line-height: 120px;border-radius: 20px;overflow: hidden;width: 120px;height: 120px;">{{#icon}}
      <i class="fa {{{icon}}} fa-3x" style="padding-top: 4px;"></i>
      {{/icon}}{{^icon}}<img data-dz-thumbnail /></div>\n {{/icon}} </div></li>`,
  
  Dropzone.autoDiscover = false;
  gform.types.base64_file = _.extend({}, gform.types['input'], gform.types['collection'],{
    focus: function() {
      // var e = this.name;
      // this.multiple && (e += "[]"),
      // this.el.querySelector('[name="' + e + '"]').focus()
  },
  defaults:{format:{uri: '{{{name}}}'}},
    dataURItoBlob:function(dataURI) {
        'use strict'
        var byteString, 
            mimestring 
  
        if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
          byteString = atob(dataURI.split(',')[1])
        } else {
          byteString = decodeURI(dataURI.split(',')[1])
        }
  
        mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
        var content = new Array();
        for (var i = 0; i < byteString.length; i++) {
            content[i] = byteString.charCodeAt(i)
        }
  
        return new Blob([new Uint8Array(content)], {type: mimestring});
    },
    updateStatus:function(silent){
      if(!silent)this.trigger('input',this)
      if(this.multiple)this.el.querySelector('.gform-clear-all').disabled = !this.Dropzone.files.length;
  
      if(this.Dropzone.files.length>=(this.multiple?this.limit:1)){
        this.Dropzone.disable();
        gform.addClass(this.el.querySelector('.dropzone'),'hidden')
      }else{
        this.Dropzone.enable();
        gform.removeClass(this.el.querySelector('.dropzone'),'hidden')
      }
      if(this.el.querySelector('.count') != null){
        var text = this.value.length;
        if(this.limit>1){text+='/'+this.limit;}
        this.el.querySelector('.count').innerHTML = text;
      }
  
    },
    set:function(value){
      if(typeof value !== 'object')return;
      isDataURLregex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
      if(this.multiple){
        if(typeof value == 'object' && !_.isArray(value)){
          value = [value];
        }
        value=this.value = value||[];
      }else{
        value=this.value = value||{};
      }
      var _this = this;
      _.each(((this.multiple)?value:[value]),function(value){
        if(!_.isEmpty(value) ){
          if(typeof value.dataURI == "string" && !!value.dataURI.match(isDataURLregex)){
            var mockFile = gform.types.base64_file.dataURItoBlob(value.dataURI,value.name);
            // mockFile.contents = value.dataURI;
            mockFile.name = value.name;
            _this.Dropzone.addFile( mockFile);
            
          }else if(typeof value == "object"){
            var mockFile = value;
            mockFile.name = value.name||value.dataURI;
            _this.Dropzone.displayExistingFile(mockFile, gform.m(_this.format.uri, value) ) ;
            _this.Dropzone.files.push(mockFile); 
          }
        }
      })
    },
    get: function() {
      if(this.Dropzone.files.length){
        var val = _.reduce(this.Dropzone.files,function(obj,file){
          if(file instanceof Blob ){
            var temp = _.pick(file, 'type', 'name', 'dataURI')
            temp.dataURI = temp.dataURI;//||file.contents;
            temp.name = temp.name||file.upload.uuid;
          }else{
            var temp = _.pick(file, 'name', 'type')
            temp.dataURI = file.dataURL;
          }
          obj.push(temp)
          return obj;
        },[])
        if(this.multiple){
          
            this.value = val||[];
          }else{
            this.value = val[0]||this.value;
          }   
      }else{
        this.value = (this.multiple)?[]:{};
      }
      return this.value;
    },
    toString: function(name, report) {
      if(!report){
        return gform.m('<dt>{{label}}</dt> <dd>{{#value.dataURI}}<img height=75px src="{{value.dataURI}}"/>{{/value.dataURI}} {{value.name}}{{^value.name}}<span class="text-muted">(empty)</span>{{/value.name}}</dd><hr>', this)
      }else{
        return this.value.dataURI
      }
    },      
    satisfied: function(value) {
      value = value||this.value;
      if(_.isArray(value)){return !!value.length;}
      return (typeof value !== 'undefined' && value !== null && value !== '' && !(typeof value == 'number' && isNaN(value)) && !_.isEmpty(value));            
    },
    initialize:function(){
      this.el.querySelector("#"+this.id+'.dropzone .dz-message').innerHTML = (this.item.format && this.item.format.message)?this.item.format.message:'Drop files here to upload';
      var onError = function(data){
        this.trigger('change',this,data)
        this.trigger('error',this, data)
        this.trigger('input',this,data)
      }.bind(this)
      var onSuccess = function(data){
        this.get()
        this.trigger('change',this,data)
        this.trigger('success',this, data)
        this.trigger('input',this,data)
      }.bind(this)
      this.Dropzone = new Dropzone(this.el.querySelector("#"+this.id+'.dropzone'), {
        addedfile: function(file) {
          var data = this.options.formelement.get();
          if(this.options.formelement.multiple){
            data = data[this.files.indexOf(file)];
          }else{
          }
  
          data = _.extend(data,file);
          if(typeof data.type !== 'undefined'){
            switch(data.type){
            case "image/jpeg":
            case "image/png":
            case "image/jpg":
            case "image/gif":
  
                // file.preview = '<div style="text-align:center;padding:10px;"><img style="max-width:100%" src="'+file.path+'"/></div>';
              break;
            default:
              
              // var icon = ;
              data.icon = (mime_type_icon_map[data.type] || mime_type_icon_map[data.type.split('/')[0]] || mime_type_icon_map[data.ext] || "fa-file-o");
            }
  
            // if(file.ext == "pdf"){
            //   file.preview = '<iframe width="100%" height="'+($( document ).height()-$('.report').position().top-100)+'px" src="'+file.path+'"></iframe>';
            // }
  
          }
          file.previewElement = Dropzone.createElement(gform.render('base64_file_preview',data));
  
          var _this = this;
  
          file.previewElement.querySelector('.gform-remove').addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
  
            // Remove the file preview.
            _this.removeFile(file);
  
            gform.types.base64_file.updateStatus.call(_this.options.formelement)
          });
  
          file.previewElement.querySelector('.gform-replace').addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
  
            // Remove the file preview.
  
            _this.enable();
  
            _this.clickableElements[0].click()
  
            _this.options.formelement.replaceIndex = _this.files.indexOf(file)
            _this.options.formelement.replaceFile = file;
            gform.types.base64_file.updateStatus.call(_this.options.formelement,true)
  
         });
          this.options.formelement.el.querySelector('ul.files').append(file.previewElement)
        },
        formelement:this,queuecomplete:gform.types.base64_file.updateStatus.bind(this),
        accept: function(file, done) {
  if(this.options.formelement.replaceIndex !== null){
  
    // if(typeof this.options.formelement.replaceFile !== 'undefined'){
      this.removeFile(this.options.formelement.replaceFile);
      clearReplace();
    // }
  }
  
  
          if(this.files.length>((this.options.formelement.multiple)?this.options.formelement.limit:1)){
            this.removeFile(file);
  
            done("Max files reached");
          }
          // this._uploadData = function(){}
          this._sendIntercept(file).then(result => {
            file.dataURI = result;
            if(typeof(this.localSuccess) === 'function') {
              this.localSuccess(file, done);
            } else {
              done(); // empty done signals success
            }
          }).catch(result => {
            if(typeof(this.localFailure) === 'function') {
              file.dataURI = result;
              this.localFailure(file, done);
            } else {
              if(typeof(this.localFailure) === 'string') {
                done(this.localFailure);
              }else{
                done(`Failed to upload file ${file.name}`);
                console.warn(file);
              }
            }
          });
        }, url:"#", timeout:60000,uploadMultiple:false/*,maxFiles:(this.multiple?this.multiple.max:1)*/, init: function(field) {
  
          this.submitRequest = function(xhr, formData, files) {
            files = _.each(files,function(file){
              files.status = (files.status == "uploading")?'success':file.status;
            })                  
            this._finished(files);
          }
          this._sendIntercept = function(file, options={}) {
            return new Promise((resolve,reject) => {
              if(!options.readType) {
                options.readType = _.reduce(['text/*', 'application/xml', 'application/x-sh', 'application/x-script', 'image/svg+xml'],function(result,type){
                  const re = new RegExp(type);
                  return result || re.test(file.type);
                },false) ? 'readAsText' : 'readAsDataURL';
              }
              let reader = new window.FileReader();
  
              reader.onload = () => {
                resolve(reader.result);
              };
              reader.onerror = () => {
                reject(reader.result);
              };
          
              // run the reader
              reader[options.readType](file);
            });
          }
          this.localSuccess = function(file,done) {
            onSuccess(file);
            done();
          }
          this.localFailure = function(file,done) {
            onError(file);
          }
        }
      });
  
      this.replaceIndex = null;
      clearReplace = function(){
        this.replaceIndex = null;
        delete this.replaceFile;
      }.bind(this)
      this.Dropzone.hiddenFileInput.onclick = clearReplace;
      this.Dropzone.on('drop',clearReplace)
  
      this.el.addEventListener('click', function(e){
        if(e.target.classList.contains('disabled')){return;}
        if(e.target.classList.contains('gform-clear-all')){
          this.Dropzone.removeAllFiles()
          gform.types.base64_file.updateStatus.call(this)
        }
      }.bind(this))
      gform.types.base64_file.set.call(this,this.value)
      gform.types.base64_file.setup.call(this);
    }
  });
  