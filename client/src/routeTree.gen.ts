/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as UserLayoutImport } from './routes/user/_layout'

// Create Virtual Routes

const UserImport = createFileRoute('/user')()
const LoginLazyImport = createFileRoute('/login')()
const IndexLazyImport = createFileRoute('/')()
const UserTestLazyImport = createFileRoute('/user/test')()
const AuthStaffLazyImport = createFileRoute('/auth/staff')()

// Create/Update Routes

const UserRoute = UserImport.update({
  id: '/user',
  path: '/user',
  getParentRoute: () => rootRoute,
} as any)

const LoginLazyRoute = LoginLazyImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/login.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const UserTestLazyRoute = UserTestLazyImport.update({
  id: '/test',
  path: '/test',
  getParentRoute: () => UserRoute,
} as any).lazy(() => import('./routes/user/test.lazy').then((d) => d.Route))

const AuthStaffLazyRoute = AuthStaffLazyImport.update({
  id: '/auth/staff',
  path: '/auth/staff',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/auth.staff.lazy').then((d) => d.Route))

const UserLayoutRoute = UserLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => UserRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginLazyImport
      parentRoute: typeof rootRoute
    }
    '/user': {
      id: '/user'
      path: '/user'
      fullPath: '/user'
      preLoaderRoute: typeof UserImport
      parentRoute: typeof rootRoute
    }
    '/user/_layout': {
      id: '/user/_layout'
      path: '/user'
      fullPath: '/user'
      preLoaderRoute: typeof UserLayoutImport
      parentRoute: typeof UserRoute
    }
    '/auth/staff': {
      id: '/auth/staff'
      path: '/auth/staff'
      fullPath: '/auth/staff'
      preLoaderRoute: typeof AuthStaffLazyImport
      parentRoute: typeof rootRoute
    }
    '/user/test': {
      id: '/user/test'
      path: '/test'
      fullPath: '/user/test'
      preLoaderRoute: typeof UserTestLazyImport
      parentRoute: typeof UserImport
    }
  }
}

// Create and export the route tree

interface UserRouteChildren {
  UserLayoutRoute: typeof UserLayoutRoute
  UserTestLazyRoute: typeof UserTestLazyRoute
}

const UserRouteChildren: UserRouteChildren = {
  UserLayoutRoute: UserLayoutRoute,
  UserTestLazyRoute: UserTestLazyRoute,
}

const UserRouteWithChildren = UserRoute._addFileChildren(UserRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/login': typeof LoginLazyRoute
  '/user': typeof UserLayoutRoute
  '/auth/staff': typeof AuthStaffLazyRoute
  '/user/test': typeof UserTestLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/login': typeof LoginLazyRoute
  '/user': typeof UserLayoutRoute
  '/auth/staff': typeof AuthStaffLazyRoute
  '/user/test': typeof UserTestLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/login': typeof LoginLazyRoute
  '/user': typeof UserRouteWithChildren
  '/user/_layout': typeof UserLayoutRoute
  '/auth/staff': typeof AuthStaffLazyRoute
  '/user/test': typeof UserTestLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/login' | '/user' | '/auth/staff' | '/user/test'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/login' | '/user' | '/auth/staff' | '/user/test'
  id:
    | '__root__'
    | '/'
    | '/login'
    | '/user'
    | '/user/_layout'
    | '/auth/staff'
    | '/user/test'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  LoginLazyRoute: typeof LoginLazyRoute
  UserRoute: typeof UserRouteWithChildren
  AuthStaffLazyRoute: typeof AuthStaffLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  LoginLazyRoute: LoginLazyRoute,
  UserRoute: UserRouteWithChildren,
  AuthStaffLazyRoute: AuthStaffLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/login",
        "/user",
        "/auth/staff"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/login": {
      "filePath": "login.lazy.tsx"
    },
    "/user": {
      "filePath": "user",
      "children": [
        "/user/_layout",
        "/user/test"
      ]
    },
    "/user/_layout": {
      "filePath": "user/_layout.tsx",
      "parent": "/user"
    },
    "/auth/staff": {
      "filePath": "auth.staff.lazy.tsx"
    },
    "/user/test": {
      "filePath": "user/test.lazy.tsx",
      "parent": "/user"
    }
  }
}
ROUTE_MANIFEST_END */
