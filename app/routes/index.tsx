import type {MetaFunction} from 'remix'
import {SkinAside, SkinCore, SkinMain} from '~/components/task/skin'

export let meta: MetaFunction = () => {
  return {
    title: 'Todo',
    notes:
      'Welcome to Todo! Here You create it, You keep it.' +
      " We don't what you use this site for! So whatever you write down here." +
      " Only get's saved on your device as a secure Cookie. Secure using only the password you provide." +
      " (Hey! I didn't make that password thingy yet! If you were asked to enter a password then 🎊" +
      ' I did and now your data is secure. 🥳)',
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
