<?php
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https://' : 'http://';
    $url = $protocol . $_SERVER['HTTP_HOST'] . str_replace('index.php','',$_SERVER['SCRIPT_NAME']);
?>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="pt-BR" lang="pt-BR" xmlns:og="http://ogp.me/ns#" xmlns:fb="http://www.facebook.com/2008/fbml">
    <head>
        <base href="<?php echo $url;?>">
        <link rel="stylesheet" type="text/css" href="css/fonts.css">
        <script type="text/javascript" src="js/preloader.js"></script>
    </head>

    <body>
        <div style="position: absolute; top: -9999999px; left: -9999999px; width: 0px; height: 0px; overflow: hidden;" id="hiddenFonts">
            <span style="font-family: Helvetica; font-style:normal;">abc 123</span>
        </div>
    </body>
</html>

