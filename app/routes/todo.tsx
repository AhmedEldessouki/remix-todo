import {Outlet, json, NavLink, useLoaderData} from 'remix'
import type {LoaderFunction} from 'remix'
import React from 'react'
import {getSession} from '~/sessions.server'
import type {Lists} from '~/types'

export const loader: LoaderFunction = async ({request}) => {
  const session = await getSession(request.headers.get('Cookie'))

  const lists = session.get('lists')

  return lists ?? []
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
          {lists.map(({name, url, id}) => (
            <li key={id}>
              <NavLink to={url}>{name}</NavLink>
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
