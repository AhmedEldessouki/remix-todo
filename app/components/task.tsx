import React from 'react'
import {Disclosure, DisclosureButton, DisclosurePanel} from '@reach/disclosure'
import VisuallyHidden from '@reach/visually-hidden'
import {MixedCheckbox} from '@reach/checkbox'
import {Form, useFetcher} from 'remix'
import {v4} from 'uuid'
import Input from './input'

function TaskRoot({
  children,
  isDone,
  isOpen,
}: {
  children: React.ReactNode
  isDone: boolean
  isOpen: boolean
}) {
  // ! TODO: Handle is-done in css for a change
  // * Note To Self: cannot use self-made attributes but
  // * but you can use data-state to control the styling
  return (
    <li className="task-root__container" data-state={isDone}>
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
}: {
  children: React.ReactNode
  handleDisclosure: () => void
  isOpen: boolean
  isDone: boolean
  id: string
}) {
  const fetcher = useFetcher()
  return (
    <div className="task-header__container">
      <label>
        <MixedCheckbox
          name="task"
          value={'name'}
          checked={isDone}
          onChange={() => {
            fetcher.submit({taskId: id, isDone: `${!isDone}`}, {method: 'put'})
          }}
        />
      </label>
      <DisclosureButton onClick={handleDisclosure}>
        <span aria-hidden>{isOpen ? '🔽' : '🔼'}</span>
        <VisuallyHidden>description</VisuallyHidden>
      </DisclosureButton>
      {children}
    </div>
  )
}

function TaskDescription({
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
  const {current: id} = React.useRef(v4())
  const fetcher = useFetcher()
  return (
    <TaskRoot isOpen={isOpen} isDone={false}>
      <fetcher.Form method="post">
        <TaskHeader
          isDone={false}
          isOpen={isOpen}
          id={id}
          handleDisclosure={() => setIsOpen(state => !state)}
        >
          <Input
            label=""
            aria-label="name"
            type="text"
            name="name"
            id="create-task-name"
            placeholder="Enter new task name"
          />
        </TaskHeader>
        <TaskDescription className="panel-with-form">
          <label htmlFor="create-task-description" aria-label="description">
            <textarea
              name="description"
              id="create-task-description"
              rows={20}
              cols={20}
              placeholder="Enter your notes here"
            />
          </label>
          <button type="submit">Submit</button>
        </TaskDescription>
      </fetcher.Form>
    </TaskRoot>
  )
}

function Task({
  name,
  id,
  isDone,
  description,
}: {
  name: string
  id: string
  isDone: boolean
  description: string
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const fetcher = useFetcher()
  return (
    <TaskRoot isOpen={isOpen} isDone={isDone}>
      <TaskHeader
        isDone={isDone}
        isOpen={isOpen}
        id={id}
        handleDisclosure={() => setIsOpen(state => !state)}
      >
        <h3>{name}</h3>
      </TaskHeader>
      <TaskDescription>
        {description ? (
          <blockquote>{description}</blockquote>
        ) : (
          <fetcher.Form method="put">
            <label htmlFor="add-task-description" aria-label="description">
              <textarea
                name="description"
                id="add-task-description"
                rows={20}
                cols={20}
                placeholder="Enter your notes here"
              />
            </label>
            <input type="hidden" value={id} name="taskId" />
            <button type="submit">
              <SendIcon />
            </button>
          </fetcher.Form>
        )}
      </TaskDescription>
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
export {TaskDescription, TaskHeader, TaskRoot, CreateTask}