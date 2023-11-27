const NewThread = require('../../../Domains/threads/entities/NewThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddThreadUseCase = require('../AddThreadUseCase')

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // arrange
    const useCasePayload = {
      title: 'sebuah thread title',
      body: 'sebuah body',
      owner: 'user-123'
    }

    const mockAddedComment = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner

    })

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment))

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository
    })

    // action
    const addThread = await addThreadUseCase.addThread(useCasePayload)

    // assert
    expect(addThread).toStrictEqual(mockAddedComment)
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread(useCasePayload))
  })
})
