let users = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`
  }))
  
  export default defineEventHandler(async (event) => {
    const method = event.node.req.method
  
    if (method === 'GET') {
      return users
    }
  
    if (method === 'POST') {
      const body = await readBody(event)
      const newUser = { id: users.length + 1, ...body }
      users.push(newUser)
      return newUser
    }
  
    if (method === 'PUT') {
      const body = await readBody(event)
      const userId = body.id
      const userIndex = users.findIndex((u) => u.id === userId)
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...body }
        return users[userIndex]
      }
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }
  
    if (method === 'DELETE') {
      const body = await readBody(event)
      const userId = body.id
      users = users.filter((u) => u.id !== userId)
      return { success: true }
    }
  })