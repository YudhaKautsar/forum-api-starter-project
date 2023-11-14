const CommentRepository = require('../../Domains/comments/CommentRepository')
const AddedComment = require('../../Domains/comments/entities/AddedComment')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')

class CommentRepositoryPostgres extends CommentRepository {
  constructor (pool, idGenerator) {
    super()

    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addComment (comment) {
    const { content, publisher, threadId } = comment
    const id = `comment-${this._idGenerator()}`

    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, publisher',
      values: [id, content, publisher, date, false, threadId]
    }

    const result = await this._pool.query(query)
    return new AddedComment(result.rows[0])
  }

  async checkAvailabilityComment (commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan')
    }
  }

  async verifyCommentpublisher (commentId, publisher) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND publisher = $2',
      values: [commentId, publisher]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new AuthorizationError('anda tidak dapat menghapus komentar orang lain!')
    }
  }

  async deleteComment (commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2',
      values: [true, commentId]
    }

    await this._pool.query(query)
  }

  async getCommentThread (threadId) {
    const query = {
      text: `SELECT A.id, B.username, A.date, A.content, A.is_delete
        FROM comments A
        LEFT JOIN users B ON A.publisher = B.id
        WHERE A.thread_id = $1
        ORDER BY A.date ASC`,
      values: [threadId]
    }

    const result = await this._pool.query(query)
    return result.rows
  }
}

module.exports = CommentRepositoryPostgres
