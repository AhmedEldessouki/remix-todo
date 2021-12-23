import React from 'react'

function Input({
  className,
  label,
  id: inputId,
  ...inputProps
}: {
  label: string
  className?: React.HTMLAttributes<HTMLLabelElement>['className']
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label htmlFor={inputId} className={className}>
      <span>{label}</span>
      <input id={inputId} {...inputProps} />
    </label>
  )
}

export default Input
