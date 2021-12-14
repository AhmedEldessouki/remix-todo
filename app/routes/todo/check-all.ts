import {json} from 'remix'
import {commitSession, getSession} from '~/sessions.server'
import type {ActionFunction} from 'remix'
import type {TaskType} from '~/types'

export const action: ActionFunction = async ({request, params}) => {
  const session = await getSession(request.headers.get('Cookie'))
  const formData = await request.formData()
  let isChecked = formData.get('tasks')

  const listId = new URL(request.url).searchParams.get('id')
  console.log(params, listId, new URLSearchParams(request.url))
  if (!listId) {
    return json(
      {message: 'List Name Is inValid'},
      {
        status: 404,
      },
    )
  }
  if (isChecked === null) return json({message: 'Form/Tasks was null'})

  const listData: TaskType = session.get(listId.toString())

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

  session.set(listId, newListData)

  return json(newListData, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}
