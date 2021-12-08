import React from 'react'
import {
  LinksFunction,
  useLoaderData,
  json,
  useFetcher,
  useActionData,
} from 'remix'
import {v4} from 'uuid'
import {MixedCheckbox} from '@reach/checkbox'
import {getSession} from '~/sessions.server'
import Task from '~/components/task'
import {SkinAside, SkinCore, SkinMain} from '~/components/skin'
import type {LoaderFunction, MetaFunction} from 'remix'
import type {List} from '~/types'

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
    listName,
    listData,
  })
}

export default function Todo() {
  const {listData, message, listName} =
    useLoaderData<{message: string; listName: string; listData: List}>()
  const fetcher = useFetcher()
  const [isAllChecked, setIsAllChecked] = React.useState<boolean | 'mixed'>(
    () => {
      const checkedLength = listData.tasks.filter(({isDone}) => isDone).length

      if (checkedLength === listData.tasks.length) return true
      if (checkedLength === 0) return false
      return 'mixed'
    },
  )
  React.useEffect(() => {
    const checkedLength = listData.tasks.filter(({isDone}) => isDone).length

    if (checkedLength === listData.tasks.length) {
      setIsAllChecked(true)
      return
    }
    if (checkedLength === 0) {
      setIsAllChecked(false)
      return
    }
    setIsAllChecked('mixed')
  }, [listData.tasks])
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
            <button
              type="button"
              onClick={() => {
                fetcher.submit(
                  {name: `new list`, description: ''},
                  {
                    action: `/todo/new-task?path=${listName}`,
                    method: 'put',
                  },
                )
              }}
            >
              Create Task
            </button>
            <br />
            {fetcher && JSON.stringify(fetcher, null, 2)}
            <fieldset>
              <label>
                <MixedCheckbox
                  value="tasks"
                  name="tasks"
                  checked={isAllChecked}
                  onChange={() => {
                    if (typeof isAllChecked === 'string') {
                      fetcher.submit(
                        {tasks: `true`},
                        {
                          action: `/todo/check-all?path=${listName}`,
                          method: 'put',
                        },
                      )
                      setIsAllChecked(true)
                      return
                    }
                    fetcher.submit(
                      {tasks: `${!isAllChecked}`},
                      {
                        action: `/todo/check-all?path=${listName}`,
                        method: 'put',
                      },
                    )
                    setIsAllChecked((state: any) => !state)
                  }}
                />
                {true ? 'Unselect' : 'Select'} all condiments
              </label>
              <fieldset style={{margin: '1rem 0 0', padding: '1rem 1.5rem'}}>
                <legend>Tasks</legend>

                {listData.tasks.map(({name, id, isDone, description}) => (
                  <Task
                    key={id}
                    name={name}
                    isDone={isDone}
                    description={description}
                  />
                ))}
              </fieldset>
            </fieldset>
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
