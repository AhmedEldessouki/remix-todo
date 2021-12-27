import React from 'react'
import {Disclosure, DisclosureButton, DisclosurePanel} from '@reach/disclosure'
import VisuallyHidden from '@reach/visually-hidden'
import {MixedCheckbox} from '@reach/checkbox'
import {useFetcher} from 'remix'
import Input from '../input'
import AddReminder from '../reminder/addReminder'
import Delete from '../delete'

function TaskRoot({
  children,
  isDone,
  className = '',
  isOpen,
  handleTrashCan,
}: {
  children: React.ReactNode
  isDone: boolean
  isOpen: boolean
  className?: string
  handleTrashCan?: () => void
}) {
  return (
    <li
      className={`task-root__container ${className}`}
      data-state={isDone}
      onMouseEnter={handleTrashCan}
      onMouseLeave={handleTrashCan}
    >
      <Disclosure open={isOpen}>{children}</Disclosure>
    </li>
  )
}

function TaskHeader({
  children,
  handleDisclosure,
  isOpen,
  isDone,
  id,
  disableCheck = false,
}: {
  children: React.ReactNode
  handleDisclosure: () => void
  isOpen: boolean
  isDone: boolean
  id: string
  disableCheck?: boolean
}) {
  const fetcher = useFetcher()

  return (
    <>
      <div className="task-header__container">
        <label className="center">
          <MixedCheckbox
            name="task"
            value={'name'}
            disabled={disableCheck}
            checked={isDone}
            onChange={() => {
              fetcher.submit(
                {taskId: id, isDone: `${!isDone}`},
                {method: 'put'},
              )
            }}
          />
        </label>
        <DisclosureButton onClick={handleDisclosure}>
          <span aria-hidden>{isOpen ? '🔽' : '🔼'}</span>
          <VisuallyHidden>view notes</VisuallyHidden>
        </DisclosureButton>
        {children}
        <AddReminder taskId={id} />
      </div>
    </>
  )
}

function TaskNotes({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <DisclosurePanel className={'slide-down ' + className}>
      {children}
    </DisclosurePanel>
  )
}

function CreateTask() {
  const [isOpen, setIsOpen] = React.useState(false)
  const fetcher = useFetcher()
  return (
    <TaskRoot isOpen={isOpen} isDone={false} className="task-form">
      <fetcher.Form method="post">
        <TaskHeader
          isDone={false}
          isOpen={isOpen}
          id="no-id"
          handleDisclosure={() => setIsOpen(state => !state)}
          disableCheck
        >
          <Input
            label=""
            aria-label="name"
            type="text"
            name="name"
            id="create-task-name"
            placeholder="Enter new task name"
            required
          />
        </TaskHeader>
        <TaskNotes className="panel-with-form">
          <label htmlFor="create-task-notes" aria-label="notes">
            <textarea
              name="notes"
              id="create-task-notes"
              rows={20}
              cols={20}
              placeholder="Enter your notes here"
            />
          </label>
          {fetcher.data?.errors && (
            <p className="warning">
              {JSON.stringify(fetcher.data.errors, null, 2)}
            </p>
          )}
          <button type="submit">Submit</button>
        </TaskNotes>
      </fetcher.Form>
    </TaskRoot>
  )
}

function Task({
  name,
  id: taskId,
  isDone,
  notes,
}: {
  name: string
  id: string
  isDone: boolean
  notes: string
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMouseIn, setIsMouseIn] = React.useState(false)
  const fetcher = useFetcher()
  return (
    <TaskRoot
      isOpen={isOpen}
      isDone={isDone}
      handleTrashCan={() => setIsMouseIn(status => !status)}
    >
      {isMouseIn && (
        <Delete
          handleClick={() => {
            fetcher.submit({taskId}, {method: 'delete'})
          }}
        />
      )}
      <TaskHeader
        isDone={isDone}
        isOpen={isOpen}
        id={taskId}
        handleDisclosure={() => setIsOpen(state => !state)}
      >
        <h3>{name}</h3>
      </TaskHeader>
      <TaskNotes>
        {notes ? (
          <blockquote>{notes}</blockquote>
        ) : (
          <fetcher.Form method="put">
            <label htmlFor="add-task-notes" aria-label="notes">
              <textarea
                name="notes"
                id="add-task-notes"
                rows={20}
                cols={20}
                placeholder="Enter your notes here"
                required
              />
            </label>
            <input type="hidden" value={taskId} name="taskId" />
            {/* // ! Handle AddReminder error here */}
            {fetcher.data?.errors && (
              <p className="warning">
                {JSON.stringify(fetcher.data.errors, null, 2)}
              </p>
            )}

            <button type="submit" className="button-clean">
              <SendIcon />
            </button>
          </fetcher.Form>
        )}
      </TaskNotes>
    </TaskRoot>
  )
}

const SendIcon = () => (
  <svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 512.001 512.001"
    xmlSpace="preserve"
    fill="var(--color-border)"
    aria-label="submit"
  >
    <path d="M483.927,212.664L66.967,25.834C30.95,9.695-7.905,42.023,1.398,80.368l21.593,89.001    c3.063,12.622,11.283,23.562,22.554,30.014l83.685,47.915c6.723,3.85,6.738,13.546,0,17.405l-83.684,47.915    c-11.271,6.452-19.491,17.393-22.554,30.015l-21.594,89c-9.283,38.257,29.506,70.691,65.569,54.534l416.961-186.83    C521.383,282.554,521.333,229.424,483.927,212.664z M359.268,273.093l-147.519,66.1c-9.44,4.228-20.521,0.009-24.752-9.435    c-4.231-9.44-0.006-20.523,9.434-24.752l109.37-49.006l-109.37-49.006c-9.44-4.231-13.665-15.313-9.434-24.752    c4.229-9.44,15.309-13.666,24.752-9.435l147.519,66.101C373.996,245.505,374.007,266.49,359.268,273.093z" />
  </svg>
)

export default Task
export {TaskNotes, TaskHeader, TaskRoot, CreateTask}
