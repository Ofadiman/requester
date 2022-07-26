import chalk from 'chalk'
import { typeGuards } from './type-guards'
import { toUpper } from 'ramda'

type LoggedValue = object | boolean | string | number | null

export class Logger {
  public constructor(private readonly namespace: string) {
    this.namespace = toUpper(namespace)
  }

  public info(message: string, value?: LoggedValue): void {
    console.log(chalk.bgYellowBright(`${chalk.bold(`[${this.namespace}]`)} ${message}`))

    if (typeGuards.isNotUndefined(value)) {
      console.log(value)
    }
  }

  public error(message: string, value?: LoggedValue): void {
    console.log(chalk.bgRedBright(`${chalk.bold(`[${this.namespace}]`)} ${message}`))

    if (typeGuards.isNotUndefined(value)) {
      console.log(value)
    }
  }
}
