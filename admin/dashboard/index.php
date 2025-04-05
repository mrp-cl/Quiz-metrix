<?php  
$DOMAIN = $_SERVER['HTTP_HOST'];  
define("ABSOLUTE_PATH_DOMAIN", $DOMAIN .'/'.'quiz-metrix');   
?>
<!DOCTYPE html>
<html   lang="en" 
  class="layout-compact layout-menu-fixed"
  data-assets-path="<?php echo $domain =  'http://'. ABSOLUTE_PATH_DOMAIN ?>">
    <?php include './header.php'; ?>  
<body>

    <div class="layout-wrapper layout-content-navbar">
    <div class="layout-container">   
        <?php         
            include './navbar.php';       
            include './sidebar.php';  
            include './content.php';  
        ?>
    </div>
    </div> 
    <?php include './script.php';  ?>
</body>
</html>