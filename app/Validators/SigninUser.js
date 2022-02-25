'use strict'

class SigninUser {
  get rules () {
     // validation rules
    return {
      'email': 'required',
      'password': 'required'
    }
  }

  get messages() {
    return {
      'required': '{{ field }} is required.'
    }
  }

  async fails(error) {
    this.ctx.session.withErrors(error)
      .flashAll();
    
    return this.ctx.response.redirect('back');
  }
}

module.exports = SigninUser
