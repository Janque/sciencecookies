<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

<?php echo $favicon; ?>

<!--Firebase app-->
<?php echo $fb_app ?>
<!--Firebase features-->
<?php echo $fb_auth ?>
<?php echo $fb_analytics ?>
<?php echo $fb_database ?>
<?php echo $fb_firestore ?>
<?php echo $fb_functions ?>
<?php echo $fb_storage ?>

<!--Initialize Firebase-->
<script>
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyCc5LmjPpufLuHzR6RiXR7awOdGuWpztTk",
        authDomain: "sciencecookies.net",
        databaseURL: "https://science-cookies.firebaseio.com",
        projectId: "science-cookies",
        storageBucket: "science-cookies.appspot.com",
        messagingSenderId: "906770471712",
        appId: "1:906770471712:web:c7a2c16bac19b6c2d7d545",
        measurementId: "G-1MYVREMBFV"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
</script>

<!-- Clarity tracking code for https://sciencecookies.net/ -->
<script>
    (function(c, l, a, r, i, t, y) {
        c[a] = c[a] || function() {
            (c[a].q = c[a].q || []).push(arguments)
        };
        t = l.createElement(r);
        t.async = 1;
        t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "56t5m147ti");
</script>

<!--FirebaseUI-->
<script src="https://www.gstatic.com/firebasejs/ui/4.6.1/firebase-ui-auth__es.js"></script>
<link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/4.6.1/firebase-ui-auth.css" />

<?php echo $adsense; ?>

<?php echo $fontawesome; ?>

<?php echo $bootstrap;?>

<?php echo $g_fonts;?>