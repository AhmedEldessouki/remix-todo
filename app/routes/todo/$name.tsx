import {LinksFunction, useLoaderData, json} from 'remix'
import {getSession} from '~/sessions.server'
import {SkinAside, SkinCore, SkinMain} from '~/components/skin'
import type {LoaderFunction, MetaFunction} from 'remix'
import type {List} from '~/types'
import Task from '~/components/task'
import {v4} from 'uuid'

import taskStyles from '~/styles/tasks.css'

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: taskStyles,
  },
]

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
  return json({
    message: '',
    listData: {
      tasks: [
        {
          id: v4(),
          name: 'task',
          isDone: false,
          description:
            'Something Something Something Something Something Something Something Something Something Something Something ',
        },
        {
          id: v4(),
          name: 'done task',
          isDone: true,
          description:
            'Something Something Something Something Something Something Something Something Something Something Something ',
        },
      ],
      reminders: [],
    },
  })
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
            {listData.tasks.map(({name, id, isDone, description}) => (
              <Task
                key={id}
                name={name}
                isDone={isDone}
                description={description}
              />
            ))}
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
