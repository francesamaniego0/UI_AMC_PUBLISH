window.QuillInterop = {
    init(editorId, dotNetRef, initialValue) {
        const quill = new Quill(`#${editorId}`, {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'header': [1, 2, 3, false] }],
                    ['link'],
                    ['clean']
                ]
            }
        });

        if (initialValue) {
            quill.clipboard.dangerouslyPasteHTML(initialValue);
        }

        quill.on('text-change', () => {
            const html = quill.root.innerHTML;
            dotNetRef.invokeMethodAsync('OnContentChanged', html);
        });

        window._quillInstances = window._quillInstances || {};
        window._quillInstances[editorId] = quill;
    },

    setContent(editorId, html) {
        const quill = window._quillInstances?.[editorId];
        if (quill) quill.clipboard.dangerouslyPasteHTML(html ?? '');
    },

    getContent(editorId) {
        const quill = window._quillInstances?.[editorId];
        return quill ? quill.root.innerHTML : '';
    }
};