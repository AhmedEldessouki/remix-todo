import {useLoaderData, json} from 'remix'
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

export const loader: LoaderFunction = async ({request, params}) => {
  const session = await getSession(request.headers.get('Cookie'))
  const path = params['name']

  if (!path) {
    return json(
      {message: 'List Name Is inValid'},
      {
        status: 404,
      },
    )
  }

  const listName = decodeURIComponent(path)

  const listData = session.get(listName)

  if (!listData) {
    return json(
      {message: 'List Not Found'},
      {
        status: 404,
      },
    )
  }
  return json({message: '', listData})
}

export default function Todo() {
  const {listData, message} = useLoaderData<{message: string; listData: List}>()
  return (
    <div>
      {/* // ! Todo use useFetcher 
          // ! to display the nav data here 
          // ! instead of refetching them  
      */}
      {message ? (
        <span>{message}</span>
      ) : (
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
      )}
    </div>
  )
}
