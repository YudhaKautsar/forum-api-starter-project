const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addThread function', () => {
    it('should persist add thread and return posted thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'kautsar',
        password: 'secret',
        fullname: 'kautsar'
      })

      const addThread = new NewThread({
        title: 'sebuah thread title',
        body: 'sebuah body',
        owner: 'user-123'
      })

      const fakeIdGenerator = () => '123' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread)

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123')

      expect(threads).toHaveLength(1)
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'sebuah thread title',
        owner: 'user-123'
      }))
      expect(threads).toHaveLength(1)
    })
  })

  describe('checkAvailabilityThread', () => {
    it('should throw NotFoundError if thread not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})
      const threadId = 'thread-xxx'

      // Action and Assert
      await expect(threadRepositoryPostgres.checkAvailabilityThread(threadId))
        .rejects.toThrow(NotFoundError)
    })

    it('should not throw NotFoundError if thread available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', body: 'sebuah thread', ownerId: 'user-123' })

      // Action and Assert
      await expect(threadRepositoryPostgres.checkAvailabilityThread('thread-123'))
        .resolves.not.toThrow(NotFoundError)
    })
  })

  describe('getDetailThread', () => {
    it('should get detail thread', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'kautsar' })

      const threadPayload = {
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body',
        date: '2023-03-02 13:00',
        ownerId: 'user-123',
        username: 'kautsar'
      }

      await ThreadsTableTestHelper.addThread(threadPayload)

      const thread = await threadRepositoryPostgres.getDetailThread(threadPayload.id)

      console.log(thread)
      expect(thread).toStrictEqual(
        {
          id: 'thread-123',
          title: 'sebuah title thread',
          body: 'sebuah body',
          owner: 'user-123',
          date: '2023-03-02 13:00',
          username: 'kautsar'
        }
      )
    })
  })
})
