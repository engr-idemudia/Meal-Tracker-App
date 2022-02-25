'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserMealsSchema extends Schema {
  up () {
    this.create('user_meals', (table) => {
      table.increments()
      table.integer('calories').unsigned().notNullable()
      table.integer('rating').unsigned().notNullable()
      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.integer('meal_id').unsigned().notNullable().references('meals.id').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('user_meals')
  }
}

module.exports = UserMealsSchema
