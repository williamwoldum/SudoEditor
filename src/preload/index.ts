import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  readFile: async (filePath): Promise<string | Buffer> => ipcRenderer.invoke('read-file', filePath),
  writeFile: async (filePath, content): Promise<void> =>
    ipcRenderer.invoke('write-file', filePath, content),
  execSync: async (command): Promise<Buffer> => ipcRenderer.invoke('exec-sync', command),
  viewOutput: async (): Promise<void> => ipcRenderer.invoke('view-output')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
