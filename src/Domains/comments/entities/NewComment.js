class AddComment {
  constructor (payload) {
    this._verifyPayload(payload)

    this.content = payload.content
    this.threadId = payload.threadId
    this.publisher = payload.publisher
  }

  _verifyPayload (payload) {
    const { content, threadId, publisher } = payload

    if (!content || !threadId || !publisher) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof publisher !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = AddComment
