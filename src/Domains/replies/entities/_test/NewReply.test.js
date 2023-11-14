const NewReply = require('../NewReply')

describe('a NewReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'sebuah comment'
    }

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 'sebuah comment',
      publisher: {},
      commentId: [],
      threadId: 321
    }

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create reply object correctly', () => {
    const payload = {
      content: 'sebuah comment',
      publisher: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123'
    }

    const reply = new NewReply(payload)

    expect(reply.content).toEqual(payload.content)
    expect(reply.publisher).toEqual(payload.publisher)
    expect(reply.commentId).toEqual(payload.commentId)
    expect(reply.threadId).toEqual(payload.threadId)
  })
})
