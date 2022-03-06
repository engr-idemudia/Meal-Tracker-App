'use strict'


class SaveMeal {
  get rules () {
    return {
      'calories': 'required',
      'rating': 'required'
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

module.exports = SaveMeal

