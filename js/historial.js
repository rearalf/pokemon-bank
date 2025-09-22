
const KEY_HISTORY = 'pkbank_history';

(function () {
    const getHistory = () => {
        try { return JSON.parse(localStorage.getItem(KEY_HISTORY) || '[]'); }
        catch (e) { return []; }
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

function exportarHistorialPDF() {
    const history = JSON.parse(localStorage.getItem(KEY_HISTORY) || '[]');

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
        item.type,
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