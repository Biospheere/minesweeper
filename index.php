<?php

if (isset($_SERVER["HTTP_ACCEPT_LANGUAGE"])) {
    define("LANG", substr($_SERVER["HTTP_ACCEPT_LANGUAGE"], 0, 2));
} else {
    define("LANG", "en");
}

require "Translation.php";

$t = new Translation();

?>

<!DOCTYPE html>
<html lang="<?php echo LANG; ?>">
<head>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/p5@1.0.0/lib/p5.min.js"></script>
    <script type="text/javascript" src="sketch.js"></script>
    <script type="text/javascript" src="cell.js"></script>
    <title><?php $t->Get("TITLE"); ?></title>
</head>
<body style="margin: 0; padding: 0; overflow: hidden;">
</body>
</html>
