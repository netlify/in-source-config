import { schedule as somethingElse } from '@netlify/functions'

const str: string = 'hello'

export const handler = somethingElse('@daily', () => {
  console.log(str)
})
