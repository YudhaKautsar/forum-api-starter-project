class NewThread {
  constructor (payload) {
    this._verifyPayload(payload)

    this.title = payload.title
    this.body = payload.body
    this.publisher = payload.publisher
  }

  _verifyPayload (payload) {
    const { title, body, publisher } = payload

    if (!title || !body || !publisher) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof publisher !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = NewThread
