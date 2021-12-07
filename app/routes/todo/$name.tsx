import {useLoaderData} from 'remix'
import {getSession} from '~/sessions.server'
import {SkinAside, SkinCore, SkinMain} from '~/components/skin'
import type {LoaderFunction, MetaFunction} from 'remix'
import type {List} from '~/types'

export const meta: MetaFunction = ({params}) => {
  const listName = params['name']
  if (!listName)
    return {
      title: 'Invalid ListName!',
      description: 'Something went wrong. Please check list name.',
    }

  return {
    title: listName,
    description: 'Congrats for sharing your list with people! 🥳',
  }
}

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<List> => {
  const session = await getSession(request.headers.get('Cookie'))
  const listName = params['name']
  if (!listName) {
    throw new Error(`List Name Is inValid`)
  }

  if (session.has(listName)) {
    throw new Error('List Not Found')
  }

  const listData: List = session.get(listName)

  return {
    data: [
      {
        id: '1',
        name: 'list',
        isDone: false,
      },
    ],
    reminders: [
      {
        todoId: '1',
        id: '1',
        start: new Date(),
        end: new Date(),
      },
    ],
  }
}

export default function Todo() {
  const listData = useLoaderData<List>()
  return (
    <div>
      {/* // ! Todo use useFetcher 
          // ! to display the nav data here 
          // ! instead of refetching them  
      */}
      <SkinCore>
        <SkinMain>
          <h2>ToDO</h2>
          {listData.data.map(data => JSON.stringify(data, null, 2))}
        </SkinMain>
        <SkinAside>
          <h2>Reminders</h2>
          {listData.reminders.map(reminder =>
            JSON.stringify(reminder, null, 2),
          )}
        </SkinAside>
      </SkinCore>
    </div>
  )
}
