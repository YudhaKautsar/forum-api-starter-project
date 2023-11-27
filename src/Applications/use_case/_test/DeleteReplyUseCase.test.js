const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DeleteReplyUseCase = require('../DeleteReplyUseCase')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')

describe('DeleteReplyUseCase', () => {
  it('should throw error if use case payload not contain needed property', async () => {
    const useCasePayload = {}

    const mockReplyRepository = new ReplyRepository()
    const mcokThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    const deleteAddReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mcokThreadRepository,
      commentRepository: mockCommentRepository
    })

    await expect(deleteAddReplyUseCase.deleteReply(useCasePayload)).rejects.toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error if payload not meet data type specification', async () => {
    const useCasePayload = {
      replyId: 123,
      commentId: 1234,
      threadId: 1234,
      owner: 1234
    }

    const mockReplyRepository = new ReplyRepository()
    const mcokThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    const deleteAddReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mcokThreadRepository,
      commentRepository: mockCommentRepository
    })

    await expect(deleteAddReplyUseCase.deleteReply(useCasePayload)).rejects.toThrowError('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should orchestrating the delete reply action correctly', async () => {
    const useCasePayload = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123'
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
    mockReplyRepository.verifyReplyowner = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const deleteAddReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mcokThreadRepository,
      commentRepository: mockCommentRepository
    })

    await deleteAddReplyUseCase.deleteReply(useCasePayload)

    expect(mcokThreadRepository.checkAvailabilityThread)
      .toBeCalledWith(useCasePayload.threadId)
    expect(mockCommentRepository.checkAvailabilityComment)
      .toBeCalledWith(useCasePayload.commentId)
    expect(mockReplyRepository.checkAvailabilityReply)
      .toBeCalledWith(useCasePayload.replyId)
    expect(mockReplyRepository.verifyReplyowner)
      .toBeCalledWith(useCasePayload.replyId, useCasePayload.owner)
    expect(mockReplyRepository.deleteReply)
      .toBeCalledWith(useCasePayload.replyId)
  })
})
