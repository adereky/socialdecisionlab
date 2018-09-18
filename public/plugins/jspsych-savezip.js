/**
 * Adrian Oesch
 * Sept 2018
 *
 * adapted from https://groups.google.com/forum/#!topic/jspsych/qP1qV82msm0
 */

jsPsych.plugins['savezip'] = (function(){

    var plugin = {};

    plugin.trial = function(display_element, trial){
      if(Experiment.utils.isDataSaved && jsPsych.data.getURLVariable('forceZip')!='1'){
        jsPsych.finishTrial();
      }else{
        var html = Experiment.utils.wrap('There was an error sending your data to the server. '+
        'Please download your experiment data and send the zip file to <a href="mailto:adereky@ethz.ch">adereky@ethz.ch</a>.',200)

        display_element.append(html)

        display_element.children().append("<button id='jspsych-savezip-continue-button' style='"+
            trial.buttonStyle+"'><p>Continue</p></button>")
        display_element.children().append("<button id='jspsych-savezip-button' onclick='Experiment.utils.saveZip()' style='"+
            trial.buttonStyle+"margin-right:20px;'><p>Download</p></button>")

        $('#jspsych-savezip-continue-button').on('click',function(){
          if(confirm('Please confirm that you have sent the downloaded zip file to adereky@ethz.ch.')){
              jsPsych.finishTrial()
          }
        });

        display_element.append(html)

      };

    };

    return plugin;
})();
