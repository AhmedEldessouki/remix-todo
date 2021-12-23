import {redirect, json, useLoaderData} from 'remix'
import {getSession} from '~/sessions.server'
import type {LoaderFunction, MetaFunction} from 'remix'

export const meta: MetaFunction = () => {
  return {
    title: 'Todo',
    notes:
      'Here you can navigate to a list or' +
      ' go to create list to create a new list.',
  }
}

export const loader: LoaderFunction = async ({request}) => {
  const session = await getSession(request.headers.get('Cookie'))

  if (!session.has('lists')) {
    return redirect('/todo/new')
  }

  return json({
    message:
      'Welcome To The ToDo Tab Now ' +
      'You Can Start Whatever You Wanna Do With It.',
  })
}

export default function Todo() {
  const {message} = useLoaderData()
  return (
    <div>
      <p>{message}</p>
    </div>
  )
}
