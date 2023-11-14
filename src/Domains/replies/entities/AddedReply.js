class AddedReply {
  constructor (payload) {
    this._verfyPayload(payload)
    const { id, content, publisher } = payload

    this.id = id
    this.content = content
    this.publisher = publisher
  }

  _verfyPayload (payload) {
    const { id, content, publisher } = payload

    if (!id || !content || !publisher) {
      throw new Error('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof publisher !== 'string') {
      throw new Error('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = AddedReply
