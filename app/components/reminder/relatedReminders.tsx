import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogLabel,
  AlertDialogOverlay,
} from '@reach/alert-dialog'
import React from 'react'

function RelatedReminders({
  children,
  handleExit,
  handleNext,
}: {
  children: React.ReactNode
  handleExit: () => void
  handleNext: () => void
}) {
  const cancelRef = React.useRef(null)

  return (
    <AlertDialogOverlay
      leastDestructiveRef={cancelRef}
      onClick={handleExit}
      onKeyDown={e => {
        if (e.code.toLocaleLowerCase() !== 'escape') return
        handleExit()
      }}
    >
      <AlertDialogContent>
        <AlertDialogLabel>Related Reminders</AlertDialogLabel>
        <AlertDialogDescription>{children}</AlertDialogDescription>
        <div className="alert-buttons">
          <button type="button" className="btn-link-alike" onClick={handleNext}>
            Next
          </button>
          <button
            type="button"
            className="btn-link-alike"
            ref={cancelRef}
            onClick={handleExit}
          >
            Nevermind
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialogOverlay>
  )
}

export default RelatedReminders
