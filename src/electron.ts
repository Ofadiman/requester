import './dayjs.bootstrap'
import { MenuItem, Menu, app, BrowserWindow, dialog, ipcMain } from 'electron'
import { CHANNELS } from './constants/channels'
import { RootState } from './redux/store'
import { watch } from 'chokidar'
import * as fs from 'node:fs'
import { electronConfig } from './utils/electron.config'
import {
  default as installExtensions,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer'
import * as path from 'path'
import Store from 'electron-store'
import { FILE_SYSTEM_STORAGE_KEYS } from './constants/file-system-storage-keys'
import { typeGuards } from './utils/type-guards'
import { Logger } from './utils/logger'
import axios, { AxiosResponse } from 'axios'
import { Workspace } from './redux/workspaces/workspaces.slice'
import { CreateHttpRequestFileArgs } from './preload'
import { HTTP_METHODS } from './constants/http-methods'
import { IndentationText, NewLineKind, Project, QuoteKind, Node, ts } from 'ts-morph'
import { requireFromString } from 'module-from-string'
import { HttpRequestsSynchronizeAction } from './redux/http-requests/http-requests.slice'

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
          {
            label: 'Navigate to http requests view',
            click: () => {
              browserWindow.webContents.send(CHANNELS.NAVIGATION, { to: '/http-requests' })
            },
          },
          {
            label: 'Navigate to create workspace view',
            click: () => {
              browserWindow.webContents.send(CHANNELS.NAVIGATION, { to: '/create-workspace' })
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

  // TODO: Take this file path from current workspace configuration.
  // TODO: Close watcher when current workspace changes.
  watch('/home/ofadiman/projects/private/requester/.requester').on('all', async (event, path) => {
    // TODO: Handle other kind of events.
    if (event === 'change') {
      const fileContent = fs.readFileSync(path, {
        encoding: 'utf8',
      })

      // INFO: I have to transpile file content from TypeScript to JavaScript because otherwise, it cannot be loaded as module using `require`.
      // TODO: It is possible that the file will contain errors and transpiling it will fail. I want to handle this case later.
      const transpiledFileContent = ts.transpile(fileContent, { target: ts.ScriptTarget.ES5 })
      // TODO: I want to add validation here instead of casting to make sure that the content is matching the expected schema.
      const requiredFromString = requireFromString(
        transpiledFileContent,
      ) as HttpRequestsSynchronizeAction['payload']

      browserWindow.webContents.send(CHANNELS.FILE_SYSTEM_HTTP_REQUEST_CHANGED, requiredFromString)
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  await installExtensions([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])

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

  ipcMain.handle(
    CHANNELS.HTTP_MAKE_REQUEST,
    async (_event, args: any): Promise<Pick<AxiosResponse, 'data' | 'status' | 'headers'>> => {
      logger.info('Arguments for http request', args)

      // CONTEXT: It is possible, that I'd like a behavior where axios never throws an error, no matter what response code is returned by the API.
      // TODO: Check out `validateStatus` function available in the axios API. (https://axios-http.com/docs/handling_errors)
      const response = await axios.get(`https://jsonplaceholder.typicode.com/todos/1`)
      logger.info('Axios response in electron', response)

      return { headers: response.headers, data: response.data, status: response.status }
    },
  )

  ipcMain.handle(
    CHANNELS.WORKSPACES_CREATE_DIRECTORY,
    async (_event, args: Workspace): Promise<void> => {
      logger.info(`Arguments while handling ${CHANNELS.WORKSPACES_CREATE_DIRECTORY}`, args)

      const REQUESTER_WORKSPACE_DIRECTORY_NAME = '.requester'
      const requesterDirectoryPath = path.join(args.path, REQUESTER_WORKSPACE_DIRECTORY_NAME)
      const selectedDirectoryDoesNotExist = fs.existsSync(requesterDirectoryPath) === false
      if (selectedDirectoryDoesNotExist) {
        fs.mkdirSync(requesterDirectoryPath)
      }
    },
  )

  ipcMain.handle(
    CHANNELS.HTTP_REQUESTS_CREATE,
    async (_event, args: CreateHttpRequestFileArgs): Promise<void> => {
      logger.info(`Arguments while handling ${CHANNELS.HTTP_REQUESTS_CREATE}`, args)

      const REQUESTER_WORKSPACE_DIRECTORY_NAME = '.requester'
      const filePath = path.join(
        args.workspace.path,
        REQUESTER_WORKSPACE_DIRECTORY_NAME,
        // TODO: Handle a case where request with the same name already exists in the directory.
        `${args.httpRequest.name}.ts`,
      )

      fs.writeFileSync(
        filePath,
        `export const meta = {
  type: 'GET',
  url: '',
}

export const body = {}

export const queryParameters = {}

export const pathParameters = {}

export const headers = {}
`,
        {
          encoding: 'utf8',
        },
      )
    },
  )

  ipcMain.handle(
    CHANNELS.HTTP_REQUESTS_CHANGE_METHOD,
    async (
      _event,
      args: {
        requestName: string
        newMethod: HTTP_METHODS
        workspacePath: string
      },
    ) => {
      const REQUESTER_WORKSPACE_DIRECTORY_NAME = '.requester'
      const filePath = path.join(
        args.workspacePath,
        REQUESTER_WORKSPACE_DIRECTORY_NAME,
        `${args.requestName}.ts`,
      )

      const project = new Project({
        // I want to use TypeScript settings that I'm already using in the project to keep consistency in file outputs.
        tsConfigFilePath: './tsconfig.json',
        // I don't want to load all source files that are declared in tsconfig because I want to work on 1 file only.
        skipAddingFilesFromTsConfig: true,
        // I don't want to include all related files from the file that I will load manually.
        skipFileDependencyResolution: true,
        manipulationSettings: {
          indentationText: IndentationText.TwoSpaces,
          insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
          newLineKind: NewLineKind.LineFeed,
          quoteKind: QuoteKind.Single,
          usePrefixAndSuffixTextForRename: false,
          useTrailingCommas: true,
        },
      })

      project.addSourceFileAtPath(filePath)

      const sourceFile = project.getSourceFile(filePath)
      if (typeGuards.isUndefined(sourceFile)) {
        throw new Error(`Source file at path "${filePath}" not found!`)
      }

      const metaVariableDeclaration = sourceFile.getVariableDeclarationOrThrow('meta')

      const updateHttpMethod = (node: Node) => {
        if (node.isKind(ts.SyntaxKind.Identifier)) {
          // TODO: More intuitive name for http request method would probably be `method` instead of `type`.
          if (node.getText() === 'type') {
            // If the current `node` is an identifier, it will have 3 child nodes. A node for `type`, a node for `:`, and a node for `POST`.
            const colonNode = node.getNextSiblingOrThrow()
            const httpMethodLiteralNode = colonNode.getNextSiblingOrThrow()
            httpMethodLiteralNode.replaceWithText(`'${args.newMethod}'`)
          }
        }

        node.forEachChild((childNode) => updateHttpMethod(childNode))
      }

      metaVariableDeclaration.forEachChild((node) => {
        updateHttpMethod(node)
      })

      sourceFile.saveSync()
    },
  )

  ipcMain.handle(
    CHANNELS.HTTP_REQUESTS_CHANGE_URL,
    async (
      _event,
      args: {
        requestName: string
        newUrl: string
        workspacePath: string
      },
    ) => {
      const REQUESTER_WORKSPACE_DIRECTORY_NAME = '.requester'
      const filePath = path.join(
        args.workspacePath,
        REQUESTER_WORKSPACE_DIRECTORY_NAME,
        `${args.requestName}.ts`,
      )

      const project = new Project({
        // I want to use TypeScript settings that I'm already using in the project to keep consistency in file outputs.
        tsConfigFilePath: './tsconfig.json',
        // I don't want to load all source files that are declared in tsconfig because I want to work on 1 file only.
        skipAddingFilesFromTsConfig: true,
        // I don't want to include all related files from the file that I will load manually.
        skipFileDependencyResolution: true,
        manipulationSettings: {
          indentationText: IndentationText.TwoSpaces,
          insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
          newLineKind: NewLineKind.LineFeed,
          quoteKind: QuoteKind.Single,
          usePrefixAndSuffixTextForRename: false,
          useTrailingCommas: true,
        },
      })

      project.addSourceFileAtPath(filePath)

      const sourceFile = project.getSourceFile(filePath)
      if (typeGuards.isUndefined(sourceFile)) {
        throw new Error(`Source file at path "${filePath}" not found!`)
      }

      const metaVariableDeclaration = sourceFile.getVariableDeclarationOrThrow('meta')

      const updateHttpMethod = (node: Node) => {
        if (node.isKind(ts.SyntaxKind.Identifier)) {
          if (node.getText() === 'url') {
            const colonNode = node.getNextSiblingOrThrow()
            const httpMethodLiteralNode = colonNode.getNextSiblingOrThrow()
            httpMethodLiteralNode.replaceWithText(`'${args.newUrl}'`)
          }
        }

        node.forEachChild((childNode) => updateHttpMethod(childNode))
      }

      metaVariableDeclaration.forEachChild((node) => {
        updateHttpMethod(node)
      })

      sourceFile.saveSync()
    },
  )

  await createWindow()
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
