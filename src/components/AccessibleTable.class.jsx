import React from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class AccessibleTable extends React.Component {

    constructor (props) {
        super(props);
        this.columns = props.columns;
        this.labels = props.labels;
        this.rows = props.rows;
    }

    getLabel (col) {
        return (this.labels.hasOwnProperty(col)) ?
            this.labels[col] : col;
    }

    getValue (row, col) {
        return (row.hasOwnProperty(col)) ?
            row[col] : "NA";
    }

    createCell (row, col, i) {
        console.log(i.toString() + "-" + col.toString(), ":", this.getValue(row, col));
        return (col.toString == "name") ?
            <TableCell key={i.toString() + "-" + col.toString()} component="th" scope="row">{this.getValue(row, col)}</TableCell> :
            <TableCell key={i.toString() + "-" + col.toString()} align="right">{this.getValue(row, col)}</TableCell>
    }

    createRowKey (row, col, i) {
        return (row.hasOwnProperty(col)) ?
            i.toString() + "-" + row[col] : i.toString();
    }

    render () {
        return (
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="caption table">
                    <caption>A basic table example with a caption</caption>
                    <TableHead>
                        <TableRow>
                            {this.columns.map((col) =>
                                (col.toString == "name") ?
                                <TableCell key={col.toString()}>{this.getLabel(col)}</TableCell> :
                                <TableCell align="right" key={col.toString()}>{this.getLabel(col)}</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.rows.map((row, i, a) => (
                            // <TableRow>
                            <TableRow key={this.createRowKey(row, this.columns[0], i)}>
                                {this.columns.map((col) =>
                                    this.createCell(row, col, i)
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

export default AccessibleTable;
