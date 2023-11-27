const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres')
const NewReply = require('../../../Domains/replies/entities/NewReply')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const pool = require('../../database/postgres/pool')

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'kautsar' })
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body',
        date: new Date().toISOString(),
        ownerId: 'user-123'
      })
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123'
      })

      const addReply = new NewReply({
        content: 'sebuah reply',
        owner: 'user-123',
        commentId: 'comment-123',
        threadId: 'thread-123'
      })

      const fakeIdGnerator = () => '123'
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGnerator)

      const addedReply = await replyRepositoryPostgres.addReply(addReply)

      const reply = await RepliesTableTestHelper.findReplyById('reply-123')
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'sebuah reply',
        owner: 'user-123'
      }))
      expect(reply).toHaveLength(1)
    })
  })

  describe('checkAvailabilityReply function', () => {
    it('should throw NotFoundError when reply not available', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      await expect(replyRepositoryPostgres.checkAvailabilityReply('reply-123')).rejects.toThrowError(NotFoundError)
    })

    it('should throw AuthorizationError when reply not owned by user', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'kautsar' })
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body',
        date: new Date().toISOString(),
        ownerId: 'user-123'
      })
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123'
      })

      const fakeIdGnerator = () => '123'
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGnerator)

      const addReply = new NewReply({
        content: 'sebuah reply',
        owner: 'user-123',
        commentId: 'comment-123',
        threadId: 'thread-123'
      })

      await replyRepositoryPostgres.addReply(addReply)

      await expect(replyRepositoryPostgres.checkAvailabilityReply('reply-123')).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('verifyReplyowner function', () => {
    it('should throw AuthorizationError when reply not owned by user', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'kautsar' })
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body',
        date: new Date().toISOString(),
        ownerId: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123'
      })

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        owner: 'user-123',
        commentId: 'comment-123',
        threadId: 'thread-123'
      })

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      await expect(replyRepositoryPostgres.verifyReplyowner('xxx', 'user-123'))
        .rejects.toThrowError(AuthorizationError)
    })
  })

  describe('deleteReply function', () => {
    it('should delete reply from database', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'kautsar' })
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body',
        date: new Date().toISOString(),
        ownerId: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123'
      })

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        owner: 'user-123',
        commentId: 'comment-123',
        threadId: 'thread-123'
      })

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      await replyRepositoryPostgres.deleteReply('reply-123')

      const reply = await RepliesTableTestHelper.checkIsDeletedReplyById('reply-123')
      expect(reply).toEqual(true)
    })
  })

  describe('getCommentReplies function', () => {
    it('should return replies correctly', async () => {
      const userPayload = { id: 'user-123', username: 'kautsar' }
      const threadPayload = {
        id: 'thread-123',
        title: 'sebuah thread title',
        body: 'sebuah body',
        owner: 'user-123'
      }
      const commentPayload = {
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123'
      }
      const replyPayload = {
        id: 'reply-123',
        content: 'sebuah reply',
        owner: 'user-123',
        commentId: 'comment-123',
        threadId: 'thread-123'
      }

      await UsersTableTestHelper.addUser(userPayload)
      await ThreadsTableTestHelper.addThread(threadPayload)
      await CommentsTableTestHelper.addComment(commentPayload)
      await RepliesTableTestHelper.addReply(replyPayload)

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      const replies = await replyRepositoryPostgres.getCommentReplies('comment-123')
      expect(replies).toEqual([
        {
          content: 'sebuah reply', id: 'reply-123', is_delete: false, username: 'kautsar'
        }
      ])
      expect(replies).toHaveLength(1)
    })
  })

  describe('getReply functiom', () => {
    it('should return replies correctly', async () => {
      const userPayload = { id: 'user-123', username: 'kautsar' }
      const threadPayload = {
        id: 'thread-123',
        title: 'sebuah thread title',
        body: 'sebuah body',
        date: '2023-11-19T18:14:28Z',
        owner: 'user-123'
      }
      const commentPayload = {
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
        date: '2023-11-08 14:00'
      }
      const replyPayload = {
        id: 'reply-123',
        content: 'sebuah reply',
        owner: 'user-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        date: ' 2023-11-19T18:14:28'
      }

      await UsersTableTestHelper.addUser(userPayload)
      await ThreadsTableTestHelper.addThread(threadPayload)
      await CommentsTableTestHelper.addComment(commentPayload)
      await RepliesTableTestHelper.addReply(replyPayload)

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      const replies = await replyRepositoryPostgres.getReply(threadPayload.id)
      expect(Array.isArray(replies)).toBe(true)
      expect(replies).toHaveLength(1)
    })
  })
})
