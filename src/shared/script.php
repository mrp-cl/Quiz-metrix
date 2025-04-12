  <?php 
    $assets = [ 
        "/src/assets/libs/jquery/dist/jquery.min.js", 
        "/src/assets/libs/bootstrap/dist/js/bootstrap.bundle.min.js", 
        "/src/assets/js/sidebarmenu.js", 
        "/src/assets/libs/apexcharts/dist/apexcharts.min.js", 
        "/src/assets/libs/simplebar/dist/simplebar.js",
        "/src/assets/js/dashboard.js"
    ]; 

    foreach($assets as $source ) 
    {
        ?><script src="<?php echo $PROTOCOL . $ABSOLUTE_URL . $source; ?>">      
        </script><?php    
    } 
  ?>
  
  
  
  

