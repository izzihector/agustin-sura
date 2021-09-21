# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request

class Hello(http.Controller):
    @http.route('/iva', auth='user')
    def hello(self, **kwargs):
        response = request.render('l10n_vat_books_sv.vat_template')
        response.qcontext['db_name'] = request.session['db']
        response.qcontext['username'] = request.session['login']
        response.qcontext['uid'] = request.session['uid']
        response.qcontext['session_token'] = request.session['session_token']
        return response

