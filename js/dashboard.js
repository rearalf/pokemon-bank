(function () {
  const KEY_BALANCE = 'pkbank_balance';
  const KEY_HISTORY = 'pkbank_history';

  const getBalance = () => parseFloat(localStorage.getItem(KEY_BALANCE) || '0');
  const setBalance = (v) => localStorage.setItem(KEY_BALANCE, String(Number(v).toFixed(2)));
  const getHistory = () => {
    try { return JSON.parse(localStorage.getItem(KEY_HISTORY) || '[]'); }
    catch (e) { return []; }
  };
  const setHistory = (arr) => localStorage.setItem(KEY_HISTORY, JSON.stringify(arr));

  const fmt = (n) => '$' + Number(n).toFixed(2);

  const dmy = (d) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // Seed inicial (solo primera vez)
  if (!localStorage.getItem(KEY_BALANCE)) {
    setBalance(1000); // saldo inicial
  }
  if (!localStorage.getItem(KEY_HISTORY)) {
    const now = new Date();
    const seed = [
      { date: dmy(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2)), type: 'Depósito', amount: 500.00 },
      { date: dmy(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4)), type: 'Retiro', amount: 50.00 },
      { date: dmy(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)), type: 'Pago de servicio (Internet)', amount: 25.00 },
      { date: dmy(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 9)), type: 'Servicios CAESS', amount: 75.00 },
      { date: dmy(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 9)), type: 'Servicios ANDA', amount: 5.00 },
      { date: dmy(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 15)), type: 'Retiro', amount: 65.00 }
    ];
    setHistory(seed);
  }

  // UI
  const badgeBalance = document.getElementById('badge-balance');
  const refreshBadge = () => { if (badgeBalance) badgeBalance.textContent = fmt(getBalance()); };
  refreshBadge();

  // Modales
  const depoModal = new bootstrap.Modal('#modalDeposit');
  const withModal = new bootstrap.Modal('#modalWithdraw');
  const balModal = new bootstrap.Modal('#modalBalance');
  const payModal = new bootstrap.Modal('#modalPay');

  // Abrir modales
  document.getElementById('action-deposit')?.addEventListener('click', () => {
    document.getElementById('deposit-amount').value = '';
    depoModal.show();
  });
  document.getElementById('action-withdraw')?.addEventListener('click', () => {
    document.getElementById('withdraw-amount').value = '';
    withModal.show();
  });
  document.getElementById('action-balance')?.addEventListener('click', () => {
    document.getElementById('current-balance').textContent = fmt(getBalance());
    balModal.show();
  });
  document.getElementById('action-pay')?.addEventListener('click', () => {
    document.getElementById('pay-amount').value = '';
    document.getElementById('pay-service').value = 'Internet';
    payModal.show();
  });

  const today = () => dmy(new Date());

  // Acciones
  document.getElementById('deposit-submit')?.addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('deposit-amount').value);
    if (isNaN(amount) || amount <= 0) return swal('Monto inválido', 'Ingresa un monto mayor a 0', 'warning');
    const newBal = getBalance() + amount;
    setBalance(newBal);
    const hist = getHistory();
    hist.unshift({ date: today(), type: 'Depósito', amount });
    setHistory(hist);
    refreshBadge();
    depoModal.hide();
    swal('Depósito exitoso', `Nuevo saldo: ${fmt(newBal)}`, 'success');
  });

  document.getElementById('withdraw-submit')?.addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    if (isNaN(amount) || amount <= 0) return swal('Monto inválido', 'Ingresa un monto mayor a 0', 'warning');
    const bal = getBalance();
    if (amount > bal) return swal('Fondos insuficientes', `Saldo disponible: ${fmt(bal)}`, 'error');
    const newBal = bal - amount;
    setBalance(newBal);
    const hist = getHistory();
    hist.unshift({ date: today(), type: 'Retiro', amount });
    setHistory(hist);
    refreshBadge();
    withModal.hide();
    swal('Retiro exitoso', `Nuevo saldo: ${fmt(newBal)}`, 'success');
  });

  document.getElementById('pay-submit')?.addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('pay-amount').value);
    const service = document.getElementById('pay-service').value;
    if (isNaN(amount) || amount <= 0) return swal('Monto inválido', 'Ingresa un monto mayor a 0', 'warning');
    const bal = getBalance();
    if (amount > bal) return swal('Fondos insuficientes', `Saldo disponible: ${fmt(bal)}`, 'error');
    const newBal = bal - amount;
    setBalance(newBal);
    const hist = getHistory();
    hist.unshift({ date: today(), type: `Pago de servicio (${service})`, amount });
    setHistory(hist);
    refreshBadge();
    payModal.hide();
    swal('Pago realizado', `Nuevo saldo: ${fmt(newBal)}`, 'success');
  });

  // Ir a historial
  document.getElementById('go-historial')?.addEventListener('click', () => {
    window.location.href = 'historial.html';
  });
})();

let myChart;

function getDepositsAndWithdrawalsThisMonth() {
  const hist = JSON.parse(localStorage.getItem('pkbank_history') || '[]');
  const now = new Date();
  const m = now.getMonth() + 1;
  const y = now.getFullYear();
  let deposits = 0, withdrawals = 0, pay = 0;

  hist.forEach(t => {
    const [dd, mm, yyyy] = t.date.split('/').map(Number);
    if (mm === m && yyyy === y) {

      if (t.type.toLowerCase().includes('depósito')) deposits += t.amount;
      if (t.type.toLowerCase().includes('retiro')) withdrawals += t.amount;
      if (t.type.toLowerCase().includes('pago de servicio (teléfono)') || t.type.toLowerCase().includes('pago de servicio (caess)') || t.type.toLowerCase().includes('pago de servicio (internet)') || t.type.toLowerCase().includes('pago de servicio (anda)')) pay += t.amount;
    }
  });
  return { deposits, withdrawals, pay };
}

function renderChart() {
  const { deposits, withdrawals, pay } = getDepositsAndWithdrawalsThisMonth();

  const ctx = document.getElementById('myChart')?.getContext('2d');
  if (!ctx) return;

  if (myChart) {
    myChart.data.datasets[0].data = [deposits, withdrawals, pay];
    myChart.update();
  } else {
    myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Depósitos', 'Retiros', 'Pagos'],
        datasets: [{
          label: 'Transacciones del mes',
          data: [deposits, withdrawals, pay],
          borderWidth: 1,
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', renderChart);

window.addEventListener('storage', renderChart);