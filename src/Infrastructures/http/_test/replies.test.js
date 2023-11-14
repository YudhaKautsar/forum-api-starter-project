const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await RepliesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 400 if payload not contain needed property', async () => {
      // Arrange
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
          fullname: 'Yudha Kautsar'
        }
      })

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authPayload
      })

      const responseAuth = JSON.parse(authentication.payload)

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread title',
          body: 'sebuah thread body'
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      const responseThread = JSON.parse(thread.payload)

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: {
          content: 'Dicoding Indonesia'
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      const responseComment = JSON.parse(comment.payload)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
        payload: { },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada')
    })

    it('should response 400 if payload not meet data type specification', async () => {
      // Arrange
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
          fullname: 'Yudha Kautsar'
        }
      })

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authPayload
      })

      const responseAuth = JSON.parse(authentication.payload)

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread title',
          body: 'sebuah thread body'
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      const responseThread = JSON.parse(thread.payload)

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: {
          content: 'Dicoding Indonesia'
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      const responseComment = JSON.parse(comment.payload)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
        payload: {
          content: 123
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena tipe data tidak sesuai')
    })

    it('should response 401 when request payload not access token', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/123/comments/123/replies',
        payload: {}
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 404 if thread not found', async () => {
      // Arrange
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
          fullname: 'Yudha Kautsar'
        }
      })

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authPayload
      })

      const responseAuth = JSON.parse(authentication.payload)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments/xxx/replies',
        payload: {
          content: 'sebuah balasan comment'
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })

    it('should response 404 if comment not found', async () => {
      // Arrange
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
          fullname: 'Yudha Kautsar'
        }
      })

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authPayload
      })

      const responseAuth = JSON.parse(authentication.payload)

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread title',
          body: 'sebuah thread body'
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      const responseThread = JSON.parse(thread.payload)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments/xxx/replies`,
        payload: {
          content: 'Dicoding Indonesia'
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('komentar tidak ditemukan')
    })

    it('should response 201 if payload is valid', async () => {
      // Arrange
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
          fullname: 'Yudha Kautsar'
        }
      })

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authPayload
      })

      const responseAuth = JSON.parse(authentication.payload)

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread title',
          body: 'sebuah thread body'
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      const responseThread = JSON.parse(thread.payload)

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: {
          content: 'Dicoding Indonesia'
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      const responseComment = JSON.parse(comment.payload)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
        payload: {
          content: 'Dicoding Indonesia'
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedReply).toBeDefined()
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 401 if request not contain Authorization', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/123/comments/123/replies/123'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 403 if user delete the replies', async () => {
      const authPayload = {
        username: 'kautsar',
        password: 'secret'
      }

      const authPayload2 = {
        username: 'yudha',
        password: 'secret'
      }

      const server = await createServer(container)

      // create user 1
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'kautsar',
          password: 'secret',
          fullname: 'Yudha Kautsar'
        }
      })

      // create user 2
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'yudha',
          password: 'secret',
          fullname: 'Yudha Kautsar'
        }
      })

      // auth user 1
      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authPayload
      })

      // auth user 2
      const auth2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authPayload2
      })

      const responseAuth = JSON.parse(auth.payload)
      const responseAuth2 = JSON.parse(auth2.payload)

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread title',
          body: 'sebuah thread body'
        },
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`
        }
      })

      const responseThread = JSON.parse(thread.payload)

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment content'
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })
      console.log(responseThread.data.addedThread.id)

      const responseComment = JSON.parse(comment.payload)

      const reply = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
        payload: {
          content: 'sebuah balasan'
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      const responseReply = JSON.parse(reply.payload)
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies/${responseReply.data.addedReply.id}`,
        headers: { Authorization: `Bearer ${responseAuth2.data.accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('anda tidak dapat menghapus balasan orang lain!')
    })

    it('should response 404 if reply not found', async () => {
      // Arrange
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
          fullname: 'Yudha Kautsar'
        }
      })

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authPayload
      })

      const responseAuth = JSON.parse(authentication.payload)

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread title',
          body: 'sebuah thread body'
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      const responseThread = JSON.parse(thread.payload)

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment content'
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      const responseComment = JSON.parse(comment.payload)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies/123`,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })
      console.log(responseComment.data.addedComment.id)

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('balasan tidak ditemukan')
    })

    it('should response 200 if reply deleted', async () => {
      // Arrange
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
          fullname: 'Yudha Kautsar'
        }
      })

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authPayload
      })

      const responseAuth = await JSON.parse(authentication.payload)

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread title',
          body: 'sebuah body'
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      const responseThread = JSON.parse(thread.payload)

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment'
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      const responseComment = JSON.parse(comment.payload)

      const reply = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
        payload: {
          content: 'sebuah reply'
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies/${reply.result.data.addedReply.id}`,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` }
      })
      console.log(`/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies/${reply.result.data.addedReply.id}`)

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})
