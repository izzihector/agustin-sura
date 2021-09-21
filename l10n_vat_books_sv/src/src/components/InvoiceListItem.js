import React from 'react';

const InvoiceListItem = ({ id,  number, date, partner_id, amount_untaxed, amount_tax, amount_total} = {}) => (
	<tr>
		<td>{date}</td>
		<td>{number}</td>
		<td></td>
		<td>{partner_id[1]}</td>
		<td></td>
		<td>{amount_untaxed}</td>
		<td></td>
		<td></td>
		<td>{amount_tax}</td>
		<td></td>
		<td>{amount_total}</td>
	</tr>
);

export default InvoiceListItem;
