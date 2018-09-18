/**
 * Adrian Oesch
 * September 2018
 */

jsPsych.plugins['postData'] = (function(){

    var plugin = {};

    plugin.trial = function(display_element, trial){

      $.ajax({
          type: 'post',
          url: './save',
          data: JSON.stringify({
            fileName: [jsPsych.data.getURLVariable('i'),'svo'].join('_'),
            folder: jsPsych.data.getURLVariable('f'),
            csvStrings: Experiment.utils.getExperimentCSVData(),
            dataAsJSON: [jsPsych.data.dataAsJSON()]
          }),
          success : function(){
            Experiment.utils.isDataSaved = true;
            jsPsych.finishTrial()
          },
          error : function(xhr, status, error){
            console.log(error)
            console.log(xhr.responseText)
            jsPsych.finishTrial()
          }
        });

    };

    return plugin;
})();
