<?php

namespace Middleware\Class;

class UserAuthenticate{ 
    public function GetUserLogin($name) {
        return "Hello, $name!";
    }
}