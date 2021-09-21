from odoo import models, fields, api, exceptions, _
import base64
import lxml.etree as ET

class AccountChartWizard(models.TransientModel):
    _name = "account_chart_to_xml.wizard"
    _description = "Generación de XML de plan de cuentas a partir de cuentas ingresadas en el sistema"

    identifier = fields.Char(string="ID", default="sv_coa")

    name = fields.Char(string="Nombre", default="Plan de cuentas de El Salvador")

    transfer_account_id = fields.Many2one(
        "account.account",
        string="Cuenta de transferencias"
    )

    code_digits = fields.Integer(string="No. de dígitos de los códigos", default=4)
    bank_account_code_prefix = fields.Char(string="Prefijo de las cuentas de banco")
    cash_account_code_prefix = fields.Char(string="Prefijo de las cuentas de efectivo")
    currency_id = fields.Many2one(
        "res.currency",
        string="Moneda",
        default=lambda self: self._default_currency()
    )

    property_account_receivable_id = fields.Many2one(
        "account.account",
        string="Cuentas por cobrar"
    )

    property_account_payable_id = fields.Many2one(
        "account.account",
        string="Cuentas por pagar"
    )

    property_account_expense_categ_id = fields.Many2one(
        "account.account",
        string="Gastos"
    )

    property_account_income_categ_id = fields.Many2one(
        "account.account",
        string="Ingresos"
    )

    use_anglo_saxon = fields.Boolean(string="Usar contabilidad anglosajona?", default=True)
    complete_tax_set = fields.Boolean(string="Conjunto completo de impuestos?", default=True)
    property_stock_account_input_categ_id = fields.Many2one(
        "account.account",
        string="Cuenta de entrada en inventario"
    )

    property_stock_account_output_categ_id = fields.Many2one(
        "account.account",
        string="Cuenta de salida en inventario"
    )

    property_stock_valuation_account_id = fields.Many2one(
        "account.account",
        string="Cuenta de valoración de inventario"
    )
    
    @api.multi
    def generate_xml(self):
        self.ensure_one()


        my_file = self.env['accounting_chart_to_xml.download_files'].create({
            'account_chart': base64.b64encode(str.encode(self.generate_account_chart())),
            'account_group': base64.b64encode(str.encode(self.generate_account_group_xml()))
        })

        return {
            'name': _('Download File'),
            'res_id': my_file.id,
            'res_model': 'accounting_chart_to_xml.download_files',
            'target': 'new',
            'type': 'ir.actions.act_window',
            'view_id': self.env.ref('accounting_chart_to_xml.download_files_view').id,
            'view_mode': 'form',
            'view_type': 'form',
        }

    @api.model
    def generate_account_group_xml(self):
        root = ET.Element("odoo")
        data = ET.SubElement(root, "data")
        data.set("noupdate", "0")

        # recorriendo todos los grupos
        group_ids = self.env['account.group'].search_read([])

        for group in group_ids:
            record = ET.SubElement(data, "record")
            record.set("id", group["code_prefix"])
            record.set("model", "account.group")

            name = ET.SubElement(record, "field")
            name.set("name", "name")
            name.text = group["name"]

            code_prefix = ET.SubElement(record, "field")
            code_prefix.set("name", "code_prefix")
            code_prefix.text = group["code_prefix"]

            if group["parent_id"] != False:
                parent_id = ET.SubElement(record, "field")
                parent_id.set("name", "parent_id")
                parent_id.set("ref", group["parent_id"][1].split(" ")[0])
            #endif
        #endfor
        return ET.tostring(root, pretty_print=True, xml_declaration=True, encoding='UTF-8').decode()
    
    @api.model
    def generate_account_chart(self):
        root = ET.Element("odoo")
        data = ET.SubElement(root, "data")
        data.set("noupdate", "0")

        """
        The are all the fields required for the
        transfer_account_id.
        As I understand is an account used, for example, to
        transfer money between the cash box and a bank account
        """
        record = ET.SubElement(data, "record")
        record.set("id", "transfer_account_id")
        record.set("model", "account.account.template")
        # code
        code = ET.SubElement(record, "field")
        code.set("name", "code")
        code.text = self.transfer_account_id.code
        # name
        name = ET.SubElement(record, "field")
        name.set("name", "name")
        name.text = self.transfer_account_id.name
        # reconcile
        reconcile = ET.SubElement(record, "field")
        reconcile.set("name", "reconcile")
        reconcile.set("eval", "True")
        # user_type_id
        user_type_id = ET.SubElement(record, "field")
        user_type_id.set("name", "user_type_id")
        user_type_id.set("ref", "account.data_account_type_current_assets")


        """
        This fields are required for the
        account.chart.template
        """
        record = ET.SubElement(data, "record")
        record.set("id", self.identifier)
        record.set("model", "account.chart.template")
        # name
        name = ET.SubElement(record, "field")
        name.set("name", "name")
        name.text = self.name
        # code_digits
        code_digits = ET.SubElement(record, "field")
        code_digits.set("name", "code_digits")
        code_digits.text = str(self.code_digits)
        # bank_account_code_prefix
        bank_account_code_prefix = ET.SubElement(record, "field")
        bank_account_code_prefix.set("name", "bank_account_code_prefix")
        bank_account_code_prefix.text = self.bank_account_code_prefix
        # cash_account_code_prefix
        cash_account_code_prefix = ET.SubElement(record, "field")
        cash_account_code_prefix.set("name", "cash_account_code_prefix")
        cash_account_code_prefix.text = self.cash_account_code_prefix
        # transfer_account_id
        transfer_account_id = ET.SubElement(record, "field")
        transfer_account_id.set("name", "transfer_account_id")
        transfer_account_id.set("ref", "transfer_account_id")
        # currency_id
        currency_id = ET.SubElement(record, "field")
        currency_id.set("name", "currency_id")
        currency_id.set("ref", "base." + self.currency_id.name)
        # transfer_account_id
        record = ET.SubElement(data, "record")
        record.set("id", "transfer_account_id")
        record.set("model", "account.account.template")
        chart_template_id = ET.SubElement(record, "field")
        chart_template_id.set("name", "chart_template_id")
        chart_template_id.set("ref", self.identifier)

        for account in self.env['account.account'].search_read([]):
            if account["code"] == self.transfer_account_id.code:
                continue
            record = ET.SubElement(data, "record")
            record.set("id", account["code"])
            record.set("model", "account.account.template")
            # code
            code = ET.SubElement(record, "field")
            code.set("name", "code")
            code.text = account["code"]
            # name
            name = ET.SubElement(record, "field")
            name.set("name", "name")
            name.text = account["name"]
            # user_type_id
            user_type_id = ET.SubElement(record, "field")
            user_type_id.set("name", "user_type_id")
            user_type_id.set("ref", self.env['ir.model.data'].search([
                ('res_id', '=', account["user_type_id"][0]),
                ('model', '=', 'account.account.type')
            ], limit=1).complete_name)
            #chart_template_id
            chart_template_id = ET.SubElement(record, "field")
            chart_template_id.set("name", "chart_template_id")
            chart_template_id.set("ref", self.identifier)
            # group_id
            group_id = ET.SubElement(record, "field")
            group_id.set("name", "group_id")
            group_id.set("ref", account["group_id"][1].split(" ")[0])
            # reconcile
            if account["reconcile"]:
                reconcile = ET.SubElement(record, "field")
                reconcile.set("name", "reconcile")
                reconcile.set("eval", str(account["reconcile"]))
        #endfor
        record = ET.SubElement(data, "record")
        record.set("id", self.identifier)
        record.set("model", "account.chart.template")
        # <field name="property_account_receivable_id" ref="cobrar"/>
        property_account_receivable_id = ET.SubElement(record, "field")
        property_account_receivable_id.set("name", "property_account_receivable_id")
        property_account_receivable_id.set("ref", self.property_account_receivable_id.code)
        #<field name="property_account_payable_id" ref="pagar"/>
        property_account_payable_id = ET.SubElement(record, "field")
        property_account_payable_id.set("name", "property_account_payable_id")
        property_account_payable_id.set("ref", self.property_account_payable_id.code)
        # <field name="property_account_expense_categ_id" ref="costos"/>
        property_account_expense_categ_id = ET.SubElement(record, "field")
        property_account_expense_categ_id.set("name", "property_account_expense_categ_id")
        property_account_expense_categ_id.set("ref", self.property_account_expense_categ_id.code)
        # <field name="property_account_income_categ_id" ref="ingresos"/>
        property_account_income_categ_id = ET.SubElement(record, "field")
        property_account_income_categ_id.set("name", "property_account_income_categ_id")
        property_account_income_categ_id.set("ref", self.property_account_income_categ_id.code)
        # <field name="use_anglo_saxon" eval="True"/>
        use_anglo_saxon = ET.SubElement(record, "field")
        use_anglo_saxon.set("name", "use_anglo_saxon")
        use_anglo_saxon.set("eval", str(self.use_anglo_saxon))
        # <field name="complete_tax_set" eval="False"/>
        complete_tax_set = ET.SubElement(record, "field")
        complete_tax_set.set("name", "complete_tax_set")
        complete_tax_set.set("eval", str(self.complete_tax_set))
        #<field name="property_stock_account_input_categ_id" ref="inventario_liquidar"/>
        property_stock_account_input_categ_id = ET.SubElement(record, "field")
        property_stock_account_input_categ_id.set("name", "property_stock_account_input_categ_id")
        property_stock_account_input_categ_id.set("ref", self.property_stock_account_input_categ_id.code)
        # <field name="property_stock_account_output_categ_id" ref="inventario_liquidar"/>
        property_stock_account_output_categ_id = ET.SubElement(record, "field")
        property_stock_account_output_categ_id.set("name", "property_stock_account_output_categ_id")
        property_stock_account_output_categ_id.set("ref", self.property_stock_account_output_categ_id.code)
        # <field name="property_stock_valuation_account_id" ref="inventario"/>
        property_stock_valuation_account_id = ET.SubElement(record, "field")
        property_stock_valuation_account_id.set("name", "property_stock_valuation_account_id")
        property_stock_valuation_account_id.set("ref", self.property_stock_valuation_account_id.code)

        return ET.tostring(root, pretty_print=True, xml_declaration=True, encoding='UTF-8').decode()

    def _default_currency(self):
        return self.env.ref("base.USD")
