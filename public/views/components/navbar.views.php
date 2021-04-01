<!--Navbar-->
<nav class="navbar sticky-top navbar-expand-lg navbar-dark" style="background-color: #791acd;">
    <img src="img/wlogoT.svg" height="30" class="d-inline-block align-center mr-2" alt="Science Cookies Logo" loading="lazy">
    <a class="navbar-brand" href="https://sciencecookies.net">Science Cookies</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarM" aria-controls="navbarM" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="navbarM">
        <ul class="navbar-nav mr-auto py-0">
            <a class="btn btn-dark mx-2 my-1 active">Inicio</a>
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

<!--Alertas-->
<div id="alrtClsSsn">

</div>