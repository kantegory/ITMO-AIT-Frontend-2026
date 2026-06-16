document.addEventListener('DOMContentLoaded', () => {
    const modelData = localStorage.getItem('selectedModel');
    
    if (!modelData) {
        console.error("Данные модели не найдены");
        return;
    }

    const model = JSON.parse(modelData);
    const modelName = model.id.split('/').pop();
    const author = model.author || 'Community';

    document.getElementById('model-title').textContent = modelName;
    document.getElementById('breadcrumb-model').textContent = modelName;
    document.getElementById('model-author').textContent = author;
    document.getElementById('author-avatar').textContent = author.charAt(0).toUpperCase();
    document.getElementById('model-task').textContent = model.pipeline_tag || 'General';
    
    let downloads = model.downloads || 0;
    if (downloads > 1000) downloads = (downloads / 1000).toFixed(1) + 'k';
    document.getElementById('model-downloads').textContent = `<svg class="svg-icon star-filled"><use href="#icon-star"></use></svg> ${downloads} downloads`;

    document.getElementById('model-description').textContent = 
        `${model.id} - это современная модель машинного обучения, загруженная из Hugging Face Hub. Теги: ${model.tags?.slice(0, 5).join(', ') || 'AI'}.`;

    fetchModelFiles(model.id);
});

async function fetchModelFiles(modelId) {
    const filesContainer = document.getElementById('files-list');
    if (!filesContainer) return;

    filesContainer.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-info" role="status"></div></div>';

    try {
        const response = await fetch(`https://huggingface.co/api/models/${modelId}/tree/main`);
        if (!response.ok) throw new Error('Ошибка сети');
        
        const files = await response.json();
        filesContainer.innerHTML = '';

        if (files.length === 0) {
            filesContainer.innerHTML = '<div class="text-muted text-center">Файлы не найдены.</div>';
            return;
        }

        files.forEach(file => {
            let sizeStr = '-';

            const downloadUrl = `https://huggingface.co/${modelId}/resolve/main/${file.path}?download=true`;

            const fileItem = document.createElement('div');
            fileItem.className = 'd-flex justify-content-between align-items-center border-bottom border-secondary py-3';
            
            if (file === files[files.length - 1]) fileItem.classList.remove('border-bottom');

            fileItem.innerHTML = `
                <div class="d-flex align-items-center text-truncate pe-3">
                    <span class="fs-5 me-3">📄</span>
                    <span class="font-monospace text-light">${file.path}</span>
                </div>
                <div class="d-flex align-items-center flex-shrink-0">
                    <span class="text-muted small me-4">${sizeStr}</span>
                    <a href="${downloadUrl}" class="btn btn-sm btn-outline-info" download target="_blank">
                        ⬇ Скачать
                    </a>
                </div>
            `;
            filesContainer.appendChild(fileItem);
        });
    } catch (error) {
        console.error("Ошибка при загрузке файлов:", error);
        filesContainer.innerHTML = '<div class="text-danger py-3 text-center">Не удалось загрузить список файлов.</div>';
    }
}