import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogLabel,
  AlertDialogOverlay,
} from '@reach/alert-dialog'
import React from 'react'
import {useFetcher, useMatches} from 'remix'
import Bell from './bell'
import VisuallyHidden from '@reach/visually-hidden'
import {ActionReturnable} from '~/types'

const getTodayDate = () => {
  const date = new Date()
    .toLocaleString('en', {hour12: false})
    .replace(', ', 'T')
    .substring(0, 16)
    .replace(/[\/]/g, '-')

  return (
    date.substring(6, 10) +
    '-' +
    date.substring(0, 2) +
    '-' +
    date.substring(3, 5) +
    date.substring(10, 16)
  )
}

export default function AddReminder({taskId}: {taskId: string}) {
  const cancelRef = React.useRef(null)
  const fetcher = useFetcher<ActionReturnable>()
  const match = useMatches()
  const {current: today} = React.useRef(getTodayDate())
  const [isOpen, setIsOpen] = React.useState(false)
  const [start, setStart] = React.useState(today)
  const [end, setEnd] = React.useState(start)

  React.useEffect(() => {
    if (Date.now() > new Date(today).getTime()) {
      setStart(getTodayDate())
      setEnd(getTodayDate())
    }
  }, [])
  // const taskRemindersCount = (
  //   listData.data as TodoIdRouteLoaderData
  // ).listData.reminders.filter(reminder => reminder.taskId === taskId).length

  // if (taskRemindersCount > 1) {
  // ! TODO: Maybe a message tell the user's
  // ! how many reminders he/she has related
  // ! to that Task. Ask if they want to Edit
  // ! Or Add a new one (This Doesn't make sense Really)
  // }

  return (
    <>
      <button
        type="button"
        className="btn-link-alike"
        onClick={() => setIsOpen(s => !s)}
      >
        <Bell />
        <VisuallyHidden>add reminder</VisuallyHidden>
      </button>
      {isOpen && (
        <AlertDialogOverlay leastDestructiveRef={cancelRef}>
          <AlertDialogContent>
            <fetcher.Form
              method="post"
              action={`${match[match.length - 1].pathname}/add-reminder`}
            >
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
                      if (new Date(start).getTime() < new Date(end).getTime())
                        return
                      setEnd(start)
                    }}
                    onChange={e => {
                      console.log(e)
                      if (
                        new Date(today).getTime() >
                        new Date(e.target.value).getTime()
                      )
                        return
                      console.log(`today.getMinutes()`, today, e.target.value)
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
                      setEnd(e.target.value)
                    }}
                    required
                  />
                </label>
                {/* // ! Handle AddReminder error here */}
                {fetcher.data?.errors && (
                  <p className="warning">
                    {JSON.stringify(fetcher.data.errors, null, 2)}
                  </p>
                )}
              </AlertDialogDescription>
              <div className="alert-buttons">
                <button type="submit" className="btn-link-alike">
                  Add Reminder
                </button>
                <button
                  type="button"
                  className="btn-link-alike"
                  ref={cancelRef}
                  onClick={() => setIsOpen(state => !state)}
                >
                  Nevermind
                </button>
              </div>
            </fetcher.Form>
          </AlertDialogContent>
        </AlertDialogOverlay>
      )}
    </>
  )
}
