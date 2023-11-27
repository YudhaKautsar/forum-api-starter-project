const NewComment = require('../../Domains/comments/entities/NewComment')

class AddCommentUseCase {
  constructor ({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async addComment (useCasePayload) {
    const comment = new NewComment(useCasePayload)
    await this._threadRepository.checkAvailabilityThread(comment.threadId)
    return this._commentRepository.addComment(comment)
  }
}

module.exports = AddCommentUseCase
