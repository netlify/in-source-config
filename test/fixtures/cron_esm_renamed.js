import { schedule as somethingElse } from '@netlify/functions'

export const handler = somethingElse('@daily', () => {
  // function handler
})
