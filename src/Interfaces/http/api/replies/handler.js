const autoBind = require('auto-bind')
const ReplyUseCase = require('../../../../Applications/use_case/ReplyUseCase')

class RepliesHandler {
  constructor (container) {
    this._container = container

    autoBind(this)
  }

  async postReplyHandler (request, h) {
    const replyUseCase = this._container.getInstance(ReplyUseCase.name)
    const { id: publisher } = request.auth.credentials
    const { threadId, commentId } = request.params

    const useCasePayload = {
      content: request.payload.content,
      threadId,
      commentId,
      publisher
    }

    const addedReply = await replyUseCase.addReply(useCasePayload)

    const response = h.response({
      status: 'success',
      data: {
        addedReply
      }
    })
    response.code(201)
    return response
  }

  async deleteReplyHandler (request) {
    const replyUseCase = this._container.getInstance(ReplyUseCase.name)
    const { id: publisher } = request.auth.credentials
    const { threadId, commentId, replyId } = request.params

    const useCasePayload = {
      threadId,
      commentId,
      replyId,
      publisher
    }

    await replyUseCase.deleteReply(useCasePayload)

    const response = h.response({
      status: 'success',
      message: 'balasan berhasil dihapus'
    })
    response.code(200)
    return response
  }
}

module.exports = RepliesHandler
