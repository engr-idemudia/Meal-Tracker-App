'use strict'

const Meal = use('App/Models/Meal');
const UserMeal = use('App/Models/UserMeal');


class MealsController {
   async new({ view }) {
        const meals = await Meal.all();
        return view.render('meals/new', { meals: meals.rows })
    }

    async create({ view, auth, request, response, session }) {
        const mealParams = request.only(['calories', 'rating', 'meal', 'mealId']);
        console.log(mealParams);
        // validate data
        if (parseInt(mealParams.mealId) == 0) { // 'Other' was selected
            if (!mealParams.meal || mealParams.meal.trim().length <= 0) {
                session.flash({ error: 'Meal must be provided' });
                return response.redirect('/meals/new');
            }
        }

        if (parseInt(mealParams.rating) > 5 || parseInt(mealParams.rating) < 0) {
            session.flash({ error: 'Rating must be between 1 and 5' });
            return response.redirect('/meals/new');
        }


        // create data
        if (parseInt(mealParams.mealId) == 0) {
            const meal = await Meal.create({ name: mealParams.meal });
            mealParams.mealId = meal.id;
        }

        await UserMeal.create({
            calories: parseInt(mealParams.calories),
            rating: parseInt(mealParams.rating),
            meal_id: parseInt(mealParams.mealId),
            user_id: auth.user.id
        });


        session.flash({ success: 'Meal consumption created successfully' });
        return response.redirect('/meals');
    }

    async index({ view, auth }) {
        // fetch meals created by the user and render a template
        const userMeals = await UserMeal.query().where('user_id', '=', auth.user.id).orderBy('created_at', 'desc').fetch();
        const meals = await Meal.query().where('id', 'IN', userMeals.rows.map(userMeal => userMeal.meal_id)).fetch();
        const mealRelationship = meals.rows.reduce((object, meal) => {
            object[meal.id] = meal;
            return object;
        }, {});

        return view.render('meals/index', { userMeals: userMeals.rows, meals: mealRelationship });
    }
}

module.exports = MealsController
