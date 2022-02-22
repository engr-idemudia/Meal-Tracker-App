'use strict'

const User = use('App/Models/User');

class UsersController {
    async signup({ view }) {
        return view.render('users/signup')
    }

    async createAccount({ request, response, session }) {
        const user = await User.create(request.only(['email', 'password']))

        // await auth.login(user);
        session.flash({ success: "User successfully created" })
        return response.redirect('/');
    }
}

module.exports = UsersController