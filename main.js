const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
  const browserWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  browserWindow.loadFile('index.html')
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
