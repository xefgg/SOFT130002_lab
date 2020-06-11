<?php
unset($_SESSION['Username']);
header("Location: ".$_SERVER['HTTP_REFERER']);

