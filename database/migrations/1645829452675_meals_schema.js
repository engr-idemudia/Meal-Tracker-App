'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MealsSchema extends Schema {
  up () {
    this.create('meals', (table) => {
      table.increments() // id
      table.string("name").unique().notNullable()
      table.timestamps() // created_at updated_at
    })
  }

  down () {
    this.drop('meals')
  }
}

module.exports = MealsSchema
