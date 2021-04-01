<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="shortcut icon" href="img/logoT.svg">
  <title>Science Cookies - Editar calendario</title>

  <!--Firebase app-->
  <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js"></script>
  <!--Firebase features-->
  <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-analytics.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-storage.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-database.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-firestore.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-functions.js"></script>

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
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "56t5m147ti");
  </script>

  <!--FirebaseUI-->
  <script src="https://www.gstatic.com/firebasejs/ui/4.6.1/firebase-ui-auth__es.js"></script>
  <link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/4.6.1/firebase-ui-auth.css" />

  <!--Font awesome-->
  <script src="https://kit.fontawesome.com/cf642fd47e.js" crossorigin="anonymous"></script>

  <!--Bootstrap-->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
    integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">

  <!--Google fonts-->
  <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="css/main.css">

  <style>
    .table-bordered thead,
    .table-bordered tbody,
    .table-bordered th,
    .table-bordered td {
      border: .5rem solid #57238b !important;
    }

    .autoOverflow {
      overflow: hidden;
      margin-right: .5rem;
      margin-left: .5rem;
    }

    .autoOverflow:hover {
      overflow: auto;
    }
  </style>

</head>

<body>

  <!--Navbar-->
  <nav class="navbar sticky-top navbar-expand-lg navbar-dark" style="background-color: #791acd;">
    <img src="img/wlogoT.svg" height="30" class="d-inline-block align-center mr-2" alt="Science Cookies Logo"
      loading="lazy">
    <a class="navbar-brand" href="https://sciencecookies.net">Science Cookies</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarM" aria-controls="navbarM"
      aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="navbarM">
      <ul class="navbar-nav mr-auto py-0">
        <a class="btn btn-dark mx-2 my-1" href="https://sciencecookies.net">Inicio</a>
        <a class="btn btn-dark mx-2 my-1" href="quienes-somos">¿Quienes somos?</a>
        <a class="btn btn-dark mx-2 my-1" href="contacto">Contacto</a>
        <a class="btn btn-dark mx-2 my-1" href="archivo">Archivo</a>
        <a class="btn btn-dark mx-2 my-1" href="calendario-astronomico">Calendario Astronómico</a>
        <i id="tagLstSave" class="text-light mx-3 my-auto"></i>
      </ul>
      <div class="row justify-content-end">
        <div class="dropdown mr-4 dropleft">
          <button class="btn btn-dark dropdown-toggle p-2" type="button" id="usrDrpdwn" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false"><i class="fas" id="icnUsr"></i><img src="" height="30"
              class="d-inline-block align-center ml-2 rounded-circle" alt="" id="picUsr"></button>
          <div class="dropdown-menu dropdown-menu-right bg-dark pl-1" aria-labelledby="usrDrpdwn">
            <a id="btnPrfl" class="btn btn-link text-decoration-none text-light d-none" href="perfil">Mi perfíl</a>
            <a id="btnPref" class="btn btn-link text-decoration-none text-light d-none"
              href="perfil?tab=pref">Preferencias</a>
            <a id="btnDraft" class="btn btn-link text-decoration-none text-light d-none" href="drafts">Borradores</a>
            <a id="btnCals" class="btn btn-link text-decoration-none text-light d-none"
              href="calendarios">Calendarios</a>
            <div class="dropdown-divider ml-1 mr-2"></div>
            <button id="btnLgO" class="btn btn-link text-decoration-none text-light d-none">Cerrar sesión</button>
            <button id="btnLgI" class="btn btn-link text-decoration-none text-light d-none" data-toggle="modal"
              data-target="#mdlRgstr">Acceder</button>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Register modal -->
  <div class="modal fade" id="mdlRgstr" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog"
    aria-labelledby="mdlRgsL" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="mdlRgsL">Inicia sesión o regístrate</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div id="firebaseui-auth-container"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal"
            onclick="document.getElementById('mdlRgsL').innerHTML='Inicia sesión o regístrate';">Cancelar</button>
        </div>
      </div>
    </div>
  </div>

  <!--Publish modal-->
  <div class="modal fade" id="mdlPublish" tabindex="-1" role="dialog" aria-labelledby="mdlPublishL" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="mdlPublishL">Publicar el calendario</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="btnCanPublish1"><span
              aria-hidden="true">&times;</span></button>
        </div>
        <div class="modal-body">
          <p id="mdlPublishTxt"></p>
          <img src="" alt="" class="@# d-none">
          <div class="progress my-2 d-none" id="barPublishCont">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="0"
              aria-valuemin="0" aria-valuemax="100" style="width: 0%" id="barPublish"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-scckie btn-block" id="btnCnfPublish">Publicar</button>
          <button type="button" class="btn btn-secondary btn-block" data-dismiss="modal"
            id="btnCanPublish0">Cancelar</button>
        </div>
      </div>
    </div>
  </div>

  <!--Event Info modal-->
  <div class="modal fade" id="mdlEventInfo" tabindex="-1" role="dialog" aria-labelledby="mdlEventInfoL"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="mdlEventInfoL"></h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
        </div>
        <div class="row px-4 py-2">
          <button class="btn btn-scckie mr-auto" id="btnPriorEve"><i class="fas fa-arrow-left"></i></button>
          <button class="btn btn-scckie" id="btnNextEve"><i class="fas fa-arrow-right"></i></button>
        </div>
        <div id="eventInfoCont" class="overflow-auto"></div>
      </div>
    </div>
  </div>

  <!--Alertas-->
  <div id="alrtClsSsn">

  </div>

  <!--Página-->

  <!--Side toolbar-->
  <div class="tbar tbar-right btn-toolbar mb-3" role="toolbar">
    <div class="btn-group-vertical mr-2 btn-group-lg" role="group">
      <button class="btn btn-scckie" id="btnPrevCal"><i class="fas fa-eye"></i></button>
      <button class="btn btn-scckie" id="btnPrevMail"><i class="fas fa-envelope"></i></button>
      <button class="btn btn-scckie d-none" id="btnAprove"><i class="far fa-check-square"></i></button>
      <button class="btn btn-scckie d-none" id="btnPub" data-toggle="modal" data-target="#mdlPublish"><i class="fas fa-paper-plane"></i></button>
      <a class="btn btn-scckie text-decoration-none" id="btnSrcCal"><i class="fas fa-calendar-day"></i></a>
    </div>
  </div>

  <div class="container-fluid text-white"
    style="background-color: black;background-image: url('../../img/fondo1.jpg');background-position: center top;background-attachment: fixed;">
    <div class="row justify-content-around">
      <div class="col-md-3 col-xl-2 sidebar my-0 ml-lg-3 mr-0 ml-md-2 py-md-1 pl-md-3 text-dark"
        style="background-color: #FFF8E7;">
        <div class="row">
          <h5 class="text-center my-auto mr-auto ml-3 ml-md-auto mt-md-2 d-md-none">Galletas recomendadas</h5>
          <button class="btn d-md-none p-0 pr-2 mr-4" type="button" data-toggle="collapse" data-target="#sdbarL"
            aria-controls="sdbarL" aria-expanded="false" aria-label="Toggle docs navigation"
            style="font-size: 1.8rem;"><i class="fas fa-bars"></i></button>
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
        <p class="text-center"><img class="mt-3 mb-4 w-75" src="img/NLogoHalignT.svg"
            alt="Science Cookies: artículos de ciencia con chispas de chocolate"></p>
        <div class="container-fluid mb-2 rounded-lg p-3" style="background-color:rgb(87, 35, 139);">
          <!--Aquí va el contenido-->
          <h1 class="text-center" id="title"></h1>
          <div class="row mb-2 justify-content-center">
            <label class="col-12 col-form-label">Imagen</label>
            <figure class="col-9 col-xl-6 mb-3 p-0" style="position: relative; border-radius: 0.25rem;">
              <img id="prevMed" class="card-img m-0" src="" onerror="this.src='img/noimg.png'">
              <div class="card-img-overlay pt-0" style="padding-left: 0.9rem; padding-right: 0.9rem;">
                <div class="row mb-2 p-0">
                  <button class="btn btn-light btn-scckie btn-sm ml-auto" id="btnChgImg"><i class="fas fa-exchange-alt"
                      aria-hidden="true"></i></button>
                </div>
              </div>
              <br>
              <div class="row">
                <div class="col">
                  <label>Pie de foto</label>
                  <input class="form-control" type="text" id="inPicCapt">
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label>Alt</label>
                  <input class="form-control" type="text" id="inPicAlt">
                </div>
              </div>
            </figure>
          </div>
          <div class="progress mb-2 d-none" id="barChgImgCont">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="0"
              aria-valuemin="0" aria-valuemax="100" style="width: 0%" id="barChgImg"></div>
          </div>
          <form id="frmChgImg" class="d-none">
            <div class="row mb-3 justify-content-center">
              <div class="form-check form-check-inline ml-3">
                <input class="form-check-input" type="radio" name="radsMedSrc" id="inMedSrc0" required>
                <label class="form-check-label" for="inMedSrc0">Propio</label>
              </div>
              <div class="form-check form-check-inline ml-3">
                <input class="form-check-input" type="radio" name="radsMedSrc" id="inMedSrc1">
                <label class="form-check-label" for="inMedSrc1">Externo</label>
              </div>
            </div>
            <div class="custom-file mb-5 d-none" id="inChgImgFileCont">
              <input type="file" class="custom-file-input" id="inChgImg">
              <label class="custom-file-label" for="inChgImg" data-browse="Elegir" id="inChgImgL">Subir archivo</label>
            </div>
            <div class="row mb-2 d-none" id="inChgImgUrlCont">
              <div class="col">
                <label for="inChgImgUrl">URL del archivo</label>
                <input id="inChgImgUrl" class="form-control" type="text" placeholder="https://imagen.com">
              </div>
            </div>
            <div class="row mb-2 justify-content-center">
              <button type="submit" class="btn btn-secondary mx-2" id="btnCanChgImg">Cancelar</button>
              <button type="submit" class="btn btn-primary mx-2" id="btnCnfChgImg">Aceptar</button>
            </div>
          </form>
          <form id="frmText">
            <div class="row mb-2">
              <label class="col-12 col-form-label">Descripción</label>
              <div class="col">
                <textarea class="form-control" id="inDesc" rows="3"></textarea>
              </div>
            </div>
            <div class="row mb-2">
              <label class="col-12 col-form-label">Descripción corta</label>
              <div class="col">
                <textarea class="form-control" id="inDescShort" rows="3"></textarea>
              </div>
            </div>
            <div class="row mb-2 justify-content-end">
              <button class="btn btn-light btn-link-scckie mx-3" type="submit"><i class="fas fa-check"></i></button>
            </div>
          </form>
        </div>
        <div class="container-fluid mb-2 rounded-lg p-2 overflow-auto" style="background-color:#57238b;">
          <div class="table-responsive">
            <table class="table table-bordered table-light rounded">
              <thead class="thead-dark">
                <tr>
                  <th style="min-width: 7rem; width: 13%;">Domingo</th>
                  <th style="min-width: 7rem; width: 13%;">Lunes</th>
                  <th style="min-width: 7rem; width: 13%;">Martes</th>
                  <th style="min-width: 7rem; width: 13%;">Miercoles</th>
                  <th style="min-width: 7rem; width: 13%;">Jueves</th>
                  <th style="min-width: 7rem; width: 13%;">Viernes</th>
                  <th style="min-width: 7rem; width: 13%;">Sabado</th>
                </tr>
              </thead>
              <tbody id="weeksCont">
                <!--
                <tr style="height:10rem;">
                  <td class="py-0">
                    <p class="m-0 p-1" style="font-size:x-large;"><b>1</b></p>
                    <div class="autoOverflow" style="max-height: 7rem;">
                      <button class="btn text-left p-1 mb-1" style="background-color: #c3e6cb; border-color:#8fd19e;"
                        onclick="console.log('si')"><small>Nombre del evento</small></button>
                      <button class="btn btn-scckie btn-block btn-sm"><i class="fas fa-plus"></i></button>
                    </div>
                  </td>
                </tr>-->
              </tbody>
            </table>
          </div>
        </div>
        <!--Aquí termina el contenido-->
      </div>
      <!--Anuncios V-->
      <div
        class="col-2 py-md-3 d-none d-sm-block bg-info sidebar text-dark text-center justify-content-center px-1 px-lg-2"
        id="adsV"></div>
    </div>
    <!--Anuncios H-->
    <div class="row bg-info px-2 text-dark d-sm-none justify-content-center" id="adsH"></div>
  </div>
  <input type="text" id="toCopy" class="d-none" value="something">

  <!--Bootstrap-->
  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
    integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
    crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
    integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
    crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"
    integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI"
    crossorigin="anonymous"></script>

  <script src="js/global.js"></script>
  <script src="js/editCalendars.js"></script>

  <!--AddThis-->
  <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5f13599e10bd5c2b"></script>
</body>

</html>