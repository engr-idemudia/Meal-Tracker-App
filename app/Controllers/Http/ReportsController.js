'use strict'

const Meal = use('App/Models/Meal');
const UserMeal = use('App/Models/UserMeal');

class ReportsController {

    async index({ view, auth, request }) {
        const currentUserId = auth.user.id;
        const startDate = request.get().start_date;
        const endDate = request.get().end_date;
        const page = request.get().page || 1;

        const mostConsumedMeal = await this.applyDatesToQuery(UserMeal.query(), startDate, endDate)
            .select('meal_id')
            .count('meal_id as total_count')
            .where('user_id', currentUserId)
            .groupBy('meal_id')
            .orderBy('total_count', 'desc')
            .first()
        mostConsumedMeal.meal = await Meal.find(mostConsumedMeal.meal_id);

        const highestCaloryMeal = await this.applyDatesToQuery(UserMeal.query(), startDate, endDate)
            .select('meal_id')
            .sum('calories as total_calories')
            .where('user_id', currentUserId)
            .groupBy('meal_id')
            .orderBy('total_calories', 'desc')
            .first()
        highestCaloryMeal.meal = await Meal.find(highestCaloryMeal.meal_id)

        const favoriteMeal = await this.applyDatesToQuery(UserMeal.query(), startDate, endDate)
            .select('meal_id')
            .avg('rating as average_rating')
            .where('user_id', currentUserId)
            .groupBy('meal_id')
            .orderBy('average_rating', 'desc')
            .first()
        favoriteMeal.meal = await Meal.find(favoriteMeal.meal_id)

        const userMeals = await this.applyDatesToQuery(UserMeal.query(), startDate, endDate)
            .select('meal_id')
            .count('meal_id as total_count')
            .sum('calories as total_calories')
            .avg('rating as average_rating')
            .where('user_id', currentUserId)
            .groupBy('meal_id')
            .orderBy('total_count', 'desc')
            .paginate(page, 5)

        const meals = await Meal.query().where('id', 'IN', userMeals.data.map(userMeal => userMeal.meal_id)).fetch();
        const mealsObj = {}
        meals.rows.forEach(meal => mealsObj[meal.id] = meal)

        const totals = await this.applyDatesToQuery(UserMeal.query(), startDate, endDate)
            .countDistinct('meal_id as unique_meals')
            .count('meal_id as total_count')
            .sum('calories as total_calories')
            .avg('rating as average_rating')
            .where('user_id', currentUserId)
            .first()

        return view.render('reports/index', { 
            mostConsumedMeal, 
            highestCaloryMeal, 
            favoriteMeal, 
            userMeals,
            mealsObj, 
            totals, 
            startDate,
            endDate 
        })
    }

    applyDatesToQuery(query, startDate, endDate) {
        const startDateObj = new Date(startDate)
        const endDateObj = new Date(endDate)

        if (startDate && startDateObj.toString() != 'Invalid Date' && endDate && endDateObj.toString() !== 'Invalid Date') {
            return query.where('created_at', '>=', `${startDate} 00:00:00`).where('created_at', '<=', `${endDate} 23:59:59`)
        } else if (startDate && startDateObj.toString() != 'Invalid Date') {
            return query.where('created_at', '>=', `${startDate} 00:00:00`)
        } else if (endDate && endDateObj.toString() !== 'Invalid Date') {
            return query.where('created_at', '<=', `${endDate} 23:59:59`)
        } 

        return query
    }
}

module.exports = ReportsController
