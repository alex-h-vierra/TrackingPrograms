import {app, BrowserWindow, ipcMain} from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.disableHardwareAcceleration()
let parent
app.whenReady().then(async () => {
    try {
        const {API} = await import('./reload.cjs') 
    } catch (e) {
        console.log('\nReload failed to load')
    }
    parent = new BrowserWindow({
        alwaysOnTop: true,
        // devTools: true,
        transparent: true,
        frame: false,
        resizable: false,
        useContentSize: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
        }
    })
    parent.loadFile(path.join(__dirname, 'renderer/index.html'))
})
ipcMain.on('resize-window', (event, width, height) => {
    parent.setContentSize(width, height)
})
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit() 
    }
})

