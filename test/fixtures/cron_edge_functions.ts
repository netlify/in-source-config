import { schedule } from 'netlify:edge'

export const handler = schedule('@daily', () => {
  console.log('hello world')
})
