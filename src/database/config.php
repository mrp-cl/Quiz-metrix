<?php   
    class Database{ 

        private $hostName = "localhost";
        private $userName ="root";
        private $passWord = "";
        private $database = "quizmetrix"; 

        protected $conn; 

        public function __construct()
        {   
            $this->conn = new mysqli($this->hostName,  
                                      $this->userName,  
                                      $this->passWord ,
                                      $this->database); 
            
            if($this->conn->connect_errno) 
            {
                die("Connection failed: ". $this->conn->connect_errno);
            }                         
        } 

        public function GetConnection()
        {   
            return $this->conn;
        }  
    } 
?>