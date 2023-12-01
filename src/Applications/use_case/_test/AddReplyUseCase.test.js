const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const NewReply = require('../../../Domains/replies/entities/NewReply')
const AddReplyUseCase = require('../AddReplyUseCase')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')

describe('AddReplyUseCase', () => {
  it('should orchestrating the new reply action correctly', async () => {
    const useCasePayload = {
      content: 'sebuah comment',
      owner: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123'
    }

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      commentId: useCasePayload.commentId,
      threadId: useCasePayload.threadId
    })

    const mockReplyRepository = new ReplyRepository()
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()

    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply))
    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve())
    mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve())

    const addAddReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    const addedReply = await addAddReplyUseCase.addReply(useCasePayload)

    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-123',
      content: 'sebuah comment',
      owner: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123'
    }))
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply(useCasePayload))
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.commentId)
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.threadId)
  })
})
