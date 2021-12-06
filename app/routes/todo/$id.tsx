import {useLoaderData} from 'remix'
import type {LoaderFunction} from 'remix'
import {getSession} from '~/sessions.server'
import {SkinAside, SkinCore, SkinMain} from '~/components/skin'

type ListData = {
  data: Array<{name: string; isDone: boolean; id: string}>
  reminders: Array<{id: string; todoId: string; start: Date; end: Date}>
}

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<ListData> => {
  const session = await getSession(request.headers.get('Cookie'))
  const param = params['id']
  if (!param) {
    throw new Error(`Id Not Found`)
  }

  if (session.has(param)) {
    throw new Error('List Not Found')
  }

  const listData: ListData = session.get(param)

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
  const listData = useLoaderData<ListData>()
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
