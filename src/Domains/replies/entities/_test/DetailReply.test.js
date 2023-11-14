const DetailReply = require('../DetailReply')

describe('a DetailReply entities', () => {
  it('shoult throw error when payload did not contain needed property', () => {
    const payload = {}

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 'sebuah reply',
      date: 53,
      username: 123,
      is_delete: [],
      commentId: {}
    }

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should deleted property correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'sebuah comment yang telah dihapus',
      date: '2023-11-08T21:56:29.033Z',
      username: 'kautsar',
      is_delete: true,
      commentId: 'comment-123'
    }

    const reply = new DetailReply(payload)

    const expectedReply = {
      id: 'reply-123',
      content: '**balasan telah dihapus**',
      date: '2023-11-08T21:56:29.033Z',
      username: 'kautsar'
    }

    expect(reply).toEqual(expectedReply)
  })

  it('should create DetailedReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'sebuah comment',
      date: '2023-11-08T20:56:29.033Z',
      username: 'kautsar',
      is_delete: false,
      commentId: 'comment-123'
    }

    const reply = new DetailReply(payload)

    const expectedReply = {
      id: 'reply-123',
      content: 'sebuah comment',
      date: '2023-11-08T20:56:29.033Z',
      username: 'kautsar'
    }

    expect(reply).toEqual(expectedReply)
  })
})
