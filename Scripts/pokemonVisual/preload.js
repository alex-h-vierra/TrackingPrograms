const fs = require('fs')
const path = require('path')
const { contextBridge, ipcRenderer } = require('electron')
/*
  Before integration of API's electron framework 
  electron's safety measure is to not allow direct 
  access to Node.js API's. So you have to preload 
  API's into a contextBridge to expose them to the
  renderer process.
*/
contextBridge.exposeInMainWorld('api', {
  readTextFile: async () => {
    const filePath = path.join(__dirname, '..', 'TextFiles', 'sv8pt5.txt')
    return fs.promises.readFile(filePath, 'utf-8')
  },
  resizeWindow: (width, height) => ipcRenderer.send('resize-window', width, height)
})
