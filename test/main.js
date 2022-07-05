import { join } from 'path'

import test from 'ava'

import { findISCDeclarationsInPath } from '../dist/index.js'

const testCases = [
  {
    file: 'cron_cjs_exports.js',
    expected: {
      schedule: '@daily',
    },
  },
  {
    file: 'cron_cjs_renamed.js',
    expected: {
      schedule: '@daily',
    },
  },
  {
    file: 'cron_cjs.js',
    expected: {
      schedule: '@daily',
    },
  },
  {
    file: 'cron_esm_renamed.js',
    expected: {
      schedule: '@daily',
    },
  },
  {
    file: 'cron_esm.js',
    expected: {
      schedule: '@daily',
    },
  },
  {
    file: 'cron_ts_renamed.ts',
    expected: {
      schedule: '@daily',
    },
  },
  {
    file: 'cron_ts.ts',
    expected: {
      schedule: '@daily',
    },
  },
  {
    file: 'cron_edge_functions.ts',
    expected: {
      schedule: '@daily',
    },
    config: {
      isHelperModule: (path) => path === 'netlify:edge',
    },
  },
  {
    file: 'cron_cjs_invalid_cron_expression.js',
    expectedError:
      'Warning: unable to find cron expression for scheduled function. `schedule` imported but not called or exported. If you meant to schedule a function, please check that `schedule` is invoked with an appropriate cron expression.',
  },
  {
    file: 'cron_cjs_schedule_not_called.js',
    expectedError:
      'Warning: unable to find cron expression for scheduled function. `schedule` imported but not called or exported. If you meant to schedule a function, please check that `schedule` is invoked with an appropriate cron expression.',
  },
  {
    file: 'cron_esm_additional_schedule_import.js',
    expected: {
      schedule: '@daily',
    },
  },
  {
    file: 'cron_esm_no_direct_export_renamed_reassigned.js',
    expected: {
      schedule: '@daily',
    },
  },
  {
    file: 'cron_esm_no_direct_export_renamed.js',
    expected: {
      schedule: '@daily',
    },
  },
  {
    file: 'cron_esm_no_direct_export.js',
    expected: {
      schedule: '@daily',
    },
  },
  {
    file: 'cron_esm_schedule_not_called.js',
    expectedError:
      'Warning: unable to find cron expression for scheduled function. `schedule` imported but not called or exported. If you meant to schedule a function, please check that `schedule` is invoked with an appropriate cron expression.',
  },
  {
    file: 'cron_esm_schedule_reassigned.js',
    expected: {
      schedule: '@daily',
    },
  },
]

for (const testCase of testCases) {
  const {
    expected,
    expectedError,
    file,
    config = { isHelperModule: (path) => path === '@netlify/functions' },
  } = testCase
  test(`${file}`, async (t) => {
    const path = join('test', 'fixtures', file)
    if (expectedError) {
      await t.throwsAsync(() => findISCDeclarationsInPath(path, config), {
        message: expectedError,
      })
    } else {
      const result = await findISCDeclarationsInPath(path, config)
      t.deepEqual(result, expected)
    }
  })
}
