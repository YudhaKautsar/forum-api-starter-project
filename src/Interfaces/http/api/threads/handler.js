const autoBind = require('auto-bind')
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase')
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase')

class ThreadsHandler {
  constructor (container) {
    this._container = container

    autoBind(this)
  }

  async postThreadHandler (request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name)
    const { id: credentialId } = request.auth.credentials

    const useCasePayload = {
      ...request.payload,
      owner: credentialId
    }

    const addedThread = await addThreadUseCase.addThread(useCasePayload)
    const response = h.response({
      status: 'success',
      data: {
        addedThread
      }
    })
    response.code(201)
    return response
  }

  async getDetailThreadHandler (request) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name)
    const useCasePayload = {
      threadId: request.params.threadId
    }
    const { thread } = await getThreadUseCase.getThread(useCasePayload)
    return {
      status: 'success',
      data: {
        thread
      }
    }
  }
}

module.exports = ThreadsHandler
