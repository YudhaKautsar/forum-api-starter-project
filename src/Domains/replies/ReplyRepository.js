class ReplyRepository {
  async addReply () {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getReply (threadId) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteReply (id) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async checkAvailabilityReply (replyId) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyReplyowner (replyId, owner) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getCommentReplies (commentId) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = ReplyRepository
