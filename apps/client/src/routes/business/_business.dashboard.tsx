import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/business/_business/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /business/_business/dashboard!'
}
