import React from 'react'
import {Disclosure, DisclosureButton, DisclosurePanel} from '@reach/disclosure'
import VisuallyHidden from '@reach/visually-hidden'

function TaskRoot({
  children,
  isDone,
}: {
  children: React.ReactNode
  isDone: boolean
}) {
  // ! TODO: Handle is-done in css for a change
  // * Note To Self: cannot use self-made attributes but
  // * but you can use data-state to control the styling
  return (
    <li className="task-root__container" data-state={isDone}>
      <Disclosure>{children}</Disclosure>
    </li>
  )
}

function TaskHeader({
  children,
  handleDisclosure,
  isOpen,
}: {
  children: React.ReactNode
  handleDisclosure: () => void
  isOpen: boolean
}) {
  return (
    <div className="task-header__container">
      <DisclosureButton onClick={handleDisclosure}>
        <span aria-hidden>{isOpen ? '🔽' : '🔼'}</span>
        <VisuallyHidden>description</VisuallyHidden>
      </DisclosureButton>
      <h3>{children}</h3>
    </div>
  )
}

function TaskDescription({children}: {children: React.ReactNode}) {
  return (
    <DisclosurePanel className="slide-down">
      <blockquote>{children}</blockquote>
    </DisclosurePanel>
  )
}

function Task({
  name,
  isDone,
  description,
}: {
  name: string
  isDone: boolean
  description: string
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <TaskRoot isDone={isDone}>
      <TaskHeader
        isOpen={isOpen}
        handleDisclosure={() => setIsOpen(state => !state)}
      >
        {name}
      </TaskHeader>
      <TaskDescription>{description}</TaskDescription>
    </TaskRoot>
  )
}
export default Task
export {TaskDescription, TaskHeader, TaskRoot}
