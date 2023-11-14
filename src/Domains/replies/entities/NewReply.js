class AddReply {
  constructor (payload) {
    this._verifyPayload(payload)

    this.content = payload.content
    this.publisher = payload.publisher
    this.commentId = payload.commentId
    this.threadId = payload.threadId
  }

  _verifyPayload (payload) {
    const {
      content, publisher, commentId, threadId
    } = payload

    if (!content || !publisher || !commentId || !threadId) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof content !== 'string' || typeof publisher !== 'string' || typeof commentId !== 'string' || typeof threadId !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = AddReply
