import {v4} from 'uuid'
import {json, redirect} from 'remix'
import {commitSession, getSession} from '~/sessions.server'
import type {ActionFunction} from 'remix'
import type {List, ListData} from '~/types'

export const action: ActionFunction = async ({request, params}) => {
  const session = await getSession(request.headers.get('Cookie'))
  const formData = await request.formData()

  const newTask: ListData = {
    name: formData.get('name')?.toString() ?? '',
    id: v4(),
    description: formData.get('description')?.toString() ?? '',
    isDone: false,
  }

  const listName = new URL(request.url).searchParams.get('path')

  if (!listName) {
    return json(
      {message: 'List Name Is inValid'},
      {
        status: 404,
      },
    )
  }

  const listData: List = session.get(listName)

  if (newTask.name === null) return json({message: 'Task must have a name.'})

  session.set(listName, {...listData, tasks: [...listData.tasks, newTask]})

  return json(newTask, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}
