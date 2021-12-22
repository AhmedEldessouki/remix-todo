import React from 'react'

function SkinCore({children}: {children: React.ReactNode}) {
  return <div className="remix__page">{children}</div>
}

function SkinMain({children}: {children: React.ReactNode}) {
  return <main>{children}</main>
}
function SkinAside({children}: {children: React.ReactNode}) {
  return (
    <aside>
      <h2>Reminders</h2>
      <hr />
      {children}
    </aside>
  )
}

export {SkinCore, SkinMain, SkinAside}
