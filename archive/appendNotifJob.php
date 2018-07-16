<?php
file_put_contents( $_ENV["OPENSHIFT_DATA_DIR"].'notifications.txt', $notifStr.$_POST['notifJob'],FILE_APPEND);
?>;
