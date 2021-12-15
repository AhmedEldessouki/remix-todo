import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogLabel,
  AlertDialogOverlay,
} from '@reach/alert-dialog'
import React from 'react'
import {
  redirect,
  Link,
  useFetcher,
  useLoaderData,
  json,
  useMatches,
} from 'remix'
import {v4} from 'uuid'
import {commitSession, getSession} from '~/sessions.server'
import type {ActionFunction, LoaderFunction, LinksFunction} from 'remix'
import type {ObjectOfStrings, TaskType, TodoIdRouteLoaderData} from '~/types'

import addReminderStyles from '~/styles/add-reminder.css'

// ! Todo: Check the Date and Time Input
// ! Todo: If the also have reported bug concerning
// ! Todo: Some days
// ! Todo: Also on FireFox Time Doesn't Work!! on DateTimeLocal input

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: addReminderStyles,
  },
]

type Keys = 'taskId' | 'start' | 'end'

export const action: ActionFunction = async ({request, params}) => {
  const session = await getSession(request.headers.get('Cookie'))
  const formData = await request.formData()

  const toBeReturned: {
    errors: ObjectOfStrings
    formData: Record<Keys, string | null>
  } = {
    errors: {},
    formData: {
      taskId: null,
      start: null,
      end: null,
    },
  }

  const listId = params['id']

  if (!listId) {
    toBeReturned.errors['message'] = 'ListName is undefined'
    return redirect(`/todo/${listId}`, {
      status: 404,
      statusText: 'Task Id is missing.',
    })
  }

  const listData: TaskType = session.get(listId)

  toBeReturned.formData.taskId = formData.get('taskId')?.toString() ?? ''
  toBeReturned.formData.start =
    formData.get('start')?.toString() ?? new Date().toISOString()
  toBeReturned.formData.end = formData.get('end')?.toString() ?? ''

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

  if (Object.values(toBeReturned.errors).length > 0) {
    return redirect(`/todo/${listId}`, {
      status: 404,
      statusText: JSON.stringify(toBeReturned.errors, null, 2),
    })
  }

  session.set(listId, listData)

  return redirect(`/todo/${listId}`, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export const loader: LoaderFunction = async ({params, request}) => {
  console.log(params, request.url)
  const listId = params['id']
  const session = await getSession(request.headers.get('Cookie'))

  if (!listId) {
    return json({errorMessage: `listId was not found!`})
  }

  const list = session.get(listId)
  return json({
    taskId: new URLSearchParams(request.url).get('task-id'),
  })
}

export default function AddReminder() {
  const {taskId} = useLoaderData<{taskId: string; taskIndex: number}>()
  const [, , listData] = useMatches()
  console.log(listData)
  const cancelRef = React.useRef(null)
  const fetcher = useFetcher()

  const today = new Date().toISOString()
  // ? Input Date Syntax "2017-06-01T08:30"
  const [start, setStart] = React.useState(
    new Date().toISOString().substring(0, 16),
  )
  const [end, setEnd] = React.useState(start)
  const taskRemindersCount = (
    listData.data as TodoIdRouteLoaderData
  ).listData.reminders.filter(reminder => reminder.taskId === taskId).length

  // if (taskRemindersCount > 1) {
  // ! TODO: Maybe a message tell the user's
  // ! how many reminders he/she has related
  // ! to that Task. Ask if they want to Edit
  // ! Or Add a new one (This Doesn't make sense Really)
  // }

  return (
    <AlertDialogOverlay leastDestructiveRef={cancelRef}>
      <AlertDialogContent>
        <fetcher.Form method="post">
          <AlertDialogLabel>Create Reminder</AlertDialogLabel>
          <AlertDialogDescription>
            <input type="hidden" name="taskId" value={taskId} />
            <label htmlFor="reminder-start">
              From
              <input
                min={new Date().toISOString().substring(0, 16)}
                type="datetime-local"
                name="start"
                value={start}
                onBlur={() => {
                  if (
                    new Date(start).getFullYear() < new Date(end).getFullYear()
                  )
                    return
                  if (new Date(start).getMonth() < new Date(end).getMonth())
                    return
                  if (new Date(start).getDay() < new Date(end).getDay()) return
                  if (new Date(start).getHours() < new Date(end).getHours())
                    return
                  if (new Date(start).getMinutes() < new Date(end).getMinutes())
                    return
                  setEnd(start)
                }}
                onChange={e => {
                  setStart(e.target.value)
                }}
                id="reminder-start"
              />
            </label>
            <label htmlFor="reminder-end">
              To
              <input
                min={start}
                type="datetime-local"
                name="end"
                id="reminder-end"
                value={end}
                onChange={e => {
                  console.log(e)
                  setEnd(e.target.value)
                }}
                required
              />
            </label>
          </AlertDialogDescription>
          <div className="alert-buttons">
            <button type="submit" className="btn-link-alike">
              Add Reminder
            </button>
            <Link ref={cancelRef} to="..">
              Nevermind
            </Link>
          </div>
        </fetcher.Form>
      </AlertDialogContent>
    </AlertDialogOverlay>
  )
}
