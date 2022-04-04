'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class SetLocale {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, antl, session }, next) {
    // fetch previously saved user locale
    const savedLocale = session.get('locale');
    let locale = request.get().lang || savedLocale;

    // accept only 'en' or 'fr'
    if (locale !== 'en' && locale !== 'ee' && locale !== 'fr') {
      locale = 'en'
    }

    antl.switchLocale(locale);

    if (locale !== savedLocale) {
      // remember user locale for future requests
      session.put('locale', locale);
    }

    // call next to advance the request
    await next()
  }
}

module.exports = SetLocale
