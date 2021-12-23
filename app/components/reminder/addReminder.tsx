import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogLabel,
  AlertDialogOverlay,
} from '@reach/alert-dialog'
import React from 'react'
import {useFetcher, useMatches} from 'remix'
import VisuallyHidden from '@reach/visually-hidden'
import Bell from './bell'
import RelatedReminders from './relatedReminders'
import ReminderDisplay from './reminder'
import type {
  ActionReturnable,
  TaskReminder,
  TodoIdRouteLoaderData,
} from '~/types'

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
  const [, , routeData] = useMatches()
  const {current: today} = React.useRef(getTodayDate())
  const [isOpen, setIsOpen] = React.useState(false)
  const [isReminders, setIsReminders] = React.useState(false)
  const [reminders, setReminders] = React.useState<TaskReminder[]>(
    (routeData.data as TodoIdRouteLoaderData).listData.reminders.filter(
      reminder => reminder.taskId === taskId,
    ),
  )
  const [start, setStart] = React.useState(today)
  const [end, setEnd] = React.useState(start)

  React.useEffect(() => {
    if (Date.now() > new Date(today).getTime()) {
      setStart(getTodayDate())
      setEnd(getTodayDate())
    }
  }, [])

  React.useEffect(() => {
    if (fetcher.type === 'done') {
      setIsOpen(false)
    }
  }, [fetcher.type])

  return (
    <>
      <button
        type="button"
        className="btn-link-alike"
        onClick={() => {
          const filteredReminders = (
            routeData.data as TodoIdRouteLoaderData
          ).listData.reminders.filter(reminder => reminder.taskId === taskId)
          console.log(filteredReminders)
          if (!!filteredReminders.length) {
            setIsReminders(state => !state)
            setReminders([...filteredReminders])

            return
          }

          setIsOpen(s => !s)
        }}
      >
        <span style={{fontSize: `0.8rem`}}>
          {
            (routeData.data as TodoIdRouteLoaderData).listData.reminders.filter(
              reminder => reminder.taskId === taskId,
            ).length
          }
        </span>
        <Bell />
        <VisuallyHidden>add reminder</VisuallyHidden>
      </button>
      {isReminders && (
        <RelatedReminders
          handleExit={() => setIsReminders(state => !state)}
          handleNext={() => {
            setIsReminders(state => !state)
            setIsOpen(state => !state)
          }}
        >
          {reminders.map(({id, taskId, start, end}) => (
            <ReminderDisplay
              key={`found-reminders-${id}`}
              id={id}
              taskId={taskId}
              start={start}
              end={end}
            />
          ))}
        </RelatedReminders>
      )}
      {isOpen && (
        <AlertDialogOverlay
          leastDestructiveRef={cancelRef}
          onClick={() => setIsOpen(status => !status)}
          onKeyDown={e => {
            if (e.code.toLocaleLowerCase() !== 'escape') return
            setIsOpen(status => !status)
          }}
        >
          <AlertDialogContent>
            <fetcher.Form method="post">
              <AlertDialogLabel>Create Reminder</AlertDialogLabel>
              <AlertDialogDescription>
                <input type="hidden" name="taskId" value={taskId} />
                <input type="hidden" name="isReminder" value="true" />
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
                      if (
                        new Date(today).getTime() >
                        new Date(e.target.value).getTime()
                      )
                        return
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
