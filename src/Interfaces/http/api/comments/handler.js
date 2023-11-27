const autoBind = require('auto-bind')
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')

class CommentsHandler {
  constructor (container) {
    this._container = container

    autoBind(this)
  }

  async postCommentHandler (request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name)
    const { id: credentialId } = request.auth.credentials
    const { threadId } = request.params

    const useCasePayload = {
      content: request.payload.content,
      threadId,
      owner: credentialId
    }

    const addedComment = await addCommentUseCase.addComment(useCasePayload)

    const response = h.response({
      status: 'success',
      data: {
        addedComment
      }
    })
    response.code(201)
    return response
  }

  async deleteCommentHandler (request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name)
    const { id: credentialId } = request.auth.credentials
    const { threadId, commentId } = request.params

    const useCasePayload = {
      threadId,
      commentId,
      owner: credentialId
    }

    await deleteCommentUseCase.deleteComment(useCasePayload)

    const response = h.response({
      status: 'success',
      message: 'comment berhasil dihapus'
    })
    response.code(200)

    return response
  }
}

module.exports = CommentsHandler
