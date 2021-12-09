import React from 'react'
import {Disclosure, DisclosureButton, DisclosurePanel} from '@reach/disclosure'
import VisuallyHidden from '@reach/visually-hidden'
import {MixedCheckbox} from '@reach/checkbox'
import {useFetcher} from 'remix'

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
  isDisabled,
}: {
  children: React.ReactNode
  handleDisclosure: () => void
  isOpen: boolean
  isDone: boolean
  id: string
  isDisabled: boolean
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
      <DisclosureButton disabled={isDisabled} onClick={handleDisclosure}>
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
  return (
    <TaskRoot isOpen={isOpen} isDone={isDone}>
      <TaskHeader
        isDone={isDone}
        isOpen={isOpen}
        id={id}
        isDisabled={description.length === 0}
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
