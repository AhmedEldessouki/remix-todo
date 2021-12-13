import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogLabel,
  AlertDialogOverlay,
} from '@reach/alert-dialog'
import VisuallyHidden from '@reach/visually-hidden'
import React from 'react'
import {useFetcher} from 'remix'
import Bell from './bell'

interface LeftTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  status: 'passed' | 'on-going'
}

const handleCountDown = (
  reminder: number,
  today: number | undefined = Date.now(),
) => {
  if (typeof window === 'undefined') return

  const left: LeftTime = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: reminder - today < 0 ? 'passed' : 'on-going',
  }

  //   if (left.status === 'passed') return left

  left.days = new Date(today - reminder).getDay()
  left.hours = new Date(reminder - today).getHours()
  left.minutes = new Date(reminder - today).getMinutes()
  left.seconds = new Date(reminder - today).getSeconds()
  return left
}
const testDeadLine = Date.now() + 1000000

function AddReminder({taskId}: {taskId: string}) {
  const [showDialog, setShowDialog] = React.useState(false)
  const cancelRef = React.useRef(null)
  const fetcher = useFetcher()

  const open = () => setShowDialog(!showDialog)
  const close = () => setShowDialog(!showDialog)

  if (!showDialog) {
    return (
      <button type="button" onClick={open}>
        <Bell />
        <VisuallyHidden>Delete something</VisuallyHidden>
      </button>
    )
  }
  return (
    <AlertDialogOverlay
      style={{background: 'hsla(0, 50%, 50%, 0.85)'}}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogContent style={{background: '#f0f0f0'}}>
        <fetcher.Form method="put">
          <AlertDialogLabel>Please Confirm!</AlertDialogLabel>
          <AlertDialogDescription>
            Blah Blah Blaaaaaaaaaaaaa!
            <label htmlFor="reminder-start">
              From
              <input type="datetime" name="start" id="reminder-start" />
            </label>
            <label htmlFor="reminder-end">
              To
              <input type="datetime" name="end" id="reminder-end" required />
            </label>
          </AlertDialogDescription>
          <div className="alert-buttons">
            <button>Yes, delete</button>
            <button onClick={close} type="submit">
              Add Reminder
            </button>
            <button ref={cancelRef} type="button" onClick={close}>
              Nevermind
            </button>
          </div>
        </fetcher.Form>
      </AlertDialogContent>
    </AlertDialogOverlay>
  )
}

function ReminderDisplay({
  taskId,
  id,
  start,
  end,
}: {
  taskId: string
  id: string
  start: number
  end: number
}) {
  const [timer, setTimer] = React.useState(() => {
    return handleCountDown(end)
  })

  React.useEffect(() => {
    setInterval(() => {
      setTimer(handleCountDown(end))
    }, 100)

    return () => clearInterval()
  }, [handleCountDown])

  return (
    <div className="reminder__container" key={id + taskId} itemID={id + taskId}>
      {JSON.stringify(timer, null, 2)}
    </div>
  )
}

export {ReminderDisplay, AddReminder}
