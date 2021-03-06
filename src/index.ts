import { promises as fs } from 'fs'

import { parse } from '@babel/parser'
import { ArgumentPlaceholder, Expression, SpreadElement, JSXNamespacedName, Program } from '@babel/types'

import { createBindingsMethod } from './bindings.js'
import { getMainExport } from './exports.js'
import { getImports } from './imports.js'
import { parse as parseSchedule } from './properties/schedule.js'
import { nonNullable } from './utils.js'

export type ISCValues = Partial<ReturnType<typeof parseSchedule>>

interface ISCConfig {
  /**
   * The name of the module that helpers like `schedule` are imported from.
   */
  isHelperModule(name: string): boolean
}

// Parses a JS/TS file and looks for in-source config declarations. It returns
// an array of all declarations found, with `property` indicating the name of
// the property and `data` its value.
export const findISCDeclarationsInProgram = (ast: Program, config: ISCConfig): ISCValues => {
  const imports = ast.body.flatMap((node) => getImports(node, config.isHelperModule))

  const scheduledFuncsExpected = imports.filter(({ imported }) => imported === 'schedule').length
  let scheduledFuncsFound = 0

  const getAllBindings = createBindingsMethod(ast.body)
  const mainExports = getMainExport(ast.body, getAllBindings)
  const iscExports = mainExports
    .map(({ args, local: exportName }) => {
      const matchingImport = imports.find(({ local: importName }) => importName === exportName)

      if (matchingImport === undefined) {
        return null
      }

      switch (matchingImport.imported) {
        case 'schedule': {
          const parsed = parseSchedule({ args }, getAllBindings)

          if (parsed.schedule) {
            scheduledFuncsFound += 1
          }

          return parsed
        }
        default:
        // no-op
      }

      return null
    })
    .filter(nonNullable)

  if (scheduledFuncsFound < scheduledFuncsExpected) {
    throw new Error(
      'Warning: unable to find cron expression for scheduled function. `schedule` imported but not called or exported. If you meant to schedule a function, please check that `schedule` is invoked with an appropriate cron expression.',
    )
  }

  const mergedExports: ISCValues = iscExports.reduce((acc, obj) => ({ ...acc, ...obj }), {})

  return mergedExports
}

export type ISCHandlerArg = ArgumentPlaceholder | Expression | SpreadElement | JSXNamespacedName

export interface ISCExport {
  local: string
  args: ISCHandlerArg[]
}

// Parses a JS/TS file and returns the resulting AST.
const parseFile = async (path: string) => {
  const code = await fs.readFile(path, 'utf8')
  const ast = parse(code, {
    plugins: ['typescript'],
    sourceType: 'module',
  })

  return ast.program
}

// Attempts to parse a JS/TS file at the given path, returning its AST if
// successful, or `null` if not.
const safelyParseFile = async (path: string) => {
  if (!path) {
    return null
  }

  try {
    return await parseFile(path)
  } catch {
    return null
  }
}

export const findISCDeclarationsInPath = async (path: string, config: ISCConfig): Promise<ISCValues | null> => {
  const program = await safelyParseFile(path)
  if (!program) {
    return null
  }
  return findISCDeclarationsInProgram(program, config)
}
