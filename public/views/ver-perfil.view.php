<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="shortcut icon" href="../../img/logoT.svg">
    <title>Science Cookies - Ver perfíl</title>
    
    <!--Firebase app-->
    <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js"></script>
    <!--Firebase features-->
    <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-analytics.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-storage.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-firestore.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-functions.js"></script>

    <!--Initialize Firebase-->
    <script>
      // Your web app's Firebase configuration
      var firebaseConfig={
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
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "56t5m147ti");
    </script>
    
    <!--FirebaseUI-->
    <script src="https://www.gstatic.com/firebasejs/ui/4.6.1/firebase-ui-auth__es.js"></script>
    <link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/4.6.1/firebase-ui-auth.css" />
    
    <!--Font awesome-->
    <script src="https://kit.fontawesome.com/cf642fd47e.js" crossorigin="anonymous"></script>

    <!--Bootstrap-->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">

    <!--Google fonts-->
    <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="css/main.css">

  </head>
  <body>

    <!--Navbar-->
    <nav class="navbar sticky-top navbar-expand-lg navbar-dark" style="background-color: #791acd;">
      <img src="img/wlogoT.svg" height="30" class="d-inline-block align-center mr-2" alt="Science Cookies Logo" loading="lazy">
      <a class="navbar-brand" href="https://sciencecookies.net">Science Cookies</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarM" aria-controls="navbarM" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
      <div class="collapse navbar-collapse" id="navbarM">
        <ul class="navbar-nav mr-auto py-0">
          <a class="btn btn-dark mx-2 my-1" href="https://sciencecookies.net">Inicio</a>
          <a class="btn btn-dark mx-2 my-1" href="quienes-somos">¿Quienes somos?</a>
          <a class="btn btn-dark mx-2 my-1" href="contacto">Contacto</a>
          <a class="btn btn-dark mx-2 my-1" href="archivo">Archivo</a>
          <a class="btn btn-dark mx-2 my-1" href="calendario-astronomico">Calendario Astronómico</a>
        </ul>
        <div class="row justify-content-end">
          <div class="dropdown mr-4 dropleft">
            <button class="btn btn-dark dropdown-toggle p-2" type="button" id="usrDrpdwn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fas" id="icnUsr"></i><img src="" height="30" class="d-inline-block align-center ml-2 rounded-circle" alt="" id="picUsr"></button>
            <div class="dropdown-menu dropdown-menu-right bg-dark pl-1" aria-labelledby="usrDrpdwn">
              <a id="btnPrfl" class="btn btn-link text-decoration-none text-light d-none" href="perfil">Mi perfíl</a>
              <a id="btnPref" class="btn btn-link text-decoration-none text-light d-none" href="perfil?tab=pref">Preferencias</a>
              <a id="btnDraft" class="btn btn-link text-decoration-none text-light d-none" href="drafts">Borradores</a>
              <a id="btnCals" class="btn btn-link text-decoration-none text-light d-none" href="calendarios">Calendarios</a>
              <div class="dropdown-divider ml-1 mr-2"></div>
              <button id="btnLgO" class="btn btn-link text-decoration-none text-light d-none">Cerrar sesión</button>
              <button id="btnLgI" class="btn btn-link text-decoration-none text-light d-none" data-toggle="modal" data-target="#mdlRgstr">Acceder</button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Register modal -->
    <div class="modal fade" id="mdlRgstr" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="mdlRgsL" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="mdlRgsL">Inicia sesión o regístrate</h5>
          </div>
          <div class="modal-body">
            <div id="firebaseui-auth-container"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    <!--Alertas-->
    <div id="alrtClsSsn">
      
    </div>
    
    <!--Página-->
    <div class="container-fluid text-white" style="background-color: black;background-image: url('../../img/fondo1.jpg');background-position: center top;background-attachment: fixed;">
      <div class="row justify-content-around">
        <div class="col-md-3 col-xl-2 sidebar my-0 ml-lg-3 mr-0 ml-md-2 py-md-1 pl-md-3 text-dark" style="background-color: #FFF8E7;">
          <div class="row">
            <h5 class="text-center my-auto mr-auto ml-3 ml-md-auto mt-md-2 d-md-none">Galletas recomendadas</h5>
            <button class="btn d-md-none p-0 pr-2 mr-4" type="button" data-toggle="collapse" data-target="#sdbarL" aria-controls="sdbarL" aria-expanded="false" aria-label="Toggle docs navigation" style="font-size: 1.8rem;"><i class="fas fa-bars"></i></button>
          </div>
          <nav class="collapse sdbarCnt" id="sdbarL">
            <div class="col justify-content-center px-3 px-md-0 px-lg-3 px-xl-2">
              <div class="d-none" id="calRecom">
                <h5 class="text-center">Calendario astronómico</h5>
                <div id="calCnt"></div>
              </div>
              <h5 class="text-center">La galleta más nueva</h5>
              <div id="newCook"></div>
              <div class="dropdown-divider d-md-none"></div>
              <h5 class="text-center">Las galletas más populares</h5>
              <div id="popCook"></div>
            </div>
          </nav>
        </div>
        <div class="col-12 col-sm-9 col-md-6 col-xl-7 py-md-3 pl-md-3">
          <p class="text-center"><img class="mt-3 mb-4 w-75" src="../../img/NLogoHalignT.svg" alt="Science Cookies: artículos de ciencia con chispas de chocolate"></p>
          <!--Aquí va el contenido-->
          <ul class="nav nav-tabs">
            <li class="nav-item mx-lg-1 mx-0">
              <a class="nav-link text-decoration-none btn-outline-light" onclick="shwCrds(1);" id="navBtnPrfl">Su perfíl</a>
            </li>
            <li class="nav-item mx-lg-1 mx-0">
              <a class="nav-link text-decoration-none btn-outline-light" onclick="shwCrds(2);" id="navBtnFav">Sus favoritos</a>
            </li>
            <li class="nav-item ml-lg-1 mr-lg-auto mx-0">
              <a class="nav-link text-decoration-none btn-outline-light" onclick="shwCrds(3);" id="navBtnLike">Sus me gusta</a>
            </li>
          </ul>
          <div class="container-fluid px-2">
            <div class="card text-light border-light bg-transparent mt-2 d-none" id="crdPrfl">
              <ul class="list-group list-group-flush">
                <li class="list-group-item text-light border-light bg-transparent" id="contPic">
                  <img src="" alt="" class="rounded" height="150" id="disPP">
                </li>
                <li class="list-group-item text-light border-light bg-transparent d-none" id="contEmail">
                  <div class="container"><div class="row">
                    <div class="col col-4"><strong>Email</strong></div>
                    <div class="col col-8" id="disMail"></div>
                  </div></div>
                </li>
                <li class="list-group-item text-light border-light bg-transparent">
                  <div class="container"><div class="row" id="contNull">
                    <div class="col col-4">
                      <strong>Nombre</strong>
                    </div>
                    <div class="col col-8" id="disName"></div>
                  </div></div>
                </li>
              </ul>
            </div>
            <div class="card text-light border-light bg-transparent mt-2 d-none" id="crdFav">
              <ul class="list-group list-group-flush" id="cntFav"></ul>
            </div>
            <div class="card text-light border-light bg-transparent mt-2 d-none" id="crdLike">
              <ul class="list-group list-group-flush" id="cntLike"></ul>
            </div>
          </div>
          <!--Aquí termina el contenido-->
        </div>
        <!--Anuncios V-->
        <div class="col-2 py-md-3 d-none d-sm-block bg-info sidebar text-dark text-center justify-content-center px-1 px-lg-2" id="adsV"></div>
      </div>
      <!--Anuncios H-->
      <div class="row bg-info px-2 text-dark d-sm-none justify-content-center" id="adsH"></div>
    </div>
    
    <!--Bootstrap-->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>

    <script src="js/global.js"></script>
    <script src="js/viewPrflApp.js"></script>

    <!--AddThis-->
    <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5f13599e10bd5c2b"></script>
  </body>
</html>
