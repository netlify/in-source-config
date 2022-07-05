import { join } from "path"

import test from 'ava'

import { findISCDeclarationsInPath } from "../dist/index.js"

const testCases = [
  {
    file: "cron_cjs_exports.js",
    expected: {
      schedule: "@daily"
    }
  },
  {
    file: "cron_cjs_renamed.js",
    expected: {
      schedule: "@daily"
    }
  },
  {
    file: "cron_cjs.js",
    expected: {
      schedule: "@daily"
    }
  },
  {
    file: "cron_esm_renamed.js",
    expected: {
      schedule: "@daily"
    }
  },
  {
    file: "cron_esm.js",
    expected: {
      schedule: "@daily"
    }
  },
  {
    file: "cron_ts_renamed.ts",
    expected: {
      schedule: "@daily"
    }
  },
  {
    file: "cron_ts.ts",
    expected: {
      schedule: "@daily"
    }
  },
  {
    file: "cron_edge_functions.ts",
    expected: {
      schedule: "@daily"
    },
    config: {
      isHelperModule: path => path === "netlify:edge"
    }
  }
]

for (const testCase of testCases) {
  const { expected, file, config = { isHelperModule: path => path === "@netlify/functions" } } = testCase
  test(`${file}`, async t => {
    const result = await findISCDeclarationsInPath(join("test", "fixtures", file), config)
    t.deepEqual(result, expected)
  })
}
