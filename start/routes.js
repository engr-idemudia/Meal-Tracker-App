'use strict'

const MealsController = require('../app/Controllers/Http/MealsController');

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', 'HomeController.index') // root route
Route.get('/signup', 'UsersController.signup')
Route.post('/signup', 'UsersController.createAccount').validator('CreateUser');

Route.get('/signin', 'UsersController.signin')
Route.post('/signin', 'UsersController.signinUser').validator('SigninUser')

Route.get('/signout', 'UsersController.signout');

// protected route
Route.group(() => {
    Route.get('/meals/new', 'MealsController.new');
    Route.post('/meals', 'MealsController.create').validator('SaveMeal')
    Route.get('/meals', 'MealsController.index')
    Route.delete('/meals/:id', 'MealsController.delete')
    Route.get('/meals/:id/edit', 'MealsController.edit')
    Route.put('/meals/:id/update', 'MealsController.update').validator('SaveMeal');
}).middleware(['auth'])
