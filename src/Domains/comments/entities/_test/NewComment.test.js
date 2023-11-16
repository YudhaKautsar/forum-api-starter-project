const NewComment = require('../NewComment')

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'comment'
    }

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: {},
      threadId: 123,
      owner: []
    }

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create comment object correctly', () => {
    const payload = {
      content: 'comment thread',
      threadId: 'thread-123',
      owner: 'user-321'
    }

    const comment = new NewComment(payload)

    expect(comment.content).toEqual(payload.content)
    expect(comment.threadId).toEqual(payload.threadId)
    expect(comment.owner).toEqual(payload.owner)
  })
})
