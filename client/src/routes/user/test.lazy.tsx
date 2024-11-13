import * as React from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/user/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /user/test!'
}
