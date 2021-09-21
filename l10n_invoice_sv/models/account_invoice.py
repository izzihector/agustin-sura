# -*- coding: utf-8 -*-
from .amount_to_text_sv import amount_to_text
from odoo import api, fields, models, _, exceptions

class AccountInvoice(models.Model):
    _inherit = 'account.invoice'
    
    inv_refund_id = fields.Many2one('account.invoice','Factura Relacionada', copy=False, track_visibility='onchange')

    state_refund = fields.Selection([
            ('refund','Retificada'),
            ('no_refund','No Retificada'),
        ], string="Retificada", index=True, readonly=True, default='no_refund',
        track_visibility='onchange', copy=False)
    
    amount_text = fields.Char(string=_('Amount to text'), store=True, readonly=True,
                              compute='_amount_to_text',track_visibility='onchange')

    number = fields.Char(related='move_id.name', store=True, readonly=False, copy=False)
		
    amount_iva = fields.Float(
      string='Monto IVA',
      digits=(10,2),
      store=True,
      readonly=True,
      compute='_compute_amount_iva'
    )

    amount_iva_retenido = fields.Float(
      string='Monto IVA retenido',
      digits=(10,2),
      store=True,
      readonly=True,
      compute='_compute_amount_iva_retenido'
    )

    def _compute_amount(self):
      res = super(AccountInvoice, self)._compute_amount()
		  
      if self.journal_id.type_report == 'ccf':
        self.amount_untaxed = sum(line.price_subtotal for line in self.invoice_line_ids)
        self.amount_tax = sum(round(line.amount_total, 2) for line in self.tax_line_ids)
        self.amount_total = self.amount_untaxed + self.amount_tax
      return res
       
    @api.one
    @api.depends('amount_total')
    def _amount_to_text(self):
        self.amount_text = amount_to_text(round(self.amount_untaxed, 2) + round(self.amount_tax, 2))
    
    @api.one
    @api.depends('tax_line_ids')
    def _compute_amount_iva(self):
      for invoice_tax in self.tax_line_ids:
        if invoice_tax.tax_id.amount == 13.0000:
          self.amount_iva = invoice_tax.amount

    @api.one
    @api.depends('tax_line_ids')
    def _compute_amount_iva_retenido(self):
      for invoice_tax in self.tax_line_ids:
        if invoice_tax.tax_id.amount == -1.0000:
          self.amount_iva_retenido = invoice_tax.amount

    @api.multi
    def invoice_print(self):
        """ Print the invoice and mark it as sent, so that we can see more
            easily the next step of the workflow
        """

        self.ensure_one()
        self.sent = True
        
        report = self.journal_id.type_report


        if report == 'ccf':
            return self.env.ref('l10n_invoice_sv.jasper_ccf_report_demo').report_action(self)
        if report == 'fcf':
            return self.env.ref('l10n_invoice_sv.jasper_fcf_report_demo').report_action(self)
        if report == 'odp':
            return self.env.ref('l10n_invoice_sv.report_orden_de_pedido').report_action(self)
        if report == 'ndc':
            return self.env['report'].get_action(self, 'l10n_invoice_sv.report_invoice_main_ndc')
        if report == 'anu':
            return self.env['report'].get_action(self, 'l10n_invoice_sv.report_invoice_main_anu')
        if report == 'axp':
            return self.env['report'].get_action(self, 'l10n_invoice_sv.report_invoice_main_aod')
        if report == 'tck':
            return self.env.ref('l10n_invoice_sv.jasper_tck_report_demo').report_action(self)
        if report == 'exp':
            return self.env.ref('l10n_invoice_sv.jasper_exp_report_demo').report_action(self)
    
    @api.multi
    def msg_error(self,campo):
      raise exceptions.ValidationError("No puede emitir un documento si falta un campo Legal "\
                                       "Verifique %s" % campo)
      return True
    
    @api.multi
    def action_invoice_open(self):
        '''validamos que partner cumple los requisitos basados en el tipo
        de documento de la sequencia del diario selecionado'''
        inv_type = self.type
        #si es factura normal
        type_report = self.journal_id.type_report
    
        if type_report == 'ccf':
          if not self.partner_id.nrc:
            self.msg_error("N.R.C.")
          """if not self.partner_id.nit:
            self.msg_error("N.I.T.")
          if not self.partner_id.giro:
            self.msg_error("Giro")"""
    
        """if type_report == 'fcf':
            if self.partner_id.company_type == 'person':
                if not self.partner_id.dui:
                    self.msg_error("D.U.I")
        """
    
        #si es retificativa
        if type_report == 'ndc':
          if not self.partner_id.nrc:
            self.msg_error("N.R.C.")
          if not self.partner_id.nit:
            self.msg_error("N.I.T.")
          if not self.partner_id.giro:
            self.msg_error("Giro")
        
        return super(AccountInvoice, self).action_invoice_open()

