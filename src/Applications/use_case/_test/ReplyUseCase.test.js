const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const NewReply = require('../../../Domains/replies/entities/NewReply')
const ReplyUseCase = require('../ReplyUseCase')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')

describe('ReplyUseCase', () => {
  describe('newReply', () => {
    it('should orchestrating the new reply action correctly', async () => {
      const useCasePayload = {
        content: 'sebuah comment',
        publisher: 'user-123',
        commentId: 'comment-123',
        threadId: 'thread-123'
      }

      const expectedAddedReply = new AddedReply({
        id: 'reply-123',
        content: useCasePayload.content,
        publisher: useCasePayload.publisher
      })

      const mockReplyRepository = new ReplyRepository()
      const mockCommentRepository = new CommentRepository()
      const mockThreadRepository = new ThreadRepository()

      mockReplyRepository.addReply = jest.fn()
        .mockImplementation(() => Promise.resolve(expectedAddedReply))
      mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve())
      mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve())

      const addReplyUseCase = new ReplyUseCase({
        replyRepository: mockReplyRepository,
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository
      })

      const addedReply = await addReplyUseCase.addReply(useCasePayload)

      expect(addedReply).toStrictEqual(expectedAddedReply)
      expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply(useCasePayload))
      expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.commentId)
      expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.threadId)
    })
  })
  describe('deleteReply', () => {
    it('should throw error if use case payload not contain needed property', async () => {
      const useCasePayload = {}

      const mockReplyRepository = new ReplyRepository()
      const mcokThreadRepository = new ThreadRepository()
      const mockCommentRepository = new CommentRepository()

      const deleteReplyUseCase = new ReplyUseCase({
        replyRepository: mockReplyRepository,
        threadRepository: mcokThreadRepository,
        commentRepository: mockCommentRepository
      })

      await expect(deleteReplyUseCase.deleteReply(useCasePayload)).rejects.toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error if payload not meet data type specification', async () => {
      const useCasePayload = {
        replyId: 123,
        commentId: 1234,
        threadId: 1234,
        publisher: 1234
      }

      const mockReplyRepository = new ReplyRepository()
      const mcokThreadRepository = new ThreadRepository()
      const mockCommentRepository = new CommentRepository()

      const deleteReplyUseCase = new ReplyUseCase({
        replyRepository: mockReplyRepository,
        threadRepository: mcokThreadRepository,
        commentRepository: mockCommentRepository
      })

      await expect(deleteReplyUseCase.deleteReply(useCasePayload)).rejects.toThrowError('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should orchestrating the delete reply action correctly', async () => {
      const useCasePayload = {
        replyId: 'reply-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        publisher: 'user-123'
      }

      const mockReplyRepository = new ReplyRepository()
      const mcokThreadRepository = new ThreadRepository()
      const mockCommentRepository = new CommentRepository()

      mcokThreadRepository.checkAvailabilityThread = jest.fn()
        .mockImplementation(() => Promise.resolve())
      mockCommentRepository.checkAvailabilityComment = jest.fn()
        .mockImplementation(() => Promise.resolve())
      mockReplyRepository.checkAvailabilityReply = jest.fn()
        .mockImplementation(() => Promise.resolve())
      mockReplyRepository.verifyReplypublisher = jest.fn()
        .mockImplementation(() => Promise.resolve())
      mockReplyRepository.deleteReply = jest.fn()
        .mockImplementation(() => Promise.resolve())

      const deleteReplyUseCase = new ReplyUseCase({
        replyRepository: mockReplyRepository,
        threadRepository: mcokThreadRepository,
        commentRepository: mockCommentRepository
      })

      await deleteReplyUseCase.deleteReply(useCasePayload)

      expect(mcokThreadRepository.checkAvailabilityThread)
        .toBeCalledWith(useCasePayload.threadId)
      expect(mockCommentRepository.checkAvailabilityComment)
        .toBeCalledWith(useCasePayload.commentId)
      expect(mockReplyRepository.checkAvailabilityReply)
        .toBeCalledWith(useCasePayload.replyId)
      expect(mockReplyRepository.verifyReplypublisher)
        .toBeCalledWith(useCasePayload.replyId, useCasePayload.publisher)
      expect(mockReplyRepository.deleteReply)
        .toBeCalledWith(useCasePayload.replyId)
    })
  })
})
