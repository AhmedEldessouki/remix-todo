import React from 'react'

function Input({
  className,
  label,
  id,
  ...inputProps
}: {
  label: string
  className?: React.HTMLAttributes<HTMLLabelElement>['className']
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label htmlFor={id} className={className}>
      <span>{label}</span>
      <input id={id} {...inputProps} />
    </label>
  )
}

export default Input
