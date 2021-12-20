import React from 'react'
import {useMatches} from 'remix'
import {ActionReturnable, TodoIdRouteLoaderData} from '~/types'

type TimerType = {
  days: number
  hours: number
  minutes: number
  seconds: number
  status: 'passed' | 'on-going'
}

const displayLeft = (timer: TimerType): string => {
  if (timer.days > 0) {
    return `${timer.days} days left`
  }

  if (timer.hours > 0) {
    return `${timer.hours} days left`
  }

  if (timer.minutes > 0) {
    return `${timer.minutes} days left`
  }

  return `${timer.seconds} days left`
}

const handleCountDown = (
  reminder: number,
  today: number | undefined = Date.now(),
): TimerType => {
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

function ReminderSkin({
  timer,
  end,
  id: reminderId,
  taskId,
}: {
  timer: TimerType
  end: number
  id: string
  taskId: string
}) {
  const [, , parent] = useMatches()
  const [task] = React.useState(
    (parent.data as TodoIdRouteLoaderData).listData.tasks.filter(
      task => task.id === taskId,
    )[0],
  )
  return (
    <>
      <div className="reminder-text__container">
        <span>{timer.status}</span>
        <span>{new Date(end).toLocaleDateString()}</span>
      </div>
      <div className="reminder-main__container">
        {Object.entries(timer).map(([key, value], i) => {
          if (typeof value === 'string') return null
          return (
            <div
              className="reminder-main__sub-container"
              key={`${reminderId}-${i}`}
            >
              <p>{key}</p>
              <p className="numbers">{`${value}`.padStart(2, '0')}</p>
            </div>
          )
        })}
      </div>
      <div className="reminder-text__container">
        <span>
          {task.isDone ? '✔' : '❌'} {task.name}
        </span>
        <span>{displayLeft(timer)}</span>
      </div>
    </>
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
  const [timer, setTimer] = React.useState(() => handleCountDown(end))

  React.useEffect(() => {
    setInterval(() => {
      setTimer(handleCountDown(end))
    }, 100)

    return () => clearInterval()
  }, [handleCountDown])

  if (timer.status === 'passed') {
    return (
      <div className="passed__container">
        <div className="reminder__container">
          <ReminderSkin timer={timer} end={end} id={id} taskId={taskId} />
        </div>
        <div className="reminder__container passed">
          <h1>{timer.status}</h1>
        </div>
      </div>
    )
  }
  return (
    <div
      className="reminder__container on-going"
      key={id + taskId}
      itemID={id + taskId}
    >
      <ReminderSkin timer={timer} end={end} id={id} taskId={taskId} />
    </div>
  )
}

export default ReminderDisplay
