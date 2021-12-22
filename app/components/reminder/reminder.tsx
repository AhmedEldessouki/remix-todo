import React from 'react'
import {useFetcher, useMatches} from 'remix'
import Delete from '../delete'
import type {TodoIdRouteLoaderData} from '~/types'

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
  start,
  id: reminderId,
  taskId,
}: {
  timer: TimerType
  end: number
  start?: number
  id: string
  taskId: string
}) {
  const [, , parent] = useMatches()
  const [index] = React.useState(
    (parent.data as TodoIdRouteLoaderData).listData.tasks.findIndex(
      task => task.id === taskId,
    ),
  )
  return (
    <>
      <div className="reminder-text__container">
        <span>{timer.status}</span>
        <span>{new Date(end).toLocaleDateString()}</span>
      </div>
      <div className="reminder-main__container">
        {start && start > Date.now() ? (
          <p className="reminder-start">
            {new Date(start).toLocaleDateString().replace(/[/]/g, '-')}
          </p>
        ) : (
          Object.entries(timer).map(([key, value], i) => {
            if (typeof value === 'string') return null
            return (
              <div
                className="reminder-main__sub-container"
                key={`${reminderId}-${i}`}
              >
                {key !== 'seconds' ? (
                  <>
                    <p>{key}</p>
                    <p>:</p>
                  </>
                ) : (
                  <p>{key}</p>
                )}
                <p className="numbers">{`${value}`.padStart(2, '0')}</p>
              </div>
            )
          })
        )}
      </div>
      <div className="reminder-text__container">
        <span>
          {(parent.data as TodoIdRouteLoaderData).listData.tasks[index].isDone
            ? '✔'
            : '❌'}{' '}
          {(parent.data as TodoIdRouteLoaderData).listData.tasks[index].name}
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
  const [isMouseIn, setIsMouseIn] = React.useState(false)
  const fetcher = useFetcher()

  const handleTrashCan = () => setIsMouseIn(status => !status)
  const handleDelete = () => {
    fetcher.submit({reminderId: id}, {method: 'delete'})
  }

  React.useEffect(() => {
    if (Date.now() > end) return
    if (start > Date.now()) return
    setInterval(() => {
      setTimer(handleCountDown(end))
    }, 100)

    return () => clearInterval()
  }, [end])

  if (timer.status === 'passed') {
    return (
      <div
        className="passed__container"
        onMouseEnter={handleTrashCan}
        onMouseLeave={handleTrashCan}
      >
        <div className="reminder__container">
          {isMouseIn && <Delete handleClick={handleDelete} />}
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
      onMouseEnter={handleTrashCan}
      onMouseLeave={handleTrashCan}
    >
      {isMouseIn && <Delete handleClick={handleDelete} />}
      <ReminderSkin
        timer={timer}
        end={end}
        id={id}
        taskId={taskId}
        start={start}
      />
    </div>
  )
}

export default ReminderDisplay
