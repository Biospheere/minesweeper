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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <title><?php $t->Out("TITLE"); ?></title>
    <script type="application/javascript">
        const errorMessage1 = '<?php $t->Out("ERROR_MESSAGE_1"); ?>';
        const errorMessage2 = '<?php $t->Out("ERROR_MESSAGE_2"); ?>';
    </script>
    <script type="application/javascript" src="https://cdn.jsdelivr.net/npm/p5@1.0.0/lib/p5.min.js"></script>
    <script type="application/javascript" src="sketch.js"></script>
    <script type="application/javascript" src="cell.js"></script>
    <link rel="stylesheet" href="stylesheet.css">
</head>
<body>
</body>
</html>
