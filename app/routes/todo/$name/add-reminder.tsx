import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogLabel,
  AlertDialogOverlay,
} from '@reach/alert-dialog'
import React from 'react'
import {
  ActionFunction,
  redirect,
  Link,
  LoaderFunction,
  MetaFunction,
  useFetcher,
  useLoaderData,
  json,
  LinksFunction,
} from 'remix'
import {v4} from 'uuid'
import Bell from '~/components/bell'
import {commitSession, getSession} from '~/sessions.server'
import {ObjectOfStrings, TaskType} from '~/types'

import addReminderStyles from '~/styles/add-reminder.css'

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: addReminderStyles,
  },
]

export const meta: MetaFunction = ({params}) => {
  const listName = params['name']
  if (!listName)
    return {
      title: 'Invalid ListName!',
      notes: 'Something went wrong. Please check list name.',
    }

  return {
    title: listName,
    notes: 'Congrats for sharing your list with people! 🥳',
  }
}

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

  return (
    <AlertDialogOverlay
      style={{background: 'hsla(0, 50%, 50%, 0.85)'}}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogContent style={{background: '#f0f0f0'}}>
        <Link aria-label="Delete something" to="/add-reminder">
          <Bell />
        </Link>
        <fetcher.Form method="put">
          <AlertDialogLabel>Please Confirm!</AlertDialogLabel>
          <AlertDialogDescription>
            Blah Blah Blaaaaaaaaaaaaa!
            <input type="hidden" name="taskId" value={taskId} />
            <input type="hidden" name="index" value={taskIndex} />
            <label htmlFor="reminder-start">
              From
              <input
                min={new Date().toLocaleTimeString()}
                type="datetime-local"
                name="start"
                id="reminder-start"
              />
            </label>
            <label htmlFor="reminder-end">
              To
              <input
                min={new Date().toLocaleTimeString()}
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
