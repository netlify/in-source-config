import { schedule } from '@netlify/functions'

export const handler = schedule('@daily', () => {
  // function handler
})
