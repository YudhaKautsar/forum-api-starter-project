const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentUseCase = require('../CommentUseCase')
const NewComment = require('../../../Domains/comments/entities/NewComment')

describe('CommentUseCase', () => {
  describe('addComment', () => {
    it('should orchestrating the add comment action correctly', async () => {
      const useCasePayload = {
        threadId: 'thread-123',
        content: 'sebuah comment',
        owner: 'user-321'
      }

      const expectedAddedComment = new AddedComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-321'
      })

      const mockCommentRepository = new CommentRepository()
      const mockThreadRepository = new ThreadRepository()

      mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve())
      mockCommentRepository.addComment = jest.fn(() => Promise.resolve(expectedAddedComment))

      const getCommentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository
      })

      const addedComment = await getCommentUseCase.addComment(useCasePayload)

      expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.threadId)
      expect(addedComment).toStrictEqual(expectedAddedComment)
      expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment(useCasePayload))
    })
  })

  describe('deleteComment', () => {
    it('should throw error if use case payload not contain needed property', async () => {
      const useCasePayload = {}
      const deleteCommentUseCase = new CommentUseCase({})

      await expect(() => deleteCommentUseCase.deleteComment(useCasePayload))
        .rejects
        .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error if payload not meet data type specification', async () => {
      const useCasePayload = {
        threadId: 123,
        commentId: 123,
        owner: 1234
      }
      const deleteCommentUseCase = new CommentUseCase({})

      await expect(() => deleteCommentUseCase.deleteComment(useCasePayload))
        .rejects
        .toThrowError('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should orchestrating the delete comment action correctly', async () => {
      const useCasePayload = {
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123'
      }

      const mockThreadRepository = new ThreadRepository()
      const mockCommentRepository = new CommentRepository()

      mockThreadRepository.checkAvailabilityThread = jest.fn()
        .mockImplementation(() => Promise.resolve())
      mockCommentRepository.checkAvailabilityComment = jest.fn()
        .mockImplementation(() => Promise.resolve())
      mockCommentRepository.verifyCommentowner = jest.fn()
        .mockImplementation(() => Promise.resolve())
      mockCommentRepository.deleteComment = jest.fn()
        .mockImplementation(() => Promise.resolve())

      const deleteCommentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository
      })

      await deleteCommentUseCase.deleteComment(useCasePayload)

      expect(mockThreadRepository.checkAvailabilityThread)
        .toBeCalledWith(useCasePayload.threadId)
      expect(mockCommentRepository.checkAvailabilityComment)
        .toBeCalledWith(useCasePayload.commentId)
      expect(mockCommentRepository.verifyCommentowner)
        .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner)
      expect(mockCommentRepository.deleteComment)
        .toBeCalledWith(useCasePayload.commentId)
    })
  })
})
