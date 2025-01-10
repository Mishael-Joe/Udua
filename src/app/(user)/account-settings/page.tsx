import React, { Suspense } from 'react'
import AccountSettings from '../components/account-settings'

function page() {
  return (
    <Suspense fallback={`Profile`}>
      <AccountSettings />
    </Suspense>
  )
}

export default page