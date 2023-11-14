const NewComment = require('../../Domains/comments/entities/NewComment')

class CommentUseCase {
  constructor ({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async addComment (useCasePayload) {
    const { threadId } = useCasePayload

    await this._threadRepository.checkAvailabilityThread(threadId)
    const comment = new NewComment(useCasePayload)
    return this._commentRepository.addComment(comment)
  }

  async deleteComment (useCasePayload) {
    this._verifyPayload(useCasePayload)
    const { commentId, threadId, publisher } = useCasePayload
    await this._threadRepository.checkAvailabilityThread(threadId)
    await this._commentRepository.checkAvailabilityComment(commentId)
    await this._commentRepository.verifyCommentpublisher(commentId, publisher)
    await this._commentRepository.deleteComment(commentId)
  }

  _verifyPayload (payload) {
    const { commentId, threadId, publisher } = payload

    if (!commentId || !threadId || !publisher) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof commentId !== 'string' || typeof threadId !== 'string' || typeof publisher !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = CommentUseCase
