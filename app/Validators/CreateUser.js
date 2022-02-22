'use strict'

const validator = require('@adonisjs/validator/src/Validator')

console.log('validator', validator);

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
      'required': '{{ field }} is required.',
      'unique': '{{ field }} already exists'
    }
  }

  async fails(error) {
    this.ctx.session.withErrors(error)
      .flashAll();
    
    return this.ctx.response.redirect('back');
  }
}

module.exports = CreateUser
