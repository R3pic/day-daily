export const routes = {
  swagger: 'documentation',

  theme: {
    root: 'themes',
    today: 'today',
  },

  diary: {
    root: 'diaries',
    recent: 'recent',
  },

  user: {
    root: 'users',
    detail: {
      diaries: ':id/diaries',
    },
  },

  me: {
    root: 'me',
    diary: {
      root: 'diaries',
      detail: 'diaries/:id',
      calendar: {
        root: 'calendar',
      },
    },
    setting: {
      root: 'setting',
    },
    info: {
      root: 'info',
    },
    password: {
      root: 'password',
    },
  },
} as const;

Object.seal(routes);