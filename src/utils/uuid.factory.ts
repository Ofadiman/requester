import { v4 } from 'uuid'

class UuidFactory {
  public generateVersion4(): string {
    return v4()
  }
}

export const uuidFactory = new UuidFactory()
