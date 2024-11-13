import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/staff/_staff/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /_staff/dashboard!'
}
