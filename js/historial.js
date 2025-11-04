import { fmt } from "./constants.js";
import { deleteSession, getHistory } from "./storage.js";

const KEY_HISTORY = 'pkbank_history';

(function () {
    const body = document.getElementById('hist-body');
    const empty = document.getElementById('hist-empty');
    const history = getHistory();

    if (!history.length) {
        empty.classList.remove('d-none');
        return;
    }
    empty.classList.add('d-none');
    body.innerHTML = history.map(item => `
        <tr>
          <td>${item.date}</td>
          <td>${item.service}</td>
          <td>${fmt(item.amount)}</td>
        </tr>
      `).join('');
})();

function exportarHistorialPDF() {
    const history = getHistory();

    if (history.length === 0) {
        alert('No hay datos para exportar.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Historial de Transacciones', 14, 15);

    const tableColumn = ['Fecha', 'Tipo', 'Monto ($)'];
    const tableRows = history.map(item => [
        item.date,
        item.service,
        item.amount.toFixed(2)
    ]);

    doc.autoTable({
        startY: 25,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped'
    });

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    const date = `${yyyy}-${mm}-${dd}_${hh}-${min}.pdf`;

    doc.save(`historial-transacciones-${date}.pdf`);
}

const btnExportPdf = document.getElementById('btn-export-pdf')

btnExportPdf.addEventListener('click', exportarHistorialPDF)

document.getElementById('log-out').addEventListener('click', () => {
    deleteSession()
    window.location.href = 'index.html'
})