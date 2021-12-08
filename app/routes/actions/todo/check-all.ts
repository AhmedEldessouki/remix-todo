import {json, redirect} from 'remix'
import {commitSession, getSession} from '~/sessions.server'
import type {ActionFunction} from 'remix'
import {List} from '~/types'

export const action: ActionFunction = async ({request, params}) => {
  const session = await getSession(request.headers.get('Cookie'))
  const formData = await request.formData()
  const isChecked = formData.get('tasks')

  const path = params['name']
  if (!path) {
    return json(
      {message: 'List Name Is inValid'},
      {
        status: 404,
      },
    )
  }
  const listName = decodeURIComponent(path)

  const listData: List = session.get(listName)

  if (isChecked === null) return json({message: 'Form/Tasks was null'})

  const newListData = listData.tasks.map(task => {
    task.isDone = Boolean(isChecked)
    return task
  })

  session.set(listName, newListData)

  return redirect(`/todo/${path}`, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}
