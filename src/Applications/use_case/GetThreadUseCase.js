const DetailComment = require('../../Domains/comments/entities/DetailComment')
const DetailReply = require('../../Domains/replies/entities/DetailReply')

class GetThreadUseCase {
  constructor ({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
  }

  async getThread (useCasePayload) {
    const { threadId } = useCasePayload
    await this._threadRepository.checkAvailabilityThread(threadId)
    const threadResult = await this._threadRepository.getDetailThread(threadId)
    const commentResult = await this._commentRepository.getCommentThread(threadId)
    const repliesResult = await this._replyRepository.getReply(threadId)
    console.log(threadResult.comments)

    threadResult.comments = commentResult.map((comment) => {
      comment.replies = repliesResult.filter((filtered) => filtered.commentId === comment.id).map((reply) => new DetailReply(reply))
      console.log(comment)
      return new DetailComment(comment)
    })

    return { thread: threadResult }
  }
}

module.exports = GetThreadUseCase
