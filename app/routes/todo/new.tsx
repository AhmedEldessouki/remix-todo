import React from 'react'
import {Form, json, redirect} from 'remix'
import {v4} from 'uuid'
import {commitSession, getSession} from '~/sessions.server'
import Input from '~/components/input'
import {hasList} from '~/utils'
import type {ActionFunction, MetaFunction} from 'remix'
import type {TaskType, Lists, ObjectOfStrings} from '~/types'

export const meta: MetaFunction = () => {
  return {
    title: 'Create List',
    notes: 'Create a new list!',
  }
}

export const action: ActionFunction = async ({request}) => {
  const session = await getSession(request.headers.get('Cookie'))
  const formData = await request.formData()
  let lists: Lists = session.get('lists')

  const errors: ObjectOfStrings = {}
  console.log(formData)

  const listName = formData.get('name')?.toString().trim()

  if (!listName) {
    errors['listName'] = 'List name is invalid.'
    return json(errors, {status: 422})
  }

  if (hasList(lists, listName)) {
    errors['listName'] = 'Already exists!'
    return json(errors, {status: 409})
  }

  if (Object.keys(errors).length) {
    // ? 422: Unprocessable Entity
    return json(errors, {status: 422})
  }

  const newList = {name: listName, id: v4()}

  if (!Array.isArray(lists)) {
    lists = [newList]
  } else {
    lists = [...lists, newList]
  }

  const firstTaskId = v4()

  const defaultList: TaskType = {
    tasks: [
      {
        id: firstTaskId,
        name: 'task',
        isDone: false,
        notes:
          'Something Something Something Something Something Something Something Something Something Something Something ',
      },
      {
        id: v4(),
        name: 'done task',
        isDone: true,
        notes:
          'Something Something Something Something Something Something Something Something Something Something Something ',
      },
    ],
    reminders: [
      {
        taskId: firstTaskId,
        id: v4(),
        start: Date.now() + 300000,
        end: Date.now() + 31000000,
      },
    ],
  }

  session.set('lists', lists)
  session.set(newList.id, defaultList)

  return redirect(`/todo/${newList.id}`, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export default function New() {
  return (
    <section>
      <h2>Create List</h2>
      <Form method="post" reloadDocument>
        <Input label="Name" name="name" id="create-list-name" type="text" />
        <button type="submit">Submit</button>
      </Form>
    </section>
  )
}
