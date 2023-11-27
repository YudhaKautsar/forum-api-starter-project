const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddCommentUseCase = require('../AddCommentUseCase')
const NewComment = require('../../../Domains/comments/entities/NewComment')

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      content: 'sebuah comment',
      owner: 'user-321'
    }

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      threadId: useCasePayload.threadId,
      content: useCasePayload.content,
      owner: useCasePayload.owner
    })
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve())
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(mockAddedComment))

    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    const addedComment = await getCommentUseCase.addComment(useCasePayload)

    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.threadId)
    expect(addedComment).toStrictEqual(mockAddedComment)
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment(useCasePayload))
  })
})
