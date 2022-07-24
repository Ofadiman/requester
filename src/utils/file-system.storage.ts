import Store from 'electron-store'

export enum FILE_SYSTEM_STORAGE_KEYS {
  REDUX_STORE = 'REDUX_STORE',
}

export const fileSystemStorage = new Store()
