import {v4} from 'uuid'
import {json, redirect} from 'remix'
import {commitSession, getSession} from '~/sessions.server'
import type {ActionFunction} from 'remix'
import type {List, ListData} from '~/types'

export const action: ActionFunction = async ({request, params}) => {
  const session = await getSession(request.headers.get('Cookie'))
  const formData = await request.formData()

  const task: ListData = {
    name: formData.get('name')?.toString() ?? '',
    id: v4(),
    description: formData.get('description')?.toString() ?? '',
    isDone: false,
  }

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

  if (task.name === null) return json({message: 'Task must have a name.'})

  session.set(listName, {...listData, tasks: [...listData.tasks, task]})

  return redirect(`/todo/${path}`, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}
