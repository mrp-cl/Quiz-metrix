<?php


namespace Middleware\Class;

class Config{

    public function VendorConfig()
    {
        define('CLIENT_ID', $APP_CLIENT_ID );  
        define('CLIENT_SECRET', $APP_CLIENT_SECRET ); 
        define('TENANT_ID', 'common'); 
        define('REDIRECT_URI', $APP_URI_CALLBACK); 


        // OAuth endpoints this is vendor...
        define('AUTHORITY', 'https://login.microsoftonline.com/' . TENANT_ID);
        define('AUTHORIZE_ENDPOINT', AUTHORITY . '/oauth2/v2.0/authorize');
        define('TOKEN_ENDPOINT', AUTHORITY . '/oauth2/v2.0/token');
        
        //echo  AUTHORIZE_ENDPOINT;
        // Scopes to request...
        define('SCOPES', 'openid profile email User.Read'); 

        return;
    }

}