import React from 'react'
import {v4} from 'uuid'

type TimerType = {
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
  const left: TimerType = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: reminder - today < 0 ? 'passed' : 'on-going',
  }
  if (left.status === 'passed') return left

  left.days = new Date(today - reminder).getDay()
  left.hours = new Date(reminder - today).getHours()
  left.minutes = new Date(reminder - today).getMinutes()
  left.seconds = new Date(reminder - today).getSeconds()
  return left
}
const testDeadLine = Date.now() + 1000000

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
  const [timer, setTimer] = React.useState(() => handleCountDown(end))

  React.useEffect(() => {
    setInterval(() => {
      setTimer(handleCountDown(end))
    }, 100)

    return () => clearInterval()
  }, [handleCountDown])

  return (
    <div className="reminder__container" key={id + taskId} itemID={id + taskId}>
      <div className="reminder-text__container">
        <span>{timer.status}</span>
        <span>{new Date(end).toLocaleDateString()}</span>
      </div>
      <div className="count-down__container">
        {Object.entries(timer).map(([key, value], i) => {
          if (typeof value === 'string') return null
          return (
            <div className="count-down__sub-container" key={`${id}-${i}`}>
              <p>{key}</p>
              <p className="numbers">{`${value}`.padStart(2, '0')}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ReminderDisplay
