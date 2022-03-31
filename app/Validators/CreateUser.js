'use strict'

class CreateUser {
  get rules () {
     // validation rules
    return {
      'email': 'required|unique:users',
      'password': 'required'
    }
  }

  get messages() {
    return {
      'required': `{{ field }} ${this.ctx.antl.formatMessage('common.is_required') }`,
      'unique': `{{ field }} ${this.ctx.antl.formatMessage('common.already_exists') }`
    }
  }

  async fails(error) {
    this.ctx.session.withErrors(error)
      .flashAll();
    
    return this.ctx.response.redirect('back');
  }
}

module.exports = CreateUser
