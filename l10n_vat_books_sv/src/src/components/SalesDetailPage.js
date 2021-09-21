import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {SingleDatePicker} from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

export default class SalesDetailPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            total_factura_comercial: 0,
            total_factura_consumidor_final: 0,
            total_factura_credito_fiscal: 0,
            total_venta: 0,
            total_tarjeta: 0,
            total_cheques: 0,
            total_anticipos: 0,
            total_vale: 0,
            total_comision: 0,
            total_gastos: 0,
            total_devoluciones: 0,
            total_ajuste: 0,
            venta_real: 0,
            efectivo: 0,
            createdAt: moment(),
            calendarFocused: false
        };
        this.onDateChange = this.onDateChange.bind(this);
        this.onFocusChange = this.onFocusChange.bind(this);
    }
    toggleActive(){
        const item = document.getElementById("sales-list-item");
        item.classList.toggle("active");
    }
    componentDidMount(){
        const breadcumb = document.getElementById("breadcumb-item");
        breadcumb.innerText = "Cierre de caja diario"
        this.toggleActive();
        axios.get('http://194.182.69.160/sales/sales-detail/', {
            params: {
                dbname: db_name,
                user: username,
                date: this.state.createdAt
            }
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            alert(error);
        });
    }
    componentWillUnmount(){
        this.toggleActive();
    }
    onDateChange(createdAt){
        this.setState(()=>({createdAt}),() => {
            axios.get('http://194.182.69.160/sales/sales-detail/', {
                params: {
                    dbname: db_name,
                    user: username,
                    date: this.state.createdAt
                }
            }).then((response) => {
                this.setState(() => ({
                    total_factura_comercial: 0,
                    total_factura_consumidor_final: 0,
                    total_factura_credito_fiscal: 0,
                    total_venta: 0,
                    total_tarjeta: 0,
                    total_cheques: 0,
                    total_anticipos: 0,
                    total_vale: 0,
                    total_comision: 0,
                    total_gastos: 0,
                    total_devoluciones: 0,
                    total_ajuste: 0,
                    venta_real: 0,
                    efectivo: 0
                }),() => {
                    
                    console.log(response.data);

                    // calculando por tipo de documento

                    response.data.by_journal.forEach((venta) => {
                        if(venta[1] == "Comprobante Credito Fiscal"){
                            this.setState(() => ({
                                total_factura_credito_fiscal: parseFloat(venta[2])
                            }),() => {
                                this.setState(() => ({
                                    total_venta: this.state.total_factura_comercial + this.state.total_factura_consumidor_final + this.state.total_factura_credito_fiscal
                                }));
                            });
                        }else if(venta[1] == "Factura comercial"){
                            this.setState(() => ({
                                total_factura_comercial: parseFloat(venta[2])
                            }), () => {
                                this.setState(() => ({
                                    total_venta: this.state.total_factura_comercial + this.state.total_factura_consumidor_final + this.state.total_factura_credito_fiscal
                                }))
                            });
                        }else if(venta[1] == "Factura Consumidor Final"){
                            this.setState(() => ({
                                total_factura_consumidor_final: parseFloat(venta[2])
                            }), () => {
                                this.setState(() => ({
                                    total_venta: this.state.total_factura_comercial + this.state.total_factura_consumidor_final + this.state.total_factura_credito_fiscal
                                }));
                            });
                        }else if(venta[1]=="Anulacion"){
                            this.setState(() =>({
                                total_devoluciones: Math.abs(venta[2])
                            }),() => {
                                this.setState(() => ({
                                    total_ajuste: this.state.total_tarjeta + this.state.total_cheques + this.state.total_anticipos + this.state.total_vale + this.state.total_comision + this.state.total_gastos + this.state.total_devoluciones, venta_real: this.state.total_venta + this.state.total_anticipos + this.state.total_comision,  efectivo: this.state.total_venta + this.state.total_anticipos - this.state.total_tarjeta - this.state.total_cheques - this.state.total_vale - this.state.total_comision - this.state.total_comision-this.state.total_gastos-this.state.total_devoluciones
                                }));
                            });
                        }
                    });
                });

                // calculando por método de pago, para hacer el ajuste
                // es decir calcular la venta real, y el efectivo
                response.data.by_payment_method.forEach((venta) => {
                    const metodo_de_pago = venta[1];
                    const total = parseFloat(venta[2]);
                    if(metodo_de_pago == "TARJETA DE CREDITO"){
                        this.setState(() => ({
                            total_tarjeta: total
                        }), () => {
                            this.setState(() => ({
                                total_ajuste: this.state.total_tarjeta + this.state.total_cheques + this.state.total_anticipos + this.state.total_vale + this.state.total_comision + this.state.total_gastos + this.state.total_devoluciones, venta_real: this.state.total_venta + this.state.total_anticipos + this.state.total_comision,  efectivo: this.state.total_venta + this.state.total_anticipos - this.state.total_tarjeta - this.state.total_cheques - this.state.total_vale - this.state.total_comision - this.state.total_comision-this.state.total_gastos-this.state.total_devoluciones
                            }));
                        });
                    }else if(metodo_de_pago == "Cheque"){
                        this.setState(() => ({
                            total_cheques: total
                        }),() => {
                            this.setState(() => ({
                                total_ajuste: this.state.total_tarjeta + this.state.total_cheques + this.state.total_anticipos + this.state.total_vale + this.state.total_comision + this.state.total_gastos + this.state.total_devoluciones, venta_real: this.state.total_venta + this.state.total_anticipos + this.state.total_comision,  efectivo: this.state.total_venta + this.state.total_anticipos - this.state.total_tarjeta - this.state.total_cheques - this.state.total_vale - this.state.total_comision - this.state.total_comision-this.state.total_gastos-this.state.total_devoluciones
                            }));
                        });
                    }else if(metodo_de_pago=="VALE"){
                        this.setState(() => ({
                            total_vale: total
                        }),() => {
                            this.setState(() => ({
                                total_ajuste: this.state.total_tarjeta + this.state.total_cheques + this.state.total_anticipos + this.state.total_vale + this.state.total_comision + this.state.total_gastos + this.state.total_devoluciones, venta_real: this.state.total_venta + this.state.total_anticipos + this.state.total_comision,  efectivo: this.state.total_venta + this.state.total_anticipos - this.state.total_tarjeta - this.state.total_cheques - this.state.total_vale - this.state.total_comision - this.state.total_comision-this.state.total_gastos-this.state.total_devoluciones
                            }));
                        });
                    }else if(metodo_de_pago=="Comisiones"){
                        this.setState(() => ({
                            total_comision: total
                        }),() => {
                            this.setState(() => ({
                                total_ajuste: this.state.total_tarjeta + this.state.total_cheques + this.state.total_anticipos + this.state.total_vale + this.state.total_comision + this.state.total_gastos + this.state.total_devoluciones, venta_real: this.state.total_venta + this.state.total_anticipos + this.state.total_comision,  efectivo: this.state.total_venta + this.state.total_anticipos - this.state.total_tarjeta - this.state.total_cheques - this.state.total_vale - this.state.total_comision - this.state.total_comision-this.state.total_gastos-this.state.total_devoluciones
                            }));
                        });
                    }
                });

                // añadiendo el total de gastos
                const total_gastos = parseFloat(response.data.expenses_total[0][0]) || 0;
                this.setState(() => ({
                    total_gastos
                }), () => {
                    this.setState(() => ({
                        total_ajuste: this.state.total_tarjeta + this.state.total_cheques + this.state.total_anticipos + this.state.total_vale + this.state.total_comision + this.state.total_gastos + this.state.total_devoluciones, venta_real: this.state.total_venta + this.state.total_anticipos + this.state.total_comision,  efectivo: this.state.total_venta + this.state.total_anticipos - this.state.total_tarjeta - this.state.total_cheques - this.state.total_vale - this.state.total_comision - this.state.total_comision-this.state.total_gastos-this.state.total_devoluciones
                    }));
                });
            }).catch((error) => {
                alert(error);
            });
        });
    }
    onFocusChange({focused}){
        this.setState(() => ({
            calendarFocused: focused
        }));
        
    }
    render(){
        return(
            <div>
                <form>
                    <SingleDatePicker
                        date={this.state.createdAt}
                        onDateChange={this.onDateChange}
                        focused={this.state.calendarFocused}
                        onFocusChange={this.onFocusChange}
                        numberOfMonths={1}
                        isOutsideRange={() => false}
                    />
                    <button className="btn btn-success">Generar</button>
                </form>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>CONCEPTO</th>
                            <th>VALOR</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>FACTURA COMERCIAL</td>
                            <td>${this.state.total_factura_comercial.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>FACTURA CONSUMIDOR FINAL</td>
                            <td>${this.state.total_factura_consumidor_final.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>FACTURA CREDITO FISCAL</td>
                            <td>${this.state.total_factura_credito_fiscal.toFixed(2)}</td>
                        </tr>
                        <tr className="table-info">
                            <td>TOTAL VENTA</td>
                            <td>${this.state.total_venta.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>TARJETA DE CREDITO/DEBITO</td>
                            <td>${this.state.total_tarjeta.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>CHEQUES</td>
                            <td>${this.state.total_cheques.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>ANTICIPOS</td>
                            <td>${this.state.total_anticipos.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>LIQ. DE ANTICIPOS/VALE</td>
                            <td>${this.state.total_vale.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>COMISION</td>
                            <td>${this.state.total_comision.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>GASTOS</td>
                            <td>${this.state.total_gastos.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>DEVOLUCIONES</td>
                            <td>${this.state.total_devoluciones.toFixed(2)}</td>
                        </tr>
                        <tr className="table-info">
                            <td>SUB-TOTAL</td>
                            <td>${this.state.total_ajuste.toFixed(2)}</td>
                        </tr>
                        <tr className="table-info" style={{
                            color: "red"
                        }}>
                            <td><strong>VENTA REAL</strong></td>
                            <td><strong>${this.state.venta_real.toFixed(2)}</strong></td>
                        </tr>
                        <tr className="bg-primary" style={{
                            color: "white"
                        }}>
                            <td>EFECTIVO</td>
                            <td>${this.state.efectivo.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
                
            </div>
        );
    }
}