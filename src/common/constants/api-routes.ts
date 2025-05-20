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
    },
    setting: {
      root: 'setting',
    },
  },
} as const;

Object.seal(routes);