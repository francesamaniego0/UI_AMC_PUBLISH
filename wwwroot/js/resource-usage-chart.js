window.ResourceUsageChart = (() => {
    const _instances = {};

    function getColors() {
        const isDark = document.documentElement.classList.contains('dark');
        return {
            isDark,
            gridColor: isDark ? 'rgba(104, 114, 132, .6)' : 'rgba(104, 114, 132, .6)',
            tickColor: isDark ? 'rgba(104, 114, 132, 1)' : 'rgba(104, 114, 132, 1)',
        };
    }
    function updateTheme() {
        const { isDark, gridColor, tickColor } = getColors();

        Object.values(_instances).forEach(chart => {
            // Legend
            chart.options.plugins.legend.labels.color = tickColor;

            // Scales
            chart.options.scales.x.grid.color = gridColor;
            chart.options.scales.x.ticks.color = tickColor;
            chart.options.scales.y.grid.color = gridColor;
            chart.options.scales.y.ticks.color = tickColor;

            chart.update();
        });
    }

    function render(canvasId, labels, cpu, memory, storage) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        if (_instances[canvasId]) {
            _instances[canvasId].destroy();
        }

        const { isDark, gridColor, tickColor } = getColors();

        canvas.style.background = 'transparent';

        _instances[canvasId] = new Chart(canvas, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'CPU',
                        data: cpu,
                        borderColor: '#60a5fa',
                        backgroundColor: 'rgba(96,165,250,0.08)',
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#60a5fa',
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        borderWidth: 2,
                        tension: 0.45,
                        fill: true,
                    },
                    {
                        label: 'Memory',
                        data: memory,
                        borderColor: '#f87171',
                        backgroundColor: 'rgba(248,113,113,0.08)',
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#f87171',
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        borderWidth: 2,
                        tension: 0.45,
                        fill: true,
                    },
                    {
                        label: 'Storage',
                        data: storage,
                        borderColor: '#fb923c',
                        backgroundColor: 'rgba(251,146,60,0.08)',
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#fb923c',
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        borderWidth: 2,
                        tension: 0.45,
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                spanGaps: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: tickColor,
                            usePointStyle: true,
                            pointStyleWidth: 16,
                            padding: 20,
                            font: { size: 12 },
                        },
                    },
                    tooltip: {
                        backgroundColor: '#1a2535',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        padding: 12,
                        cornerRadius: 6,
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        callbacks: {
                            labelColor(ctx) {
                                return {
                                    borderColor: ctx.dataset.borderColor,
                                    backgroundColor: ctx.dataset.borderColor,
                                };
                            },
                            label(ctx) {
                                // Hide tooltip row if value is null (gap day)
                                if (ctx.parsed.y === null) return null;
                                return ` ${ctx.dataset.label} : ${ctx.parsed.y}`;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        grid: { color: gridColor, drawTicks: false },
                        ticks: { color: tickColor, font: { size: 11 }, maxRotation: 0 },
                        border: { display: false },
                    },
                    y: {
                        min: 0,
                        grid: { color: gridColor, drawTicks: false },
                        ticks: { color: tickColor, font: { size: 11 }, stepSize: 20 },
                        border: { display: false },
                    },
                },
            },
            plugins: [
                {
                    id: 'verticalCrosshair',
                    afterDraw(chart) {
                        if (chart.tooltip._active && chart.tooltip._active.length) {
                            const ctx = chart.ctx;
                            const x = chart.tooltip._active[0].element.x;
                            const topY = chart.scales.y.top;
                            const bottomY = chart.scales.y.bottom;
                            ctx.save();
                            ctx.beginPath();
                            ctx.moveTo(x, topY);
                            ctx.lineTo(x, bottomY);
                            ctx.lineWidth = 1;
                            ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.2)';
                            ctx.stroke();
                            ctx.restore();
                        }
                    },
                },
            ],
        });
    }

    return { render, updateTheme };
})();