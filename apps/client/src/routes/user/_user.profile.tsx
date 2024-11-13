import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/_user/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /_user/profile!'
}
