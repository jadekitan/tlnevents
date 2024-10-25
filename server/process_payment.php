<?php
session_start();
if (isset($_GET["ref"])) {
  $ref = $_GET["ref"];
  $_SESSION["Ref"] = $ref;
}
