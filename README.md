[![Build](https://github.com/netlify/in-source-config/workflows/Build/badge.svg)](https://github.com/netlify/in-source-config/actions)
[![Node](https://img.shields.io/node/v/@netlify/in-source-config.svg?logo=node.js)](https://www.npmjs.com/package/@netlify/in-source-config)

# @netlify/in-source-config

`@netlify/in-source-config` is the code parser that Netlify uses for its in-source-configuration.

```ts
// Input:
import { schedule } from "@netlify/functions"

export const handler = schedule("@daily", () => { ... })

// Output:
{ schedule: "@daily" }
```

## Contributors

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for instructions on how to set up and work on this repository. Thanks
for contributing!
