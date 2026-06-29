window.printPdf = async function (divId, fileName = 'Report') {
    const el = document.getElementById(divId);
    if (!el) return;

    const clone = el.cloneNode(true);

    const originalCanvases = el.querySelectorAll('canvas');
    const clonedCanvases = clone.querySelectorAll('canvas');

    originalCanvases.forEach((canvas, i) => {
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        img.style.cssText = canvas.style.cssText;
        img.width = canvas.width;
        img.height = canvas.height;
        clonedCanvases[i].replaceWith(img);
    });

    const divContents = clone.innerHTML;

    // Detect dark mode — checks both system preference and Tailwind's .dark class on <html>
    const isDark = document.documentElement.classList.contains('dark')
        || window.matchMedia('(prefers-color-scheme: dark)').matches;

    const styles = Array.from(document.styleSheets)
        .map(sheet => {
            try {
                return Array.from(sheet.cssRules)
                    .map(rule => rule.cssText)
                    .join('\n');
            } catch (e) {
                if (sheet.href) {
                    return `@import url('${sheet.href}');`;
                }
                return '';
            }
        })
        .join('\n');

    const printWindow = window.open('', '_blank', 'width=1200,height=900');

    printWindow.document.write(`
        <html class="${isDark ? 'dark' : ''}">
            <head>
                <title>${fileName}</title>
                <style>
                    ${styles}

                    @media print {
                        @page {
                            size: 216mm 356mm;
                            margin: 0;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            background: white;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .no-print {
                            display: none !important;
                        }
                    }
                </style>
            </head>
            <body>
                ${divContents}
            </body>
        </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
    };

    setTimeout(() => {
        if (!printWindow.closed) {
            printWindow.focus();
            printWindow.print();
        }
    }, 800);
};