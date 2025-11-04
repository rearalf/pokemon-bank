import { getHistory, getSession, setHistory, getBalance, deleteSession } from './storage.js'
import { fmt } from './constants.js';

let myChart

function getDepositsAndWithdrawalsThisMonth() {
    const history = getHistory()
    const now = new Date()
    const m = now.getMonth() + 1
    const y = now.getFullYear()
    let deposits = 0,
        withdrawals = 0,
        pay = 0

    history.forEach(t => {
        const datePart = t.date.split(',')[0]
        const [dd, mm, yyyy] = datePart.split('/').map(Number)
        if (mm === m && yyyy === y) {
            if (t.type.includes('deposit')) deposits += t.amount
            if (t.type.includes('withdrawal')) withdrawals += t.amount
            if (t.type.includes('payment')) pay += t.amount
        }
    })
    return { deposits, withdrawals, pay }
}

function renderChart() {
    const { deposits, withdrawals, pay } = getDepositsAndWithdrawalsThisMonth()

    const ctx = document.getElementById('myChart')?.getContext('2d')
    if (!ctx) return

    if (myChart) {
        myChart.data.datasets[0].data = [deposits, withdrawals, pay]
        myChart.update()
    } else {
        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Depósitos', 'Retiros', 'Pagos'],
                datasets: [
                    {
                        label: 'Transacciones del mes',
                        data: [deposits, withdrawals, pay],
                        borderWidth: 1,
                        backgroundColor: [
                            '#198754',
                            '#dc3545',
                            '#ff9f40'
                        ]
                    },
                ],
            },
            options: {
                scales: {
                    y: { beginAtZero: true },
                },
            },
        })
    }
}

document.getElementById('log-out').addEventListener('click', () => {
    deleteSession()
    window.location.href = 'index.html'
})

// Ir a historial.html
document.getElementById('go-historial')?.addEventListener('click', () => {
    window.location.href = 'historial.html'
})

// Acciones
document.getElementById('deposit-submit')?.addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('deposit-amount').value)
    if (isNaN(amount) || amount <= 0)
        return swal('Monto inválido', 'Ingresa un monto mayor a 0', 'warning')
    const user = setHistory('deposit', 'Deposito', amount)
    swal('Depósito exitoso', `Nuevo saldo: ${fmt(user.balance)}`, 'success')
    refreshBadge()
    depoModal.hide()
})

document.getElementById('withdraw-submit')?.addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('withdraw-amount').value)
    if (isNaN(amount) || amount <= 0)
        return swal('Monto inválido', 'Ingresa un monto mayor a 0', 'warning')
    const bal = getBalance()
    if (amount > bal)
        return swal('Fondos insuficientes', `Saldo disponible: ${fmt(bal)}`, 'error')
    const user = setHistory('withdrawal', 'Retiro', amount)
    swal('Retiro exitoso', `Nuevo saldo: ${fmt(user.balance)}`, 'success')
    refreshBadge()
    withModal.hide()
})

document.getElementById('pay-submit')?.addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('pay-amount').value)
    const service = document.getElementById('pay-service').value
    if (isNaN(amount) || amount <= 0)
        return swal('Monto inválido', 'Ingresa un monto mayor a 0', 'warning')
    const bal = getBalance()
    if (amount > bal)
        return swal('Fondos insuficientes', `Saldo disponible: ${fmt(bal)}`, 'error')
    const user = setHistory('payment', `Pago de servicio (${service})`, amount)
    refreshBadge()
    payModal.hide()
    swal('Pago realizado', `Nuevo saldo: ${fmt(user.balance)}`, 'success')
})

// Modales
const depoModal = new bootstrap.Modal('#modalDeposit')
const withModal = new bootstrap.Modal('#modalWithdraw')
const balModal = new bootstrap.Modal('#modalBalance')
const payModal = new bootstrap.Modal('#modalPay')

// Abrir modales
document.getElementById('action-deposit')?.addEventListener('click', () => {
    document.getElementById('deposit-amount').value = ''
    depoModal.show()
})
document.getElementById('action-withdraw')?.addEventListener('click', () => {
    document.getElementById('withdraw-amount').value = ''
    withModal.show()
})
document.getElementById('action-balance')?.addEventListener('click', () => {
    document.getElementById('current-balance').textContent = fmt(getBalance())
    balModal.show()
})
document.getElementById('action-pay')?.addEventListener('click', () => {
    document.getElementById('pay-amount').value = ''
    document.getElementById('pay-service').value = 'Internet'
    payModal.show()
})

const refreshBadge = () => {
    const badgeBalance = document.getElementById('badge-balance')
    if (badgeBalance) badgeBalance.textContent = fmt(getBalance())
}

const initialValues = () => {
    const userSession = getSession()
    if (userSession === null) window.location.href = 'index.html'
    const userName = document.getElementById('user-name')
    userName.textContent = JSON.parse(userSession).name
    refreshBadge()
    renderChart()
}

document.addEventListener('DOMContentLoaded', initialValues)
window.addEventListener('storage', initialValues)
