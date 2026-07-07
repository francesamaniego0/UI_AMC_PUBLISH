// Uptime response-time trend chart, Chart.js interop.
// Call window.uptimeChart.render(canvasId, labels, dataPoints, isDarkMode) from OnAfterRenderAsync.
// Call window.uptimeChart.destroy(canvasId) in DisposeAsync / before re-render.

window.uptimeChart = (function () {
    const charts = {};

    function render(canvasId, labels, dataPoints, isDarkMode) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (charts[canvasId]) {
            charts[canvasId].destroy();
        }

        const gridColor = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
        const textColor = isDarkMode ? '#cbd5e1' : '#475569';

        charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Response time (ms)',
                    data: dataPoints,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34,197,94,0.1)',
                    tension: 0.3,
                    fill: true,
                    pointRadius: 0,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: textColor, maxTicksLimit: 8 }, grid: { color: gridColor } },
                    y: { ticks: { color: textColor }, grid: { color: gridColor }, beginAtZero: true }
                }
            }
        });
    }

    function destroy(canvasId) {
        if (charts[canvasId]) {
            charts[canvasId].destroy();
            delete charts[canvasId];
        }
    }

    return { render, destroy };
})();