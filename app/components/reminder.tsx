import React from 'react'

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

export default ReminderDisplay
