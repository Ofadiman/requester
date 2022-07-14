const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

const createWindow = () => {
  const browserWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  browserWindow
    .loadURL(
      isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`,
    )
    .then(() => {
      console.log('URL loaded 🚀')
    })
    .catch((error) => {
      console.error('Something went wrong 💥')
      console.error(error)
    })

  /**
   * Theoretically, I can open devtools like this when an application starts in development mode, but I'm not sure yet if I want to.
   *
   * if (isDev) {
   *   browserWindow.webContents.openDevTools({ mode: 'detach' })
   * }
   */
}

app.whenReady().then(() => {
  createWindow()
})

/**
 * Close the application on Windows and Linux operating systems (this is the default behavior expected by users of these systems).
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * Applications on the macOS operating system most often go into the background when all windows are closed.
 * This code listens for the application's reactivation event and opens the default window.
 */
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})
