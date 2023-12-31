const DetailThread = require('../DetailThread')

describe('a DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {}

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123
    }

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create PostedThread object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123'
    }

    // Action
    const thread = new DetailThread(payload)

    // Assert
    expect(thread).toBeInstanceOf(DetailThread)
    expect(thread.threadId).toEqual(payload.threadId)
  })
})
