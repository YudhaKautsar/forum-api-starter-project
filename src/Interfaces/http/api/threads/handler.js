const autoBind = require('auto-bind')
const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase')

class ThreadsHandler {
  constructor (container) {
    this._container = container

    autoBind(this)
  }

  async postThreadHandler (request, h) {
    const threadUseCase = this._container.getInstance(ThreadUseCase.name)
    const { id: credentialId } = request.auth.credentials

    const useCasePayload = {
      ...request.payload,
      publisher: credentialId
    }

    const addedThread = await threadUseCase.addThread(useCasePayload)
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
    const threadUseCase = this._container.getInstance(ThreadUseCase.name)
    const useCasePayload = {
      threadId: request.params.threadId
    }
    const { thread } = await threadUseCase.getThread(useCasePayload)
    return {
      status: 'success',
      data: {
        thread
      }
    }
  }
}

module.exports = ThreadsHandler
