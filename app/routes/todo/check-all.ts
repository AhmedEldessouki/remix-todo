import {json, redirect} from 'remix'
import {commitSession, getSession} from '~/sessions.server'
import type {ActionFunction, LoaderFunction} from 'remix'
import type {TaskType} from '~/types'

export const action: ActionFunction = async ({request}) => {
  const session = await getSession(request.headers.get('Cookie'))
  const formData = await request.formData()
  let isChecked = formData.get('tasks')

  const listName = new URL(request.url).searchParams.get('path')
  if (!listName) {
    return json(
      {message: 'List Name Is inValid'},
      {
        status: 404,
      },
    )
  }
  if (isChecked === null) return json({message: 'Form/Tasks was null'})

  const listData: TaskType = session.get(listName.toString())

  if (!listData) {
    return json(
      {message: 'List Not Found'},
      {
        status: 404,
      },
    )
  }

  const newListData: TaskType = {
    tasks: listData.tasks.map(task => {
      task.isDone = isChecked === 'true' ? true : false
      return task
    }),
    reminders: listData.reminders,
  }

  session.set(listName, newListData)

  return json(newListData, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}
