import 'reflect-metadata'
import { Ignitor } from '@adonisjs/core'
import { IncomingMessage, ServerResponse } from 'node:http'

const ignitor = new Ignitor(new URL('../', import.meta.url))

let handler: ((req: IncomingMessage, res: ServerResponse) => void) | null = null

async function getHandler() {
  if (handler) return handler

  const app = ignitor.createApp('web')
  await app.init()
  await app.boot()

  const server = await app.container.make('server')
  await server.boot()

  handler = server.handle.bind(server)
  return handler
}

export default async function (req: IncomingMessage, res: ServerResponse) {
  const handle = await getHandler()
  return handle(req, res)
}
