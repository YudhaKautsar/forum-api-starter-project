exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    publisher: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    date: {
      type: 'TEXT',
      notNull: true
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      defaultValue: false
    },
    thread_id: {
      type: 'VARCHAR(50)'
    }
  })

  pgm.addConstraint('comments', 'fk_comments_publisher_user_id', 'FOREIGN KEY(publisher) REFERENCES users(id) ON DELETE CASCADE')
  pgm.addConstraint('comments', 'fk_comments_thread_thread_id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE')
}

exports.down = (pgm) => {
  pgm.dropTable('comments')
}
