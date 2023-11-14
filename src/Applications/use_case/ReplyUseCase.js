const NewReply = require('../../Domains/replies/entities/NewReply')

class ReplyUseCase {
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

  async deleteReply (useCasePayload) {
    this._verifyPayload(useCasePayload)
    const {
      replyId, commentId, threadId, publisher
    } = useCasePayload

    await this._threadRepository.checkAvailabilityThread(threadId)
    await this._commentRepository.checkAvailabilityComment(commentId)
    await this._replyRepository.checkAvailabilityReply(replyId)
    await this._replyRepository.verifyReplypublisher(replyId, publisher)
    return this._replyRepository.deleteReply(replyId)
  }

  _verifyPayload (payload) {
    const {
      replyId, commentId, threadId, publisher
    } = payload

    if (!replyId || !commentId || !threadId || !publisher) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof replyId !== 'string' || typeof commentId !== 'string' || typeof threadId !== 'string' || typeof publisher !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = ReplyUseCase
