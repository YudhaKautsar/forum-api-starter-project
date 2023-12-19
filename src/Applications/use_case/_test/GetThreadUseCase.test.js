const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const GetThreadUseCase = require('../GetThreadUseCase')

describe('GetThreadUseCase', () => {
  it('should orchestrating the detail thread action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123'
    }

    const useCaseThread = {
      id: useCasePayload.threadId,
      title: 'sebuah title thread',
      body: 'sebuah body thread',
      username: 'kautsar',
      date: '2023-03-02T14:51:45.880Z'
    }

    const useCaseComment = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2023-11-14T14:54:45.880Z',
        content: 'sebuah comment content',
        is_delete: false

      },
      {
        id: 'comment-234',
        username: 'dicoding',
        date: '2023-11-14T14:59:45.880Z',
        content: 'sebuah comment content',
        is_delete: true
      }
    ]

    const useCaseReplies = [
      {
        id: 'reply-123',
        username: 'dicoding',
        date: '2023-11-14T14:54:45.880Z',
        content: 'sebuah reply',
        is_delete: false,
        commentId: 'comment-123'
      },
      {
        id: 'reply-234',
        username: 'dicoding',
        date: '2023-11-14T14:59:45.880Z',
        content: 'sebuah reply',
        is_delete: true,
        commentId: 'comment-123'
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
      .mockImplementation(() => Promise.resolve(useCaseReplies))

    const detailThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    })

    const expectedComment = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2023-11-14T14:54:45.880Z',
        content: 'sebuah comment content',
        replies: [
          {
            content: 'sebuah reply',
            date: '2023-11-14T14:54:45.880Z',
            id: 'reply-123',
            username: 'dicoding'
          },
          {
            content: '**balasan telah dihapus**',
            date: '2023-11-14T14:59:45.880Z',
            id: 'reply-234',
            username: 'dicoding'

          }

        ]
      },
      {
        id: 'comment-234',
        username: 'dicoding',
        date: '2023-11-14T14:59:45.880Z',
        content: '**komentar telah dihapus**',
        replies: []
      }
    ]

    const expectedReply = [
      {
        id: 'reply-123',
        username: 'dicoding',
        date: '2023-11-14T14:54:45.880Z',
        content: 'sebuah reply'
      },
      {
        id: 'reply-234',
        username: 'dicoding',
        date: '2023-11-14T14:59:45.880Z',
        content: '**balasan telah dihapus**'
      }
    ]

    const detailThread = await detailThreadUseCase.getThread(useCasePayload)

    console.log(detailThread.thread)
    expect(mockThreadRepository.getDetailThread)
      .toHaveBeenCalledWith(useCasePayload.threadId)
    expect(mockCommentRepository.getCommentThread)
      .toHaveBeenCalledWith(useCasePayload.threadId)
    expect(mockReplyRepository.getReply)
      .toHaveBeenCalledWith(useCasePayload.threadId)
    expect(detailThread.thread.id).toEqual(useCaseThread.id)
    expect(detailThread.thread.title).toEqual(useCaseThread.title)
    expect(detailThread.thread.body).toEqual(useCaseThread.body)
    expect(detailThread.thread.username).toEqual(useCaseThread.username)
    expect(detailThread.thread.date).toEqual(useCaseThread.date)
    expect(detailThread.thread.comments).toEqual(expectedComment)
    expect(detailThread.thread.comments[0].replies).toEqual(expectedReply)
  })
})
