(function(){
  const KEY_BALANCE = 'pkbank_balance';
  const KEY_HISTORY = 'pkbank_history';

  const getBalance = () => parseFloat(localStorage.getItem(KEY_BALANCE) || '0');
  const setBalance = (v) => localStorage.setItem(KEY_BALANCE, String(Number(v).toFixed(2)));
  const getHistory = () => {
    try { return JSON.parse(localStorage.getItem(KEY_HISTORY) || '[]'); }
    catch(e){ return []; }
  };
  const setHistory = (arr) => localStorage.setItem(KEY_HISTORY, JSON.stringify(arr));

  const fmt = (n) => '$' + Number(n).toFixed(2);

  const dmy = (d) => {
    const dd = String(d.getDate()).padStart(2,'0');
    const mm = String(d.getMonth()+1).padStart(2,'0');
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
  const balModal  = new bootstrap.Modal('#modalBalance');
  const payModal  = new bootstrap.Modal('#modalPay');

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
    if (isNaN(amount) || amount <= 0) return swal('Monto inválido','Ingresa un monto mayor a 0','warning');
    const newBal = getBalance() + amount;
    setBalance(newBal);
    const hist = getHistory();
    hist.unshift({date: today(), type: 'Depósito', amount});
    setHistory(hist);
    refreshBadge();
    depoModal.hide();
    swal('Depósito exitoso', `Nuevo saldo: ${fmt(newBal)}`, 'success');
  });

  document.getElementById('withdraw-submit')?.addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    if (isNaN(amount) || amount <= 0) return swal('Monto inválido','Ingresa un monto mayor a 0','warning');
    const bal = getBalance();
    if (amount > bal) return swal('Fondos insuficientes', `Saldo disponible: ${fmt(bal)}`, 'error');
    const newBal = bal - amount;
    setBalance(newBal);
    const hist = getHistory();
    hist.unshift({date: today(), type: 'Retiro', amount});
    setHistory(hist);
    refreshBadge();
    withModal.hide();
    swal('Retiro exitoso', `Nuevo saldo: ${fmt(newBal)}`, 'success');
  });

  document.getElementById('pay-submit')?.addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('pay-amount').value);
    const service = document.getElementById('pay-service').value;
    if (isNaN(amount) || amount <= 0) return swal('Monto inválido','Ingresa un monto mayor a 0','warning');
    const bal = getBalance();
    if (amount > bal) return swal('Fondos insuficientes', `Saldo disponible: ${fmt(bal)}`, 'error');
    const newBal = bal - amount;
    setBalance(newBal);
    const hist = getHistory();
    hist.unshift({date: today(), type: `Pago de servicio (${service})`, amount});
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
