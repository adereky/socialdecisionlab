/**
 * Adrian Oesch
 * January 2016
 *
 * adapted from https://groups.google.com/forum/#!topic/jspsych/qP1qV82msm0
 */

var fs_plugin_glob = {}; //global variable to store event triggers

jsPsych.plugins['fullscreen'] = (function(){

    var plugin = {};

    plugin.trial = function(display_element, trial){

      var defaultAbort = function(){
        var str = 'Experiment was terminated by your action.';
        jsPsych.abortExperiment(str)
      };
      var defaultFail = function(){
        var str = 'Your browser doesn\'t provide the necessary functionality. Please contact the principal investigator of this experiment.';
        jsPsych.abortExperiment(str)
      };

      // set defaults
      trial.button = trial.buttontext || 'Enter';
      trial.exit = trial.exit || false;
      trial.buttonStyle = trial.buttonStyle || "";
      trial.on_fullscreen_abort = trial.on_fullscreen_abort || defaultAbort;
      trial.on_fullscreen_fail = trial.on_fullscreen_fail || defaultFail;
      trial.on_visibility_abort = trial.on_visibility_abort || defaultAbort;
      trial.on_visibility_fail = trial.on_visibility_fail || defaultFail;

      var fs = {
        check : function (){
          if(typeof document.webkitIsFullScreen == 'undefined' && typeof document.mozFullScreen == 'undefined' && +
          typeof document.msFullscreenEnabled == 'undefined' && typeof document.fullscreenchange == 'undefined'){
            return false;
          }else{
            return true;
          };
        },
        launch : function (elem) {
          if(elem.requestFullscreen){
            elem.requestFullscreen(elem.ALLOW_KEYBOARD_INPUT);
          }else if(elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen(elem.ALLOW_KEYBOARD_INPUT)
          }else if(elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen(elem.ALLOW_KEYBOARD_INPUT);
            elem.webkitRequestFullscreen(elem.ALLOW_KEYBOARD_INPUT);
            if (!(navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") > -1)){
              document.onkeydown = function(e){e.preventDefault()}
            };
          }else if(elem.msRequestFullscreen) {
            elem.msRequestFullscreen(elem.ALLOW_KEYBOARD_INPUT);
          }
        },
        exit : function () {
          document.onkeydown = function(){return true}
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
            document.webkitExitFullscreen();
          };
        },
        getFullScreenAbort : function (callObj){
          var fullScreenAbort = function(){
            if (!document.webkitIsFullScreen && typeof document.webkitIsFullScreen != 'undefined'){
              console.log('web abort')
              callObj();
              callObj();
              vs.removeListener();
              fs.removeListener();
            }else if (!document.mozFullScreen && typeof document.mozFullScreen != 'undefined'){
              console.log('moz abort')
              callObj();
              callObj();
              vs.removeListener();
              fs.removeListener();
            }else if (!document.msFullscreenElement && typeof document.msFullscreenElement != 'undefined'){
              console.log('ms abort')
              callObj();
              callObj();
              vs.removeListener();
              fs.removeListener();
            }else if (!document.fullscreenchange && typeof document.fullscreenchange != 'undefined'){
              console.log('abort')
              callObj();
              callObj();
              vs.removeListener();
              fs.removeListener();
            }
          };
          return fullScreenAbort
        },
        addListener : function(){
          if (!document.webkitIsFullScreen && typeof document.webkitIsFullScreen != 'undefined'){
            document.addEventListener('webkitfullscreenchange',fs_plugin_glob.fs_abort,false);
          }else if (!document.mozFullScreen && typeof document.mozFullScreen != 'undefined'){
            document.addEventListener('mozfullscreenchange',fs_plugin_glob.fs_abort,false);
          }else if (!document.msFullscreenElement && typeof document.msFullscreenElement != 'undefined'){
            document.addEventListener('MSFullscreenChange',fs_plugin_glob.fs_abort,false);
          }else if (!document.fullScreen && typeof document.fullscreenchange != 'undefined'){
            document.addEventListener('fullscreenchange',fs_plugin_glob.fs_abort,false);
          }
        },
        removeListener : function(){
          document.removeEventListener('webkitfullscreenchange',fs_plugin_glob.fs_abort);
          document.removeEventListener('mozfullscreenchange',fs_plugin_glob.fs_abort);
          document.removeEventListener('MSFullscreenChange',fs_plugin_glob.fs_abort);
          document.removeEventListener('fullscreenchange',fs_plugin_glob.fs_abort);
        }
      };

      var vs = {
        check : function(){
          if(typeof document.webkitHidden == 'undefined' && typeof document.mozHidden == 'undefined' && +
          typeof document.msHidden == 'undefined' && typeof document.hidden == 'undefined'){
            return false;
          }else{
            return true;
          };
        },
        addListener : function(){
          if (typeof document.webkitHidden != 'undefined'){
            document.addEventListener('webkitvisibilitychange',fs_plugin_glob.vs_abort,false);
          }else if (typeof document.mozHidden != 'undefined'){
            document.addEventListener('mozvisibilitychange',fs_plugin_glob.vs_abort,false);
          }else if (typeof document.msHidden != 'undefined'){
            document.addEventListener('msvisibilitychange',fs_plugin_glob.vs_abort,false);
          }else if (typeof document.hidden != 'undefined'){
            document.addEventListener('visibilitychange',fs_plugin_glob.vs_abort,false);
          }
        },
        getVisibilityAbort : function (callObj){
          var visibilityAbort = function(){
            if (document.webkitHidden && typeof document.webkitHidden != 'undefined'){
              console.log('web vs abort')
              callObj();
              callObj();
              fs_plugin_glob.fs_remove();
              fs_plugin_glob.vs_remove();
            }else if (document.mozHidden && typeof document.mozHidden != 'undefined'){
              console.log('moz vs abort')
              callObj();
              callObj();
              fs_plugin_glob.fs_remove();
              fs_plugin_glob.vs_remove();
            }else if (document.msHidden && typeof document.msHidden != 'undefined'){
              console.log('ms vs abort')
              callObj();
              callObj();
              fs_plugin_glob.fs_remove();
              fs_plugin_glob.vs_remove();
            }else if (document.hidden && typeof document.hidden != 'undefined'){
              console.log('vs abort')
              callObj();
              callObj();
              fs_plugin_glob.fs_remove();
              fs_plugin_glob.vs_remove();
            }
          }
          return visibilityAbort;
        },
        removeListener : function(){
            document.removeEventListener('webkitvisibilitychange',fs_plugin_glob.vs_abort,false);
            document.removeEventListener('mozvisibilitychange',fs_plugin_glob.vs_abort,false);
            document.removeEventListener('msvisibilitychange',fs_plugin_glob.vs_abort,false);
            document.removeEventListener('visibilitychange',fs_plugin_glob.vs_abort,false);
        }
      };

      if (!fs.check()){
        trial.on_fullscreen_fail();
      };
      if (trial.visibility&&!vs.check()){
        trial.on_visibility_fail();
      };

      display_element.append(trial.html)
      display_element.children().append("<button id='jspsych-fullscreen-button' style='"+
          trial.buttonStyle+"'><p>" + trial.button + "</p></button>")

      fs_plugin_glob.fs_remove = fs.removeListener;
      fs_plugin_glob.vs_remove = vs.removeListener;

      $('#jspsych-fullscreen-button').on('click',function(){
          if (trial.exit) {
            fs.removeListener();
            vs.removeListener();
            fs.exit();
          }else{
            fs.launch(document.documentElement);
            fs_plugin_glob.fs_abort = fs.getFullScreenAbort(trial.on_fullscreen_abort)
            fs.addListener();
            if (trial.visibility){
                fs_plugin_glob.vs_abort = vs.getVisibilityAbort(trial.on_visibility_abort);
                setTimeout(vs.addListener,800);
              }
            };
            display_element.html('');
            jsPsych.finishTrial();
        });
    };

    return plugin;
})();
