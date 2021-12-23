import React from 'react'
import {NavLink} from 'remix'
import type {RemixNavLinkProps} from '@remix-run/react/components'

function ActiveLink({
  children,
  ...linkProps
}: {children: string; linkProps?: RemixNavLinkProps} & RemixNavLinkProps) {
  return (
    <NavLink
      {...linkProps}
      className={({isActive}) => (isActive ? 'active-link' : '')}
    >
      {children}
    </NavLink>
  )
}

export default ActiveLink
