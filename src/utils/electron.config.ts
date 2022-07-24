import { z } from 'zod'

enum ENVIRONMENT_VARIABLES {
  LOG_LEVEL = 'LOG_LEVEL',
  NODE_ENV = 'NODE_ENV',
}

const electronConfigSchema = z
  .object({
    [ENVIRONMENT_VARIABLES.NODE_ENV]: z.string(),
    [ENVIRONMENT_VARIABLES.LOG_LEVEL]: z.string(),
  })
  .strict()

type InferredElectronConfig = z.infer<typeof electronConfigSchema>

class ElectronConfig {
  private readonly internalConfig: InferredElectronConfig

  public constructor() {
    const environment = Object.entries(ENVIRONMENT_VARIABLES).reduce(
      (accumulator, [key, value]) => {
        accumulator[key as ENVIRONMENT_VARIABLES] = process.env[value]

        return accumulator
      },
      {} as Record<ENVIRONMENT_VARIABLES, unknown>,
    )

    this.internalConfig = electronConfigSchema.parse(environment)
  }

  public get config(): InferredElectronConfig {
    return this.internalConfig
  }

  public get isDevelopment(): boolean {
    return this.internalConfig.NODE_ENV === 'development'
  }

  public get isMacOS(): boolean {
    return process.platform === 'darwin'
  }

  public get isLinux(): boolean {
    return process.platform === 'linux'
  }

  public get isWindows(): boolean {
    return process.platform === 'win32'
  }
}

export const electronConfig = new ElectronConfig()
