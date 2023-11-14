const NewThread = require('../../Domains/threads/entities/NewThread')
const DetailComment = require('../../Domains/comments/entities/DetailComment')
const DetailReply = require('../../Domains/replies/entities/DetailReply')

class ThreadUseCase {
  constructor ({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
  }

  async addThread (useCasePayload) {
    const newThread = new NewThread(useCasePayload)

    return this._threadRepository.addThread(newThread)
  }

  async getThread (useCasePayload) {
    const { threadId } = useCasePayload

    await this._threadRepository.checkAvailabilityThread(threadId)
    const threadResult = await this._threadRepository.getDetailThread(threadId)
    const commentResult = await this._commentRepository.getCommentThread(threadId)
    const repliesResult = await this._replyRepository.getReply(threadId)

    threadResult.comments = commentResult.map((comment) => {
      comment.replies = repliesResult.filter((filtered) => filtered.commentId === comment.id).map((reply) => new DetailReply(reply))
      return new DetailComment(comment)
    })

    return { thread: threadResult }
  }
}

module.exports = ThreadUseCase
