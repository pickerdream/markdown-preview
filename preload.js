const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  markdownToHtml: (markdown) => ipcRenderer.invoke('markdown-to-html', markdown),
  htmlToMarkdown: (html) => ipcRenderer.invoke('html-to-markdown', html)
});
