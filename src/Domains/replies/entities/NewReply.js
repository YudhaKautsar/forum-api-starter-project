class AddReply {
  constructor (payload) {
    this._verifyPayload(payload)

    this.content = payload.content
    this.owner = payload.owner
    this.commentId = payload.commentId
    this.threadId = payload.threadId
  }

  _verifyPayload (payload) {
    const {
      content, owner, commentId, threadId
    } = payload

    if (!content || !owner || !commentId || !threadId) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof commentId !== 'string' || typeof threadId !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = AddReply
