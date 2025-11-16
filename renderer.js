const editorInput = document.getElementById('editor-input');
const htmlOutput = document.getElementById('html-output');
const markdownModeButton = document.getElementById('mode-markdown');
const htmlModeButton = document.getElementById('mode-html');
const toHtmlButton = document.getElementById('to-html-button');
const toMarkdownButton = document.getElementById('to-markdown-button');
const copyPreviewButton = document.getElementById('copy-preview-button');

let currentMode = 'markdown'; // 'markdown' or 'html'

async function updatePreview() {
    const text = editorInput.value;
    if (currentMode === 'markdown') {
        const html = await window.electronAPI.markdownToHtml(text);
        htmlOutput.innerHTML = html;
        addCopyButtons();
    } else {
        htmlOutput.innerHTML = text;
    }
}

function addCopyButtons() {
    const pres = htmlOutput.querySelectorAll('pre');
    pres.forEach(pre => {
        const code = pre.querySelector('code');
        if (!code) return;

        // 既存のコピーボタンがあれば追加しない
        if (pre.querySelector('.code-copy-button')) return;

        const copyButton = document.createElement('button');
        copyButton.className = 'code-copy-button';
        copyButton.textContent = 'Copy';
        pre.style.position = 'relative';
        pre.appendChild(copyButton);

        copyButton.addEventListener('click', (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(code.innerText).then(() => {
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            });
        });
    });
}

editorInput.addEventListener('input', updatePreview);

markdownModeButton.addEventListener('click', () => {
    if (currentMode === 'markdown') return;
    currentMode = 'markdown';
    markdownModeButton.classList.add('active');
    htmlModeButton.classList.remove('active');
    editorInput.placeholder = 'ここにMarkdownを入力...';
    updatePreview();
});

htmlModeButton.addEventListener('click', () => {
    if (currentMode === 'html') return;
    currentMode = 'html';
    htmlModeButton.classList.add('active');
    markdownModeButton.classList.remove('active');
    editorInput.placeholder = 'ここにHTMLを入力...';
    updatePreview();
});

toHtmlButton.addEventListener('click', async () => {
    const markdown = editorInput.value;
    const html = await window.electronAPI.markdownToHtml(markdown);
    
    // HTMLモードに切り替えてエディタとプレビューを更新
    currentMode = 'html';
    htmlModeButton.classList.add('active');
    markdownModeButton.classList.remove('active');
    editorInput.placeholder = 'ここにHTMLを入力...';
    editorInput.value = html;
    updatePreview();
});

toMarkdownButton.addEventListener('click', async () => {
    const html = editorInput.value;
    const markdown = await window.electronAPI.htmlToMarkdown(html);
    editorInput.value = markdown;
    // Markdownモードに切り替えてプレビューを更新
    if (currentMode !== 'markdown') {
        currentMode = 'markdown';
        markdownModeButton.classList.add('active');
        htmlModeButton.classList.remove('active');
        editorInput.placeholder = 'ここにMarkdownを入力...';
    }
    updatePreview();
});

copyPreviewButton.addEventListener('click', () => {
    const textToCopy = editorInput.value;
    const modeText = currentMode === 'markdown' ? 'Markdown' : 'HTML';

    navigator.clipboard.writeText(textToCopy).then(() => {
        copyPreviewButton.textContent = `${modeText}をコピーしました！`;
        setTimeout(() => {
            copyPreviewButton.textContent = 'プレビューをコピー';
        }, 2000);
    });
});

// 初期プレビュー更新
updatePreview();
