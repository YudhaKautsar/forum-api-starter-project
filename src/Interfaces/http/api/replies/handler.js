const autoBind = require('auto-bind')
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase')
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase')

class RepliesHandler {
  constructor (container) {
    this._container = container

    autoBind(this)
  }

  async postReplyHandler (request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name)
    const { id: owner } = request.auth.credentials
    const { threadId, commentId } = request.params

    const useCasePayload = {
      content: request.payload.content,
      threadId,
      commentId,
      owner
    }

    const addedReply = await addReplyUseCase.addReply(useCasePayload)

    const response = h.response({
      status: 'success',
      data: {
        addedReply
      }
    })
    response.code(201)
    return response
  }

  async deleteReplyHandler (request, h) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name)
    const { id: credentialId } = request.auth.credentials
    const { threadId, commentId, replyId } = request.params

    const useCasePayload = {
      replyId,
      commentId,
      threadId,
      owner: credentialId
    }

    await deleteReplyUseCase.deleteReply(useCasePayload)

    const response = h.response({
      status: 'success',
      message: 'balasan berhasil dihapus'
    })
    response.code(200)

    return response
  }
}

module.exports = RepliesHandler
