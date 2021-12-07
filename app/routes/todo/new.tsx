import React from 'react'
import {Form, json, useFetcher, redirect} from 'remix'
import {commitSession, getSession} from '~/sessions.server'
import type {ActionFunction, MetaFunction} from 'remix'
import type {List, Lists, ObjectOfStrings} from '~/types'
import Input from '~/components/input'
import {v4} from 'uuid'
import {hasListName} from '~/utils'

export const meta: MetaFunction = () => {
  return {
    title: 'Create List',
    description: 'Create a new list!',
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

  if (hasListName(lists, listName)) {
    errors['listName'] = 'Already exists!'
    return json(errors, {status: 409})
  }

  if (Object.keys(errors).length) {
    // ? 422: Unprocessable Entity
    return json(errors, {status: 422})
  }

  const newList = {name: listName, id: v4(), url: encodeURIComponent(listName)}

  if (!Array.isArray(lists)) {
    lists = [newList]
  } else {
    lists = [...lists, newList]
  }
  session.set('lists', lists)
  session.set(listName, {data: [], reminders: []})

  return redirect(`/todo/${newList.url}`, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export default function New() {
  const fetcher = useFetcher()

  const loader = React.useCallback(() => {
    fetcher.load('/todo')
    console.log(fetcher.data)
  }, [fetcher.data, fetcher.load])

  React.useEffect(() => {
    loader()
  }, [])

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
