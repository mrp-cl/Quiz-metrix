<?php
session_start();
$_SESSION = [];  
session_unset();  
session_destroy(); 
header("Location: ../../landing-page/");
exit;
 
// optional
// header("Location: https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=http://yourapp.com/login.php");
// exit;
