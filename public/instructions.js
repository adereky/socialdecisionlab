var instructions = {
  welcome :   '<h2>Welcome</h2><p>To run this experiment we need launch into fullscreen mode. \
              Following actions will terminate \
              the experiment:<ul><li>exiting fullscreen mode</li><li>switching tabs or applications</li>\
              <li>reloading the webpage</li><li>going-"back" in the browser</li></ul>\
              <p>Please close all other running applications and turn off all notifications before entering \
              the experiment. Ensure you are in a calm place without any distractions, for example, noise.<p>\
              <p>If your session is aborted, you can start again reopening the link from qualtrics.</p>\
              <p>Click "Enter" to launch into fullscreen and start the experiment.</p>',

  end_fullscreen : '<h2>This was it!</h2> <p>Please save your data by clicking "Save & Exit". You will get your\
                   confirmation code on the next page.</p>',

  confirmation : '<h2>This session is over</h2><p>Please go back to the survey and paste the following code into the\
                input form <br>(use right-click in Safari): <strong><span id="conf_code"></span></strong></p>\
                <p>After copying the confirmation code, you can close this browser window or tab.</p><p id="notification"></p>'
};
