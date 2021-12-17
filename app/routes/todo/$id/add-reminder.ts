import React from 'react'
import {redirect, json} from 'remix'
import {v4} from 'uuid'
import {commitSession, getSession} from '~/sessions.server'
import type {ActionFunction} from 'remix'
import type {ActionReturnable, TaskType} from '~/types'

// ! Todo: Check the Date and Time Input
// ! Todo: If the also have reported bug concerning
// ! Todo: Some days
// ! Todo: Also on FireFox Time Doesn't Work!! on DateTimeLocal input

type Keys = 'taskId' | 'start' | 'end'

export const action: ActionFunction = async ({request, params}) => {
  const session = await getSession(request.headers.get('Cookie'))
  const formData = await request.formData()

  const toBeReturned: ActionReturnable = {
    errors: {},
    formData: {},
  }

  const listId = params['id']

  if (!listId) {
    toBeReturned.errors.message = 'ListName is undefined'
    return json(toBeReturned, {
      status: 422,
    })
  }

  const listData: TaskType = session.get(listId)

  toBeReturned.formData.taskId = formData.get('taskId')?.toString()
  toBeReturned.formData.start = formData.get('start')?.toString()
  toBeReturned.formData.end = formData.get('end')?.toString()

  if (!toBeReturned.formData.taskId) {
    toBeReturned.errors.taskId = 'ListName is undefined'
    return json(toBeReturned, {
      status: 422,
    })
  }
  if (!toBeReturned.formData.end) {
    toBeReturned.errors.end = 'To Date must be provided'
    return json(toBeReturned, {
      status: 422,
    })
  }
  if (!toBeReturned.formData.start) {
    toBeReturned.formData.start = new Date().toISOString()
  }

  const index = listData.tasks.findIndex(
    task => task.id === toBeReturned.formData.taskId,
  )
  console.log(
    toBeReturned.formData.taskId,
    toBeReturned.formData.start,
    toBeReturned.formData.end,
    v4(),
  )
  listData.reminders.push({
    taskId: toBeReturned.formData.taskId,
    start: new Date(toBeReturned.formData.start).getTime(),
    end: new Date(toBeReturned.formData.end).getTime(),
    id: v4(),
  })

  session.set(listId, listData)

  return redirect(`/todo/${listId}`, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}
