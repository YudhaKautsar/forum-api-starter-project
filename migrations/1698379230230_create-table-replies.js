/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    content: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    publisher: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      defaultValue: false
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true
    }
  })

  pgm.addConstraint('replies', 'fk_replies_publisher_users_id', 'FOREIGN KEY(publisher) REFERENCES users(id) ON DELETE CASCADE')
  pgm.addConstraint('replies', 'fk_replies_comment_id_comments_id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE')
  pgm.addConstraint('replies', 'fk_replies_thread_id_threads_id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE')
}

exports.down = (pgm) => {
  pgm.dropTable('replies')
}
