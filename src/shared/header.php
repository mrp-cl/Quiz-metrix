<?php   
$DOMAIN = $_SERVER['HTTP_HOST'];  
define("ABSOLUTE_PATH_DOMAIN", $DOMAIN .'/'.'thesis');      
$ABSOLUTE_URL = ABSOLUTE_PATH_DOMAIN; 

if (isset($_SERVER['HTTPS']) &&
    ($_SERVER['HTTPS'] == 'on' || $_SERVER['HTTPS'] == 1) ||
    isset($_SERVER['HTTP_X_FORWARDED_PROTO']) &&
    $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') {
     $PROTOCOL = 'https://';
}
else {
    $PROTOCOL = 'http://';
}
?>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>QuizMetriz</title>
  <!-- <link rel="shortcut icon" type="image/png" href="../assets/images/logos/favicon.png" />  -->
  <link rel="stylesheet" href="<?php echo $PROTOCOL . $ABSOLUTE_URL . '/src/assets/css/styles.min.css'?>" />
</head>