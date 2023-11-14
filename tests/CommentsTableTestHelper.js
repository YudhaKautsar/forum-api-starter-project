/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentsTableTestHelper = {
  async addComment ({
    id = 'comment-123',
    content = 'sebuah content comment',
    publisher = 'user-321',
    date = new Date(),
    isDelete = false,
    threadId = 'thread-123'
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, publisher, date, isDelete, threadId]
    }

    await pool.query(query)
  },

  async findCommentById (id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id]
    }
    const result = await pool.query(query)

    return result.rows
  },

  async checkIsDeletedCommentsById (id) {
    const query = {
      text: 'SELECT is_delete FROM comments WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows[0].is_delete
  },

  async deleteComment (id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [id]
    }

    await pool.query(query)
  },

  async cleanTable () {
    await pool.query('DELETE FROM comments WHERE 1=1')
  }
}

module.exports = CommentsTableTestHelper
