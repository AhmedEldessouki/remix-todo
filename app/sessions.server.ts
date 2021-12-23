import {createCookieSessionStorage} from 'remix'

const {commitSession, destroySession, getSession} = createCookieSessionStorage({
  cookie: {
    name: 'NEMO-Todo',
    sameSite: 'lax',
    httpOnly: true,
    secure: true,
    expires: new Date(`2100-01-01`),
    secrets: ['SeCrEt'],
  },
})

export {destroySession, getSession, commitSession}
