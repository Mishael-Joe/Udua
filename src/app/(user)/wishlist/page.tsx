import React, { Suspense } from 'react'
import { Wishlist } from '../components/wishlist'

function page() {
  return (
    <Suspense fallback={`Profile`}>
      <Wishlist />
    </Suspense>
  )
}

export default page