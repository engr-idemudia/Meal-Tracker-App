'use strict'

const User = use('App/Models/User');

class UsersController {
     // GET /signup
    async signup({ view }) {
        return view.render('users/signup')
    }

     // POST /signup
    async createAccount({ request, response, session }) {
        await User.create(request.only(['email', 'password']))

        session.flash({ success: "Signed up successfully" })
        return response.redirect('/');
    }

    // GET /signin
    async signin({ view }) {
        return view.render('users/signin')
    }

     // PUT /signin
    async signinUser({ request, auth, response, session }) {
        const { email, password } = request.only(['email', 'password']);

        try {
            await auth.attempt(email, password); // sign user in
            session.flash({ success: 'Signed in successfully.'});
            return response.redirect('/');
        } catch (error) {
            session.flash({ error: 'Invalid email or password' })
            return response.redirect('back');
        }    
    }

    // GET /signout
    async signout ({ auth, response, session }) {
        await auth.logout(); // sign user out
        session.flash({ success: 'Signed out successfully.'});
        return response.redirect('/');
    }
}

module.exports = UsersController