import { schedule } from '@netlify/functions'

const str: string = 'hello'

export const handler = schedule('@daily', () => {
  console.log(str)
})
