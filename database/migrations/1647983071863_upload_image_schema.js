'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UploadImageSchema extends Schema {
  up () {
    this.table('user_meals', (table) => {
      // alter table
      table.string('file_name');
      table.text('file_blob', 'longtext')
      table.string('file_ext');
    });
  }

  down () {
    this.table('user_meals', (table) => {
      table.dropColumn('file_name');
      table.dropColumn('file_blob');
      table.dropColumn('file_ext');
    });
  }
}

module.exports = UploadImageSchema
