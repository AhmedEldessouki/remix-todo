import React from 'react'
import {
  LinksFunction,
  useLoaderData,
  json,
  useFetcher,
  ActionFunction,
  Outlet,
} from 'remix'
import {v4} from 'uuid'
import {MixedCheckbox} from '@reach/checkbox'
import {commitSession, getSession} from '~/sessions.server'
import Task, {CreateTask} from '~/components/task'
import {SkinAside, SkinCore, SkinMain} from '~/components/skin'
import ReminderDisplay from '~/components/reminder'
import type {LoaderFunction, MetaFunction} from 'remix'
import type {TaskType, TodoIdRouteLoaderData, ActionReturnable} from '~/types'

import taskStyles from '~/styles/tasks.css'

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: taskStyles,
  },
]

export const meta: MetaFunction = ({params}) => {
  const listName = params['id']
  if (!listName)
    return {
      title: 'Invalid ListName!',
      notes: 'Something went wrong. Please check list name.',
    }

  return {
    title: listName,
    notes: 'Congrats for sharing your list with people! 🥳',
  }
}

export const action: ActionFunction = async ({request, params}) => {
  const session = await getSession(request.headers.get('Cookie'))
  const formData = await request.formData()

  const toBeReturned: ActionReturnable = {
    errors: {},
    formData: {},
  }

  const listId = params['id']

  if (!listId) {
    toBeReturned.errors.message = 'ListName is undefined'
    return json(toBeReturned)
  }

  const listData: TaskType = session.get(listId)

  switch (request.method.toLocaleLowerCase()) {
    case 'put': {
      toBeReturned.formData.isDone = formData.get('isDone')?.toString()
      toBeReturned.formData.notes = formData.get('notes')?.toString()
      toBeReturned.formData.taskId = formData.get('taskId')?.toString()

      if (!toBeReturned.formData.taskId) {
        toBeReturned.errors.taskId = 'must provide Task ID!'
        break
      }

      const index = listData.tasks.findIndex(
        task => task.id === toBeReturned.formData.taskId,
      )
      if (toBeReturned.formData.isDone) {
        listData.tasks[index].isDone =
          toBeReturned.formData.isDone === 'true' ? true : false
        break
      }

      if (toBeReturned.formData.notes)
        listData.tasks[index].notes = toBeReturned.formData.notes

      if (!toBeReturned.formData.notes && !toBeReturned.formData.isDone) {
        toBeReturned.errors.taskId = 'You Triggered the Wrong Action [$id]!'
        break
      }

      break
    }
    case 'post': {
      toBeReturned.formData.name = formData.get('name')?.toString() ?? ''
      toBeReturned.formData.notes = formData.get('notes')?.toString() ?? ''
      toBeReturned.formData.id = v4()

      if (!toBeReturned.formData.name) {
        toBeReturned.errors.name = 'Name Must be Provided!'
        break
      }

      listData.tasks[listData.tasks.length] = {
        name: formData.get('name')?.toString() ?? '',
        notes: formData.get('notes')?.toString() ?? '',
        id: toBeReturned.formData.id,
        isDone: false,
      }
      break
    }

    default:
      toBeReturned.errors.message = `Method[${request.method}] is not handled`
      break
  }

  if (Object.values(toBeReturned.errors).length > 0) {
    return json(toBeReturned, {
      status: 422,
    })
  }

  session.set(listId, listData)

  return json(toBeReturned, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export const loader: LoaderFunction = async ({request, params}) => {
  const session = await getSession(request.headers.get('Cookie'))
  const listId = params['id']

  if (!listId) {
    return json(
      {message: 'List Name Is inValid'},
      {
        status: 404,
      },
    )
  }

  const listData = session.get(listId)

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
    listId,
    listData,
  })
}

export default function Todo() {
  const {listData, message, listId} = useLoaderData<TodoIdRouteLoaderData>()
  const fetcher = useFetcher<ActionReturnable>()
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
        <>
          <SkinCore>
            <SkinMain>
              <h2>ToDO</h2>
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
                            action: `/todo/check-all?id=${listId}`,
                            method: 'put',
                          },
                        )
                        setIsAllChecked(true)
                        return
                      }
                      fetcher.submit(
                        {tasks: `${!isAllChecked}`},
                        {
                          action: `/todo/check-all?id=${listId}`,
                          method: 'put',
                        },
                      )
                      setIsAllChecked((state: any) => !state)
                    }}
                  />
                  {true ? 'Unselect' : 'Select'} all condiments
                </label>
                {/* // ! Handle checkBox error here */}
                {fetcher.data?.errors && (
                  <p className="warning">{JSON.stringify(fetcher, null, 2)}</p>
                )}
                <fieldset style={{margin: '1rem 0 0', padding: '1rem 1.5rem'}}>
                  <legend>Tasks</legend>
                  <CreateTask />
                  {listData.tasks.map(({name, id, isDone, notes}) => (
                    <Task
                      key={id}
                      id={id}
                      name={name}
                      isDone={isDone}
                      notes={notes}
                    />
                  ))}
                </fieldset>
              </fieldset>
            </SkinMain>
            <SkinAside>
              <h2>Reminders</h2>
              {listData.reminders.map(({id, taskId, start, end}) => (
                <ReminderDisplay
                  key={id}
                  id={id}
                  taskId={taskId}
                  start={start}
                  end={end}
                />
              ))}
            </SkinAside>
          </SkinCore>
        </>
      )}
      <Outlet />
    </div>
  )
}
