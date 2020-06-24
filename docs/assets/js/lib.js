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

// function generateUUID() { // Public Domain/MIT
//     var d = new Date().getTime();//Timestamp
//     var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//         var r = Math.random() * 16;//random number between 0 and 16
//         if(d > 0){//Use timestamp until depleted
//             r = (d + r)%16 | 0;
//             d = Math.floor(d/16);
//         } else {//Use microseconds since page-load if supported
//             r = (d2 + r)%16 | 0;
//             d2 = Math.floor(d2/16);
//         }
//         return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
//     });
// }