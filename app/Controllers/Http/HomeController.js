'use strict'

class HomeController {

    async index({ view }) {
        return view.render('home/index')
    }
}

module.exports = HomeController
