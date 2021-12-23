import {Outlet, NavLink, useLoaderData} from 'remix'
import type {LoaderFunction} from 'remix'
import React from 'react'
import {getSession} from '~/sessions.server'
import type {Lists} from '~/types'
import ActiveLink from '~/components/activeLink'

export const loader: LoaderFunction = async ({request}) => {
  const session = await getSession(request.headers.get('Cookie'))

  const lists: Array<string> | undefined = session.get('lists')

  if (!lists) return []

  return lists
}

export default function Todo() {
  const lists = useLoaderData<Lists>()

  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to="new">Create New List</NavLink>
          </li>
          {lists.map(({name, id}) => (
            <li key={`link-${id}`}>
              <ActiveLink to={id}>{name}</ActiveLink>
            </li>
          ))}
        </ul>
      </nav>
      <hr />
      {/* // ToDo: Write Something Or Not */}
      <p>ToDo: Write Something Or Not</p>
      <Outlet />
    </div>
  )
}
