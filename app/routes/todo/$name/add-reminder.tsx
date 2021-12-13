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
  useSearchParams,
} from 'remix'
import {v4} from 'uuid'
import {commitSession, getSession} from '~/sessions.server'
import type {ActionFunction, LoaderFunction, LinksFunction} from 'remix'
import type {ObjectOfStrings, TaskType} from '~/types'

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

  const path = params['name']
  const m = new URLSearchParams(request.url)
  console.log(params, m)
  if (!path) {
    toBeReturned.errors['message'] = 'ListName is undefined'
    return redirect('..', {
      status: 404,
      statusText: 'Task Id is missing.',
    })
  }
  const listName = decodeURIComponent(path)

  const listData: TaskType = session.get(listName)

  toBeReturned.formData.taskId = formData.get('taskId')?.toString() ?? ''
  toBeReturned.formData.start = formData.get('start')?.toString() ?? ''
  toBeReturned.formData.end = formData.get('end')?.toString() ?? ''

  if (!toBeReturned.formData.taskId) throw new Error('must provide ID')

  const index = listData.tasks.findIndex(
    task => task.id === toBeReturned.formData.taskId,
  )
  console.log(
    toBeReturned.formData.taskId,
    toBeReturned.formData.start,
    toBeReturned.formData.end,
    v4(),
  )
  // listData.reminders.push({
  //   taskId: toBeReturned.formData.taskId,
  //   start: toBeReturned.formData.start,
  //   end: toBeReturned.formData.end,
  //   id: v4(),
  // })

  if (Object.values(toBeReturned.errors).length > 0) {
    return redirect('..', {
      status: 404,
      statusText: JSON.stringify(toBeReturned.errors, null, 2),
    })
  }

  session.set(listName, listData)

  return redirect('..', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export const loader: LoaderFunction = ({params}) => {
  console.log(params)
  return json(params)
}

export default function AddReminder() {
  const {taskId, taskIndex} =
    useLoaderData<{taskId: string; taskIndex: number}>()
  const cancelRef = React.useRef(null)
  const fetcher = useFetcher()
  const today = new Date()
  // 2017-06-01T08:30">
  const minStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}T${today.getHours()}-${today.getMinutes()}`
  const [minDate, setMinDate] = React.useState(minStr)
  return (
    <AlertDialogOverlay leastDestructiveRef={cancelRef}>
      <AlertDialogContent>
        <fetcher.Form method="put">
          <AlertDialogLabel>Please Confirm!</AlertDialogLabel>
          <AlertDialogDescription>
            <input type="hidden" name="taskId" value={taskId} />
            <input type="hidden" name="index" value={taskIndex} />
            <label htmlFor="reminder-start">
              From
              <input
                min={minStr}
                aria-min={minStr}
                type="datetime-local"
                name="start"
                value={minDate}
                onChange={e => {
                  console.log(e.target.value)
                  setMinDate(e.target.value)
                }}
                id="reminder-start"
              />
            </label>
            <label htmlFor="reminder-end">
              To
              <input
                min={minDate}
                aria-min={minDate}
                type="datetime-local"
                name="end"
                id="reminder-end"
                required
              />
            </label>
          </AlertDialogDescription>
          <div className="alert-buttons">
            <button type="submit">Add Reminder</button>
            <Link ref={cancelRef} to="..">
              Nevermind
            </Link>
          </div>
        </fetcher.Form>
      </AlertDialogContent>
    </AlertDialogOverlay>
  )
}
