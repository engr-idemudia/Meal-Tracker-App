'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserMeal extends Model {
    meal () {
        return this.belongsTo('App/Models/Meal')
    }
}

module.exports = UserMeal
