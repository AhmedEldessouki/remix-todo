import React from 'react'
import {Form, useFetcher} from 'remix'
import type {ActionFunction} from 'remix'
import {getSession} from '~/sessions.server'
import {List} from '~/types'

export const action: ActionFunction = async ({request, params}) => {
  const session = await getSession(request.headers.get('Cookie'))
  const formData = await request.formData()

  const listName = params['name']
  if (!listName) {
    throw new Error('SomeThing went wrong. Please Refresh The Page!')
  }
  const listData: List = session.get(listName)
  session
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
