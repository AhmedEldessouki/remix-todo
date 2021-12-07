import {redirect, useLoaderData} from 'remix'
import type {LoaderFunction} from 'remix'
import {getSession} from '~/sessions.server'
import {Lists} from '~/types'

export const loader: LoaderFunction = async ({request}) => {
  const session = await getSession(request.headers.get('Cookie'))

  if (!session.has('lists')) {
    return redirect('/todo/new')
  }

  return 'Welcome To The ToDo Tab Now You Can Start Whatever You Wanna Do With It.'
}

export default function Todo() {
  const message = useLoaderData<string>()
  return (
    <div>
      <p>{message}</p>
    </div>
  )
}
