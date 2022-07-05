import { Statement } from '@babel/types'

import { isImport, isRequire } from './helpers.js'
import { nonNullable } from './utils.js'

// Finds import/require statements of a given path in an AST.
export const getImports = (node: Statement, isHelperModule: (path: string) => boolean) => {
  const esmImports = getImportsFromESM(node, isHelperModule)

  if (esmImports.length !== 0) {
    return esmImports
  }

  const cjsImports = getImportsFromCJS(node, isHelperModule)

  return cjsImports
}

// Finds import/require statements of a given path in a CJS AST.
const getImportsFromCJS = (node: Statement, isHelperModule: (path: string) => boolean) => {
  if (node.type !== 'VariableDeclaration') {
    return []
  }

  const { declarations } = node
  const requireDeclaration = declarations.find(
    (declaration) => declaration.type === 'VariableDeclarator' && isRequire(declaration.init, isHelperModule),
  )

  if (requireDeclaration === undefined || requireDeclaration.id.type !== 'ObjectPattern') {
    return []
  }

  const imports = requireDeclaration.id.properties
    .map((property) => {
      if (property.type !== 'ObjectProperty') {
        return
      }

      const { key, value } = property

      if (key.type !== 'Identifier' || value.type !== 'Identifier') {
        return
      }

      return { imported: key.name, local: value.name }
    })
    .filter(nonNullable)

  return imports
}

// Finds import/require statements of a given path in an ESM AST.
const getImportsFromESM = (node: Statement, isHelperModule: (path: string) => boolean) => {
  if (!isImport(node, isHelperModule)) {
    return []
  }

  const { specifiers } = node

  const imports = specifiers
    .map((specifier) => {
      if (specifier.type !== 'ImportSpecifier') {
        return
      }

      const { imported, local } = specifier

      if (imported.type !== 'Identifier' || local.type !== 'Identifier') {
        return
      }

      return { imported: imported.name, local: local.name }
    })
    .filter(nonNullable)

  return imports
}
