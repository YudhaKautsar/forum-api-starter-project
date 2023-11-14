/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'TEXT',
      notNull: true
    },
    body: {
      type: 'TEXT',
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
    }
  })

  pgm.addConstraint('threads', 'fk_threads_publisher_user_id', 'FOREIGN KEY(publisher) REFERENCES users(id) ON DELETE CASCADE')
}

exports.down = (pgm) => {
  pgm.dropTable('threads')
}
