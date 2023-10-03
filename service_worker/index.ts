import { VERSION } from './constants/version'
import { StudentSchema } from './schemas/student'
import { cacheService } from './services/cache/cache.service'
import { studentService } from './services/student'

/// <reference lib="WebWorker" />
declare const self: ServiceWorkerGlobalScope

self.oninstall = (event) => {
  console.log('sw installed', VERSION)
  event.waitUntil(cacheService.open())
  self.skipWaiting()
}

self.onactivate = (event) => {
  console.log('sw activated', VERSION)
  cacheService.clear()
  event.waitUntil(self.clients.claim())
}

self.onfetch = (event) => {
  const { url, method } = event.request
  console.log('sw requested', method, url)

  if (method === 'GET' && url === 'https://learn-innodom.com/students/all') {
    const data = studentService.getStudents()
    return event.respondWith(new Response(JSON.stringify({ data })))
  }

  if (method === 'POST' && url === 'https://learn-innodom.com/students/create') {
    return event.respondWith(
      (async () => {
        try {
          const body = await event.request.json()
          const dto = await StudentSchema.validate(body)
          const data = studentService.createStudent(dto)

          return new Response(JSON.stringify({ data }))
        } catch (error) {
          return new Response(JSON.stringify(error), { status: 503 })
        }
      })()
    )
  }

  if (method === 'DELETE' && url.includes('https://learn-innodom.com/students/delete/')) {
    const id = url.split('/').pop()!
    const data = studentService.deleteStudent(id)
    return event.respondWith(new Response(JSON.stringify({ data })))
  }

  if (method === 'PATCH' && url.includes('https://learn-innodom.com/students/update/')) {
    const id = url.split('/').pop()!

    return event.respondWith(
      (async () => {
        try {
          const body = await event.request.json()
          const dto = await StudentSchema.validate(body)
          const data = studentService.updateStudent(id, dto)

          return new Response(JSON.stringify({ data }))
        } catch (error) {
          return new Response(JSON.stringify(error), { status: 503 })
        }
      })()
    )
  }
}
