import React from 'react'
import {Form, json, useFetcher, redirect} from 'remix'
import {getSession} from '~/sessions.server'
import type {ActionFunction, MetaFunction} from 'remix'
import type {List, ObjectOfStrings} from '~/types'

export const meta: MetaFunction = () => {
  return {
    title: 'Create List',
    description: 'Create a new list!',
  }
}

export const action: ActionFunction = async ({request, params}) => {
  const session = await getSession(request.headers.get('Cookie'))
  const formData = await request.formData()
  const errors: ObjectOfStrings = {}
  const listName = formData.get('name')?.toString()

  if (formData.values.length <= 0) {
    return json({message: 'Request Timeout!'}, {status: 408})
  }

  if (!listName) {
    errors['listName'] = 'List name is invalid.'
  } else if (session.has(listName)) {
    errors['listName'] = 'Already exists!'
    return json(errors, {status: 409})
  }

  if (Object.keys(errors).length) {
    // ? 422: Unprocessable Entity
    return json(errors, {status: 422})
  }

  return redirect(`/todo/${listName}`)
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
    <Form method="post">
      {JSON.stringify(fetcher, null, 2)}
      <h1>This is a form</h1>
    </Form>
  )
}
