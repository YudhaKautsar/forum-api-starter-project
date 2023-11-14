class AddedThread {
  constructor (payload) {
    this._verifyPayload(payload)

    this.id = payload.id
    this.title = payload.title
    this.publisher = payload.publisher
  }

  _verifyPayload (payload) {
    const { id, title, publisher } = payload

    if (!id || !title || !publisher) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof publisher !== 'string') {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = AddedThread
