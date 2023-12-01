const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
  })

  describe('when POST /threads', () => {
    it('should response 400 when request payload not contain needed property', async () => {
      const authPayload = {
        username: 'dicoding',
        password: 'secret'
      }

      const server = await createServer(container)

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia'
        }
      })

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authPayload
      })

      const responseAuth = JSON.parse(auth.payload)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          body: 'sebuah body'
        },
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`
        }
      })
      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena property yang dibutuhkan tidak ada')
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      const authPayload = {
        username: 'kautsar',
        password: 'secret'
      }

      const server = await createServer(container)

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'kautsar',
          password: 'secret',
          fullname: 'yudha kautsar'
        }
      })

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authPayload
      })

      const responseAuth = JSON.parse(auth.payload)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 7123,
          body: 'sebuah body'
        },
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai')
    })

    it('should response 401 when request payload not access token', async () => {
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread title',
          body: 'sebuah body'
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 201 and create new thread', async () => {
      const authPayload = {
        username: 'kautsar',
        password: 'secret'
      }

      const server = await createServer(container)

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'kautsar',
          password: 'secret',
          fullname: 'yudha kautsar'
        }
      })

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authPayload
      })

      const responseAuth = JSON.parse(auth.payload)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread title',
          body: 'sebuah body'
        },
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread).toBeDefined()
    })
  })

  describe('when GET /threads/{threadsId}', () => {
    it('should response 404 if thread not found', async () => {
      const authPayload = {
        username: 'kautsar',
        password: 'secret'
      }

      const server = await createServer(container)

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'kautsar',
          password: 'secret',
          fullname: 'yudha kautsar'
        }
      })

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authPayload
      })

      const responseAuth = JSON.parse(auth.payload)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/xxx',
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })

    it('should response 200 and return detail thread', async () => {
      const authPayload = {
        username: 'kautsar',
        password: 'secret'
      }

      const server = await createServer(container)

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'kautsar',
          password: 'secret',
          fullname: 'yudha kautsar'
        }
      })

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authPayload
      })

      const responseAuth = JSON.parse(auth.payload)

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread title',
          body: 'sebuah body'
        },
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`
        }
      })

      const responseThread = JSON.parse(thread.payload)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${responseThread.data.addedThread.id}`,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread.comments).toBeDefined()
    })
  })
})
