import type {MetaFunction} from 'remix'
import {SkinAside, SkinCore, SkinMain} from '~/components/skin'

export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter',
    description: 'Welcome to remix!',
  }
}

export default function Index() {
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
          <li>Something</li>
          <li>Other Thing</li>
        </ul>
      </SkinAside>
    </SkinCore>
  )
}
