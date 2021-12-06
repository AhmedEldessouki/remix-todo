import type {MetaFunction, LoaderFunction} from 'remix'
import {useLoaderData, json, Link} from 'remix'
import {SkinAside, SkinCore, SkinMain} from '~/components/skin'

type IndexData = {
  resources: Array<{name: string; url: string}>
  demos: Array<{name: string; to: string}>
}

export let loader: LoaderFunction = () => {
  let data: IndexData = {
    resources: [
      {
        name: 'Remix Docs',
        url: 'https://remix.run/docs',
      },
      {
        name: 'React Router Docs',
        url: 'https://reactrouter.com/docs',
      },
      {
        name: 'Remix Discord',
        url: 'https://discord.gg/VBePs6d',
      },
    ],
    demos: [
      {
        to: 'demos/actions',
        name: 'Actions',
      },
      {
        to: 'demos/about',
        name: 'Nested Routes, CSS loading/unloading',
      },
      {
        to: 'demos/params',
        name: 'URL Params and Error Boundaries',
      },
    ],
  }

  return json(data)
}

export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter',
    description: 'Welcome to remix!',
  }
}

export default function Index() {
  let data = useLoaderData<IndexData>()

  return (
    <SkinCore>
      <SkinMain>
        <h2>Welcome to ToDo!</h2>
        <p>ToDo is here to help you organize.</p>
        <pre>
          Please If for any reason you want to contact us, Forget About it.{' '}
          <code>We're unavailable.</code>
        </pre>
        <h2>How to use ToDo?</h2>
        <p>
          Let's pretend I am explaining and you're listening. Now you should go
          and press all the <i>Buttons</i> until you know what do what Or break
          it. When it breaks press <strong>F5</strong>.
        </p>
      </SkinMain>
      {/* // ! Todo: In aside Add Reminders [appears]: Only If the User Set a Reminder */}
      <SkinAside>
        <ul>
          {data.demos.map(demo => (
            <li key={demo.to} className="remix__page__reminder">
              <Link to={demo.to} prefetch="intent">
                {demo.name}
              </Link>
            </li>
          ))}
        </ul>
      </SkinAside>
    </SkinCore>
  )
}
