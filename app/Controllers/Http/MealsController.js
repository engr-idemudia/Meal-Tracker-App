'use strict'

const Drive = use('Drive')
const Meal = use('App/Models/Meal');
const UserMeal = use('App/Models/UserMeal');


class MealsController {
   async new({ view }) {
        const meals = await Meal.all();
        return view.render('meals/new', { meals: meals.rows })
    }

    async create({ auth, request, response, session, antl }) {
        const mealParams = request.only(['calories', 'rating', 'meal', 'mealId']);

        // validate data
        if (parseInt(mealParams.mealId) == 0) { // 'Other' was selected
            if (!mealParams.meal || mealParams.meal.trim().length <= 0) {
                session.flash({ error: antl.formatMessage('flash_messages.meals_invalid_meal') });
                return response.redirect('/meals/new');
            }
        }

        if (parseInt(mealParams.rating) > 5 || parseInt(mealParams.rating) < 0) {
            session.flash({ error: antl.formatMessage('flash_messages.meals_invalid_rating') });
            return response.redirect('/meals/new');
        }

        const image = request.file('image', {
            types: ['image'],
            size: '500kb'
        });
        let imageContent = null;

        if (image) {
            image._validateFn();

            if (image.status == 'error') {
                session.flash({ error: antl.formatMessage('flash_messages.meals_invalid_file') });
                return response.redirect('/meals/new');
            }

            imageContent = await Drive.get(image.tmpPath);
        }
        
        // create meal data
        if (parseInt(mealParams.mealId) == 0) {
            const meal = await Meal.create({ name: mealParams.meal });
            mealParams.mealId = meal.id;
        }

        // create user meal
        await UserMeal.create({
            calories: parseInt(mealParams.calories),
            rating: parseInt(mealParams.rating),
            meal_id: parseInt(mealParams.mealId),
            user_id: auth.user.id,
            file_name: image ? image.clientName : null,
            file_blob: image ? imageContent.toString('base64') : null,
            file_ext: image ? image.extname : null
        });


        session.flash({ success: antl.formatMessage('flash_messages.meals_create_success') });
        return response.redirect('/meals');
    }

    async index({ view, auth, request, response }) {
        if (!auth.user) {
            return response.redirect('/signin');
        }

        // fetch meals created by the user and render a template
        const page = request.input('page', 1)
        const userMeals = await UserMeal.query()
            .where('user_id', '=', auth.user.id)
            .orderBy('created_at', 'desc')
            .paginate(page, 5);

        const meals = await Meal.query().where('id', 'IN', userMeals.rows.map(userMeal => userMeal.meal_id)).fetch();
        const mealRelationship = meals.rows.reduce((object, meal) => {
            object[meal.id] = meal;
            return object;
        }, {});

        return view.render('meals/index', { userMeals: userMeals, meals: mealRelationship });
    }

    async delete({ request, auth, session, response, antl }) {
        const userMealId = request.params.id;
        const userMeal = await UserMeal.find(userMealId);

        if (userMeal && userMeal.user_id === auth.user.id) {
            await userMeal.delete();
            session.flash({ success: antl.formatMessage('flash_messages.meals_delete_success') });
        } else  {
            session.flash({ error: antl.formatMessage('flash_messages.meals_not_found') });
        }
        
        return response.redirect('/meals');
    }

    async edit({ request, auth, view, antl }) {
        const userMealId = request.params.id;
        const userMeal = await UserMeal.find(userMealId);

        if (userMeal && userMeal.user_id === auth.user.id) {
            const meals = await Meal.all();
            return view.render('meals/edit', { userMeal, meals: meals.rows });
        } else  {
            session.flash({ error: antl.formatMessage('flash_messages.meals_not_found') });
        }
        
        return response.redirect('/meals');
    }

    async update({ request, session, response, auth, antl }) {
        const userMealId = request.params.id;
        const userMeal = await UserMeal.find(userMealId);

        if (!userMeal || userMeal.user_id !== auth.user.id) {
            session.flash({ error: antl.formatMessage('flash_messages.meals_not_found') });
            return response.redirect('/meals');
        }

        const mealParams = request.only(['calories', 'rating', 'meal', 'mealId']);

        // validate data
        if (parseInt(mealParams.mealId) == 0) { // 'Other' was selected
            if (!mealParams.meal || mealParams.meal.trim().length <= 0) { 
                session.flash({ error: antl.formatMessage('flash_messages.meals_invalid_meal') });
                return response.redirect(`/meals/${userMeal.id}/edit`);
            }
        }

        if (parseInt(mealParams.rating) > 5 || parseInt(mealParams.rating) < 0) {
            session.flash({ error: antl.formatMessage('flash_messages.meals_invalid_rating') });
            return response.redirect(`/meals/${userMeal.id}/edit`);
        }

        const image = request.file('image', {
            types: ['image'],
            size: '500kb'
        });
        let imageContent = null;

        if (image) {
            image._validateFn();

            if (image.status == 'error') {
                session.flash({ error: antl.formatMessage('flash_messages.meals_invalid_file') });
                return response.redirect('/meals/new');
            }

            imageContent = await Drive.get(image.tmpPath);
            userMeal.file_name = image.clientName;
            userMeal.file_blob = imageContent.toString('base64');
            userMeal.file_ext = image.extname; 
        }

        // create meal data
         if (parseInt(mealParams.mealId) == 0) {
            const meal = await Meal.create({ name: mealParams.meal });
            mealParams.mealId = meal.id;
        }
        
        userMeal.rating = mealParams.rating;
        userMeal.calories = mealParams.calories;
        userMeal.meal_id = mealParams.mealId;
        await userMeal.save();

        session.flash({ success: antl.formatMessage('flash_messages.meals_update_success') });
        return response.redirect('/meals');
    }
}

module.exports = MealsController
