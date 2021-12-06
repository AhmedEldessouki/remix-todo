import {Link, redirect, useLoaderData} from 'remix'
import type {LoaderFunction} from 'remix'
import {getSession} from '~/sessions.server'
import {SkinAside, SkinCore, SkinMain} from '~/components/skin'

type Lists = Array<{name: string; url: string; id: string}>

export const loader: LoaderFunction = async ({request}) => {
  const session = await getSession(request.headers.get('Cookie'))

  if (session.has('lists')) {
    return redirect('/todo/new')
  }

  const lists = session.get('lists')

  return [
    {
      id: 1,
      name: 'list',
      url: 'list',
    },
  ]
}

export default function Todo() {
  const lists = useLoaderData<Lists>()
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="new">Create New List</Link>
          </li>
          {lists.map(({name, url, id}) => (
            <li key={id}>
              <Link to={url}>{name}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <SkinCore>
        <SkinMain>
          <h2>ToDO</h2>
        </SkinMain>
        <SkinAside>
          <h2>Reminders</h2>
        </SkinAside>
      </SkinCore>
    </div>
  )
}
