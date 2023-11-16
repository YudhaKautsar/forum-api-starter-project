const AddedThread = require('../AddedThread')

describe('a AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread title'
    }

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 300,
      title: {},
      owner: 'user-123'
    }

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create PostedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread title',
      owner: 'user-123'
    }

    // Action
    const thread = new AddedThread(payload)

    // Assert
    expect(thread).toBeInstanceOf(AddedThread)
    expect(thread.id).toEqual(payload.id)
    expect(thread.title).toEqual(payload.title)
    expect(thread.owner).toEqual(payload.owner)
  })
})
