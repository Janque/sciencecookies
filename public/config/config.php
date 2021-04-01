<?php

$pagination = $_GET['page'];
if (!$pagination) $pagination = 1;


$config = parse_ini_file("admin/config.ini");
define('HOST', $config['HOST']);
define('FBVERSION', $config['FBVERSION']);


$favicon = '<link rel="shortcut icon" href="' . HOST . 'img/logoT.svg">';


# JS
$global_js = '<script src="' . HOST . 'js/global.js"></script>';

# CSS
$main_css = '<link rel="stylesheet" href="' . HOST . 'css/main.css">';

# Firebase
$fb_app = '<script src="https://www.gstatic.com/firebasejs/' . FBVERSION . '/firebase-app.js">';
$fb_auth = '<script src="https://www.gstatic.com/firebasejs/' . FBVERSION . '/firebase-auth.js"></script>';
$fb_analytics = '<script src="https://www.gstatic.com/firebasejs/' . FBVERSION . '/firebase-analytics.js"></script>';
$fb_database = '<script src="https://www.gstatic.com/firebasejs/' . FBVERSION . '/firebase-database.js"></script>';
$fb_firestore = '<script src="https://www.gstatic.com/firebasejs/' . FBVERSION . '/firebase-firestore.js"></script>';
$fb_functions = '<script src="https://www.gstatic.com/firebasejs/' . FBVERSION . '/firebase-functions.js"></script>';
$fb_storage = '<script src="https://www.gstatic.com/firebasejs/' . FBVERSION . '/firebase-storage.js"></script>';

# APIs & other

# Adsense
$adsense = '<script data-ad-client="ca-pub-7663681425693792" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>';

# Fontawesome
$fontawesome = '<script src="https://kit.fontawesome.com/cf642fd47e.js" crossorigin="anonymous"></script>';

# Bootstrap
$bootstrap = '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">';

$bootstrap_js = `<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>`;

# Google fonts
$g_fonts = '<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap" rel="stylesheet">';
# AddThis
$addthis = '<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5f13599e10bd5c2b"></script>';