const NewThread = require('../../../Domains/threads/entities/NewThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const ThreadUseCase = require('../ThreadUseCase')

describe('ThreadUseCase', () => {
  describe('addThread', () => {
    it('should orchestrating the add thread action correctly', async () => {
      // arrange
      const useCasePayload = {
        title: 'sebuah thread title',
        body: 'sebuah body',
        publisher: 'user-123'
      }

      const expectedAddedThread = new AddedThread({
        id: 'thread-123',
        title: 'sebuah thread title',
        body: 'sebuah body',
        publisher: 'user-123'
      })

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository()

      /** mocking needed function */
      mockThreadRepository.addThread = jest.fn()
        .mockImplementation(() => Promise.resolve(expectedAddedThread))

      /** creating use case instance */
      const addThreadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository
      })

      // action
      const addThread = await addThreadUseCase.addThread(useCasePayload)

      // assert
      expect(addThread).toStrictEqual(expectedAddedThread)
      expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread(useCasePayload))
    })
  })
  describe('getThread', () => {
    it('should orchestrating the detail thread action correctly', async () => {
      const useCasePayload = {
        threadId: 'thread-123'
      }

      const useCaseThread = {
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body thread',
        username: 'kautsar',
        date: '2023-03-02T14:51:45.880Z'
      }

      const useCaseComment = [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2023-03-02T14:54:45.880Z',
          content: 'sebuah comment content',
          is_delete: false
        },
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2023-03-02T14:59:45.880Z',
          content: 'sebuah comment content',
          is_delete: true
        }
      ]

      const mockThreadRepository = new ThreadRepository()
      const mockCommentRepository = new CommentRepository()
      const mockReplyRepository = new ReplyRepository()

      mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve())
      mockThreadRepository.getDetailThread = jest.fn()
        .mockImplementation(() => Promise.resolve(useCaseThread))
      mockCommentRepository.getCommentThread = jest.fn()
        .mockImplementation(() => Promise.resolve(useCaseComment))
      mockReplyRepository.getReply = jest.fn()
        .mockImplementation(() => Promise.resolve([]))

      const detailThreadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository
      })

      const expectedThread = {
        id: 'thread-123',
        title: 'sebuah title thread',
        body: 'sebuah body thread',
        username: 'kautsar',
        date: '2023-03-02T14:51:45.880Z'
      }

      const expectedComment = [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2023-03-02T14:54:45.880Z',
          content: 'sebuah comment content',
          replies: []
        },
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2023-03-02T14:59:45.880Z',
          content: '**komentar telah dihapus**',
          replies: []
        }
      ]

      const detailThread = await detailThreadUseCase.getThread(useCasePayload)

      expect(mockThreadRepository.getDetailThread)
        .toHaveBeenCalledWith(useCasePayload.threadId)
      expect(mockCommentRepository.getCommentThread)
        .toHaveBeenCalledWith(useCasePayload.threadId)
      expect(detailThread.thread.id).toEqual(expectedThread.id)
      expect(detailThread.thread.title).toEqual(expectedThread.title)
      expect(detailThread.thread.body).toEqual(expectedThread.body)
      expect(detailThread.thread.username).toEqual(expectedThread.username)
      expect(detailThread.thread.comments).toEqual(expectedComment)
    })
  })
})
