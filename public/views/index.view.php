<!DOCTYPE html>
<html lang="es">

<head>
  <meta name="google-site-verification" content="pffq0MGMyrYBsgL7f9drofhXb0nfHmqE8-h1YZf83xA" />
  <meta name="description" content="Artículos de ciencia con chispas de chocolate. Artículos de difusión científica y sobre curiosidades." />
  <link rel="canonical" href="https://sciencecookies.net" />

  <title>Science Cookies - Artículos de ciencia con chispas de chocolate</title>

  <?php require("views/components/head.view.php"); ?>

</head>

<body>

  <?php require("views/components/navbar.view.php"); ?>

  <?php require("views/components/register.view.php"); ?>

  <div class="container-fluid text-white" style="background-color: black;background-image: url('img/fondo1.jpg');background-position: center top;background-attachment: fixed;">
    <div class="row justify-content-around">

      <?php require("views/components/sidebar.view.php"); ?>

      <div class="col-12 col-sm-9 col-md-6 col-xl-7 py-md-3 pl-md-3" id="cookCnt">
        <div class="row justify-content-center mt-3 mb-4 align-items-center">
          <div class="col-10 col-sm-5 col-xl-3">
            <img src="img/logoT.svg" class="w-100" alt="Science Cookies Logo" loading="lazy">
          </div>
          <div class="col-12 col-sm-6 col-xl-4">
            <h1 style="font-size: 2.8rem;" class="text-center">SCIENCE COOKIES</h1>
            <h2 style="font-size: 1rem;" class="text-center">Artículos de ciencia con chispas de chocolate</h2>
          </div>
        </div>
        <div class="container-fluid mb-4 rounded-lg p-3 d-none" style="background-color:rebeccapurple;" id="calMain"></div>
        <form class="mb-4" id="frmSrch">
          <div style="border:solid;border-width:1px;color:#f8f9fa;border-color:#f8f9fa;" class="rounded mb-1 pl-2 pt-1">
            <div class="from-row">
              <label for="cats">Categorías</label>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="catA">
                <label class="form-check-label" for="catA">Todas</label>
              </div>
            </div>
            <!--Categorías@#-->
            <div class="form-row justify-content-around">
              <div class="form-group col-auto">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="cat0" value="astronomia">
                  <label class="form-check-label" for="cat0">Astronomía</label>
                </div>
              </div>
              <div class="form-group col-auto">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="cat1" value="biologia">
                  <label class="form-check-label" for="cat1">Biología</label>
                </div>
              </div>
              <div class="form-group col-auto">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="cat2" value="curiosidades">
                  <label class="form-check-label" for="cat2">Curiosidades</label>
                </div>
              </div>
              <div class="form-group col-auto">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="cat3" value="fisica">
                  <label class="form-check-label" for="cat3">Física</label>
                </div>
              </div>
              <div class="form-group col-auto">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="cat4" value="tecnologia">
                  <label class="form-check-label" for="cat4">Tecnología</label>
                </div>
              </div>
            </div>
          </div>
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Buscar galletas..." aria-describedby="frmBtns" maxlength="100" id="srcBox">
            <div class="input-group-append" id="frmBtns">
              <select class="custom-select rounded-0" id="inOrd">
                <option value="new" id="inSrchOrd1">Más nuevo</option>
                <option value="old" id="inSrchOrd2">Más viejo</option>
                <option value="pop" id="inSrchOrd3">Más popular</option>
              </select>
              <button class="btn btn-outline-light" type="submit"><i class="fas fa-search"></i></button>
            </div>
          </div>
        </form>
        <nav aria-label="pageNavT" class="d-none" id="pgNavT">
          <ul class="pagination justify-content-end">
            <li class="page-item">
              <button class="page-link text-light bg-transparent" aria-label="pgTPrv" id="pgTPrv">
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            <li class="page-item"><span class="page-link text-light bg-transparent" id="disPgT">1</span></li>
            <li class="page-item">
              <button class="page-link text-light bg-transparent" aria-label="pgTNxt" id="pgTNxt">
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
        <!--Galletas-->
        <div id="cookiesCont"></div>
        <nav aria-label="pageNavB" class="d-none" id="pgNavB">
          <ul class="pagination justify-content-end">
            <li class="page-item">
              <button class="page-link text-light bg-transparent" aria-label="pgBPrv" id="pgBPrv">
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            <li class="page-item"><span class="page-link text-light bg-transparent" id="disPgB">1</span></li>
            <li class="page-item">
              <button class="page-link text-light bg-transparent" aria-label="pgBNxt" id="pgBNxt">
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <!--Anuncios V-->
      <?php require("views/components/adsV.view.php"); ?>
    </div>
    <!--Anuncios H-->
    <?php require("views/components/adsH.view.php"); ?>
  </div>

  <?php require("views/components.footer.view.php"); ?>

  <?php echo $bootstrap_js; ?>

  <?php echo $global_js; ?>
  <script src="js/app.js"></script>

  <?php echo $add_this; ?>
</body>

</html>