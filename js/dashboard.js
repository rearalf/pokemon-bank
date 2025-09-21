<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pokémon Bank | Historial</title>
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <link rel="stylesheet" href="css/index.css">
</head>
<body>
  <nav class="navbar navbar-expand-lg navbar-styles">
    <div class="container position-relative">
      <a class="navbar-brand position-absolute top-50 start-50 translate-middle" href="dashboard.html">
        <img src="./assets/1199px-Pokémon_Bank_logo.png" alt="Logo" width="86" height="50">
      </a>
    </div>
  </nav>

  <main class="container mt-5">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h1 class="mb-0">Historial de transacciones</h1>
      <a href="dashboard.html" class="btn btn-secondary">Regresar</a>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-bordered text-center">
        <thead class="table-primary">
          <tr>
            <th>Fecha</th>
            <th>Tipo de transacción</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody id="hist-body"></tbody>
      </table>
    </div>

    <p id="hist-empty" class="text-center text-muted d-none">Sin movimientos aún.</p>
  </main>

  <footer class="fixed-bottom bg-white">
    <div class="container d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
      <p class="col-md-4 mb-0 text-body-secondary">© 2025 Compañia</p>
      <a href="dashboard.html"
         class="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
        <img src="./assets/1199px-Pokémon_Bank_logo.png" alt="Logo" width="86" height="50">
      </a>
    </div>
  </footer>

  <script src="js/bootstrap.bundle.min.js"></script>
  <script>
    (function(){
      const KEY_HISTORY = 'pkbank_history';
      const getHistory = () => {
        try { return JSON.parse(localStorage.getItem(KEY_HISTORY) || '[]'); }
        catch(e){ return []; }
      };
      const fmt = (n) => '$' + Number(n).toFixed(2);

      const body = document.getElementById('hist-body');
      const empty = document.getElementById('hist-empty');
      const hist = getHistory();

      if (!hist.length) {
        empty.classList.remove('d-none');
        return;
      }
      empty.classList.add('d-none');
      body.innerHTML = hist.map(item => `
        <tr>
          <td>${item.date}</td>
          <td>${item.type}</td>
          <td>${fmt(item.amount)}</td>
        </tr>
      `).join('');
    })();
  </script>
</body>
</html>
