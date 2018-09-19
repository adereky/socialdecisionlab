/**
 * Adrian Oesch
 * July 2018
 *
 * adapted from https://groups.google.com/forum/#!topic/jspsych/qP1qV82msm0
 */

jsPsych.plugins['svo'] = (function(){

    var plugin = {};

    plugin.trial = function(display_element, trial){

      var trial_data = {}
      trial_data.nClicks = 0
      trial_data.name = trial.name
      var t0 = Date.now()
      flatOptions = Experiment.utils.flattenJSON(trial.options)
      for (var key in flatOptions){
        trial_data[key] = flatOptions[key];
      };

      var mefirst = trial.mefirst;

      var hoverOptions = trial.options.map(function(i){
        var html = '<div class="svoItem">'+
        '<span class="svoChildItem">'+(mefirst==1? i[0] : i[1])+'</span><br/>'+
        '<span class="svoChildItem">|</span><br/>'+
        '<span class="svoChildItem">'+(mefirst==1? i[1] : i[0])+'</span><br/>'+
        '</div>'
        return(html)
      })
      var rowHead = '<div style="margin:7px 0px;width:80px;float:left;text-align:left;">'+
      '<span>'+(mefirst==1?'Business':'Society')+':</span><br/>'+
      '<span></span><br/>'+
      '<span>'+(mefirst==1?'Society':'Business')+':</span><br/>'+
      '</div>'

      var html = '<div style="width:450px;height:300px;margin:auto;">'+
        '<p style="margin-top:200px;">Please choose how to allocate the money:<p>'+
        '<div style="display:inline-block;font-size:15px;text-align:center;margin: 20px 0px;">'+
        rowHead+
        hoverOptions.join('')+
        "</div><button id='jspsych-button' style='float:right;'><p>Continue</p></button></div>"

      display_element.append(html)

      $('.svoItem, .svoChildItem').on('click',function(i){
        $('.selected').removeClass('selected')
        if(i.target.parentNode.classList.contains('svoItem')){
          i.target.parentNode.classList.add('selected')
        }else{
          i.target.classList.add('selected')
        }
        trial_data.nClicks++
      });

      $('#jspsych-button').on('click',function(){
        if($('.svoItem.selected').length==1){
          var response = $('.svoItem.selected').text().split('|').map(function(i){return(parseInt(i))})
          if(mefirst==1){
            trial_data.payoffS = response[0]
            trial_data.payoffC = response[1]
          }else{
            trial_data.payoffS = response[1]
            trial_data.payoffC = response[0]
          }
          trial_data.time = (Date.now()-t0)/1000.0
          display_element.html('')
          console.log(trial_data)
          jsPsych.finishTrial(trial_data)
        }else{
          alert('No response selected')
        }
      });

    };

    return plugin;
})();
