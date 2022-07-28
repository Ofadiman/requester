import './dayjs.bootstrap'
import { MenuItem, Menu, app, BrowserWindow, dialog, ipcMain, session } from 'electron'
import { CHANNELS } from './constants/channels'
import { RootState } from './redux/store'
import { electronConfig } from './utils/electron.config'
import * as path from 'path'
import Store from 'electron-store'
import { FILE_SYSTEM_STORAGE_KEYS } from './constants/file-system-storage-keys'
import { typeGuards } from './utils/type-guards'
import { Logger } from './utils/logger'

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

if (electronConfig.isDevelopment) {
  app.setPath('userData', path.join(app.getAppPath(), 'userData'))
}

// It is very important to initialize the store after I set the `userData` path because otherwise, electron store will read the `userData` path before the change.
export const fileSystemStorage = new Store()

const createWindow = async (): Promise<void> => {
  const browserWindow = new BrowserWindow({
    height: 900,
    width: 1600,
    webPreferences: {
      sandbox: true, // I set this option to `true` because it will limit the renderer's process permissions while it is running, which translates into increased security. Official documentation recommends so. (https://www.electronjs.org/docs/latest/tutorial/sandbox)
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
    },
  })

  const menu = Menu.getApplicationMenu()
  if (typeGuards.isNotNull(menu) && electronConfig.isDevelopment) {
    menu.append(
      new MenuItem({
        label: 'Debug',
        submenu: [
          {
            label: 'Reset store',
            click: () => {
              browserWindow.webContents.send(CHANNELS.REDUX_STORE_RESET_FROM_MAIN_PROCESS)
            },
          },
        ],
      }),
    )

    Menu.setApplicationMenu(menu)
  }

  // TODO: Add functionality where the user can change the window state (e.g. height, width, maximization).
  browserWindow.maximize()

  // TODO: Figure out how to set custom icon for the application.
  // mainWindow.setIcon(path.join(__dirname, 'assets', 'peepo_happy.webp'))

  // and load the index.html of the app.
  await browserWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  if (electronConfig.isDevelopment) {
    browserWindow.webContents.openDevTools()
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Session modification logic must occur before window is created.
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        // TODO: Review the electron security documentation again and find out what exactly this header is being set up for.
        // I need this line so that I can send HTTP requests from React application to any URL.
        // There is a chance that it will not be needed in production mode.
        // It is possible that this configuration of Content-Security-Policy header will cause problems with the security of the application, but for now I don't understand how it works.
        'Content-Security-Policy': ['*'],
      },
    })
  })

  const logger = new Logger('ipc main')

  ipcMain.handle(CHANNELS.DIRECTORY_PICKER_OPEN, async (event) => {
    const browserWindowFromWebContents = BrowserWindow.fromWebContents(event.sender)
    if (browserWindowFromWebContents === null) {
      throw new Error(`Browser window could not be retrieved from web contents.`)
    }

    return dialog.showOpenDialog(browserWindowFromWebContents, {
      properties: ['openDirectory'],
    })
  })

  ipcMain.handle(CHANNELS.REDUX_STORE_INITIALIZE, () => {
    return fileSystemStorage.get(FILE_SYSTEM_STORAGE_KEYS.REDUX_STORE)
  })

  ipcMain.handle(CHANNELS.REDUX_STORE_PERSIST, (_event, store: RootState) => {
    fileSystemStorage.set(FILE_SYSTEM_STORAGE_KEYS.REDUX_STORE, store)
  })

  ipcMain.handle(CHANNELS.REDUX_STORE_CLEAR, () => {
    fileSystemStorage.clear()
  })

  ipcMain.handle(CHANNELS.HTTP_MAKE_REQUEST, (_event, args: any) => {
    logger.info('Arguments for http request', args)
  })

  await createWindow()

  // TODO: Figure out how to load browser extensions such as React/Redux dev tools.
  // if (isDev) {
  //   await session.defaultSession
  //     .loadExtension(
  //       path.join(__dirname, `../userData/extensions/react-dev-tools`), // This is the directory where loaded extensions should live.
  //     )
  //     .then((name) => console.log(name))
  //     .catch((err) => console.log(err))
  // }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (electronConfig.isLinux || electronConfig.isWindows) {
    app.quit()
  }
})

app.on('activate', async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow()
  }
})

process.on('uncaughtException', (error) => {
  console.error(`Uncaught exception occurred.`)
  console.error(error)

  if (electronConfig.isLinux || electronConfig.isWindows) {
    app.quit()
  }
})
