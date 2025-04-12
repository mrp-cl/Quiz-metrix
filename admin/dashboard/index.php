<?php  
$DOMAIN = $_SERVER['HTTP_HOST'];  
define("ABSOLUTE_PATH_DOMAIN", $DOMAIN .'/'.'quiz-metrix');   
?>
<!DOCTYPE html>
<html   lang="en" 
  class="layout-compact layout-menu-fixed"
  data-assets-path="<?php echo $domain =  'http://'. ABSOLUTE_PATH_DOMAIN ?>">
    <?php    
        include   dirname(dirname(__DIR__)) . '/core/header.php';    
    ?>  
<body>

    <div class="layout-wrapper layout-content-navbar">
    <div class="layout-container">   
        <?php         
            include dirname(dirname(__DIR__)) .'/core/navbar.php';       
            include dirname(dirname(__DIR__)) .'/core/sidebar.php';  
            include './content.php';  
        ?>
    </div>
    </div> 
    <?php include dirname(dirname(__DIR__)) .'/core/script.php';  ?> 
    <script src='../js/calendar.js'></script>
</body>
</html>