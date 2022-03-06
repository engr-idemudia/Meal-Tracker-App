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
        return response.redirect('/');
    }
}

module.exports = MealsController


// post
// PostsController

// GET /posts/new => show form to collect input => PostsController.new
// POST /posts => collect the inout and process => PostsController.create


// synchronize
// asyncronize