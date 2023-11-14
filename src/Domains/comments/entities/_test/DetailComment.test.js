const DetailComment = require('../DetailComment')

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123'
    }

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      content: {},
      date: 80,
      username: [],
      is_delete: true
    }

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should delete peroperty correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'kautsar',
      date: '2023-11-08T20:56:29.033Z',
      content: 'sebuah comment',
      is_delete: true
    }

    const comment = new DetailComment(payload)

    const expectedComment = {
      id: 'comment-123',
      username: 'kautsar',
      date: '2023-11-08T20:56:29.033Z',
      content: '**komentar telah dihapus**'
    }

    expect(comment).toEqual(expectedComment)
  })

  it('should create DetailComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'kautsar',
      date: '2023-11-08T14:56:29.033Z',
      content: 'sebuah comment',
      is_delete: false
    }

    const comment = new DetailComment(payload)

    const expectedComment = {
      id: 'comment-123',
      username: 'kautsar',
      date: '2023-11-08T14:56:29.033Z',
      content: 'sebuah comment'
    }

    expect(comment).toEqual(expectedComment)
  })
})
