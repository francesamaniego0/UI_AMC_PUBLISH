window.PerformanceTrendChart = (() => {
    const _instances = {};

    function getColors() {
        const isDark = document.documentElement.classList.contains('dark');
        return {
            isDark,
            //gridColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
            //tickColor: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
            gridColor: isDark ? 'rgba(104, 114, 132, .6)' : 'rgba(104, 114, 132, .6)',
            tickColor: isDark ? 'rgba(104, 114, 132, 1)' : 'rgba(104, 114, 132, 1)',
        };
    }

    function render(canvasId, labels, desktopPerf, mobilePerf) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        if (_instances[canvasId]) {
            _instances[canvasId].destroy();
        }

        const { isDark, gridColor, tickColor } = getColors();

        _instances[canvasId] = new Chart(canvas, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Desktop',
                        data: desktopPerf,
                        borderColor: '#7dd3fc',
                        backgroundColor: 'rgba(125,211,252,0.08)',
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#7dd3fc',
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        borderWidth: 2,
                        tension: 0.45,
                        fill: false,
                    },
                    {
                        label: 'Mobile',
                        data: mobilePerf,
                        borderColor: '#f87171',
                        backgroundColor: 'rgba(248,113,113,0.08)',
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#f87171',
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        borderWidth: 2,
                        tension: 0.45,
                        fill: false,
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
                        max: 100,
                        grid: {
                            color: gridColor,
                            drawTicks: false,
                            borderDash: [4, 4],  // dashed grid like screenshot
                        },
                        ticks: {
                            color: tickColor,
                            font: { size: 11 },
                            stepSize: 25,
                        },
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

    function updateTheme() {
        const { gridColor, tickColor } = getColors();
        Object.values(_instances).forEach(chart => {
            chart.options.plugins.legend.labels.color = tickColor;
            chart.options.scales.x.grid.color = gridColor;
            chart.options.scales.x.ticks.color = tickColor;
            chart.options.scales.y.grid.color = gridColor;
            chart.options.scales.y.ticks.color = tickColor;
            chart.update();
        });
    }

    return { render, updateTheme };
})();