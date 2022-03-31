'use strict'

const User = use('App/Models/User');

class UsersController {
     // GET /signup
    async signup({ view }) {
        return view.render('users/signup')
    }

     // POST /signup
    async createAccount({ request, response, session, antl }) {
        await User.create(request.only(['email', 'password']))

        session.flash({ success: antl.formatMessage('flash_messages.sign_up_success') })
        return response.redirect('/');
    }

    // GET /signin
    async signin({ view }) {
        return view.render('users/signin')
    }

     // PUT /signin
    async signinUser({ request, auth, response, session, antl }) {
        const { email, password } = request.only(['email', 'password']);

        try {
            await auth.attempt(email, password); // sign user in
            session.flash({ success:  antl.formatMessage('flash_messages.sign_in_success') });
            return response.redirect('/');
        } catch (error) {
            session.flash({ error: antl.formatMessage('flash_messages.sign_in_error') })
            return response.redirect('back');
        }    
    }

    // GET /signout
    async signout ({ auth, response, session, antl }) {
        await auth.logout(); // sign user out
        session.flash({ success: antl.formatMessage('flash_messages.sign_out_success') });
        return response.redirect('/');
    }
}

module.exports = UsersController