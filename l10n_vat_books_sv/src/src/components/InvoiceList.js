import React from 'react';
import axios from 'axios';
import moment from 'moment';
import InvoiceListItem from './InvoiceListItem';
import Swal from 'sweetalert2';

export default class Invoices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoices: [],
            year: moment().year(),
            month: moment().month()
        };
        this.onMonthChange = this.onMonthChange.bind(this);
        this.onYearChange = this.onYearChange.bind(this);
        this.handleGenerateReportClick = this.handleGenerateReportClick.bind(this);
    }
    onMonthChange(event) {
        this.setState({
            month: event.target.value
        });
    }
    onYearChange(event) {
        this.setState({
            year: event.target.value
        });
    }
    async handleGenerateReportClick() {
		Swal.fire({
        	title: "Generando reporte",
    	});
		console.log("Generando reporte");
		Swal.showLoading();
        axios.post(this.props.report_url, {
            year: this.state.year,
            month: this.state.month,
            journal_id: this.props.journal_id,
            title: this.props.report_title,
            customer_sales: this.props.customer_sales,
            db_name,
            username
        }, {
                responseType: 'blob'
            }
        ).then(response => {
            let a = document.createElement('a');
            let url = window.URL.createObjectURL(response.data);
            a.href = url;
            a.download = `reporte_${this.state.month + 1}_${this.state.year}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
			Swal.close();
        }).catch(function(e){
			Swal.close();
			Swal.fire('Error al generar el reporte', e, 'error');
		});
    }
    async componentDidMount() {
        const response = await axios.get(`http://${window.location.hostname}/api/invoice/?db_name=${db_name}&username=${username}`);
        const { invoices } = response.data;
        this.setState({
            invoices
        });
    }
    render() {
        return (
            <div>
                <div id="filters">
                    <form className="form-inline">
                        <div className="form-group mb-2">
                            <label for="date">Fecha</label>
                            <select className="form-control" name="date" onChange={this.onMonthChange} value={this.state.month}>
                                <option value={"0"}>Enero</option>
                                <option value={"1"}>Febrero</option>
                                <option value={"2"}>Marzo</option>
                                <option value={"3"}>Abril</option>
                                <option value={"4"}>Mayo</option>
                                <option value={"5"}>Junio</option>
                                <option value={"6"}>Julio</option>
                                <option value={"7"}>Agosto</option>
                                <option value={"8"}>Septiembre</option>
                                <option value={"9"}>Octubre</option>
                                <option value={"10"}>Noviembre</option>
                                <option value={"11"}>Diciembre</option>
                            </select>
                        </div>
                        <div className="form-group mb-2">
                            <label for="year">Año</label>
                            <input className="form-control" name="year" onChange={this.onYearChange} type={"number"} value={this.state.year} />
                            <button className="btn btn-success" onClick={this.handleGenerateReportClick} type={"button"}>
                                <i className="fas fa-fw fa-file-pdf"></i>
                                Generar
                            </button>
                        </div>
                    </form>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered" id="dataTable" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Número</th>
                                    <th>Registro</th>
                                    <th>Nombre del Cliente</th>
                                    <th>Exentas</th>
                                    <th>Gravadas</th>
                                    <th>Venta</th>
                                    <th>Debito fiscal</th>
                                    <th>Total débito</th>
                                    <th>IVA retenido</th>
                                    <th>Ventas totales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.invoices.map((invoice, index) => {
                                    if (this.props.journal_id == invoice.journal_id[0]
                                        && moment(invoice.date).month() == this.state.month
                                        && moment(invoice.date).year() == this.state.year
                                    ) {

                                        return (
                                            <InvoiceListItem key={index} {...invoice} />
                                        );
                                    }
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
