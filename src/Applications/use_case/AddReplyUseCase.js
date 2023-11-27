const NewReply = require('../../Domains/replies/entities/NewReply')

class AddReplyUseCase {
  constructor ({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async addReply (useCasePayload) {
    const newReply = new NewReply(useCasePayload)

    await this._threadRepository.checkAvailabilityThread(newReply.threadId)
    await this._commentRepository.checkAvailabilityComment(newReply.commentId)
    return this._replyRepository.addReply(newReply)
  }
}

module.exports = AddReplyUseCase
