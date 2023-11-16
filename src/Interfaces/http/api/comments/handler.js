const autoBind = require('auto-bind')
const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase')

class CommentsHandler {
  constructor (container) {
    this._container = container

    autoBind(this)
  }

  async postCommentHandler (request, h) {
    const commentUseCase = this._container.getInstance(CommentUseCase.name)
    const { id: credentialId } = request.auth.credentials
    const { threadId } = request.params

    const useCasePayload = {
      content: request.payload.content,
      threadId,
      owner: credentialId
    }

    const addedComment = await commentUseCase.addComment(useCasePayload)

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
    const commentUseCase = this._container.getInstance(CommentUseCase.name)
    const { id: credentialId } = request.auth.credentials
    const { threadId, commentId } = request.params

    const useCasePayload = {
      threadId,
      commentId,
      owner: credentialId
    }

    await commentUseCase.deleteComment(useCasePayload)

    return h.response({
      status: 'success'
    })
  }
}

module.exports = CommentsHandler
