import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Tooltip } from '@material-ui/core';
import { lightBlue, grey } from '@material-ui/core/colors';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import AddIcon from '@material-ui/icons/Add';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SettingsIcon from '@material-ui/icons/Settings';
import i18n from '../../i18n';
import { withTranslation } from 'react-i18next';

//Tabela kursow, do ktorych mozemy stworzyc ankiety
class CoursesTable extends React.Component {
    constructor(props) {
        super(props);

        this.renderTableRows = this.renderTableRows.bind(this);
        this.onChosen = this.onChosen.bind(this);
    }

    onChosen(course) {
        this.props.parentCallback(course);
    }

    componentDidMount() {
    }

    renderTableRows() {
        return this.props.data.map(function (row, index) {
            const { course_name, term_id, course_id, class_type_id, course_unit_id } = row;
            return (
                <TableRow key={course_unit_id}>
                    <TableCell component="th" scope="row">
                        {course_id}
                    </TableCell>
                    <TableCell>{course_name[i18n.language] + " ["+class_type_id+"]"}</TableCell>
                    <TableCell>{term_id}</TableCell>
                    <TableCell>
                        <Tooltip title="Dodaj ankietę" aria-label="fill-out-survey">
                            <IconButton color="primary" aria-label="choose-course" onClick={() => { this.onChosen(row) }}
                            style={{color: lightBlue[600], background: grey[200]}}>
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                    </TableCell>
                </TableRow>
            )
        }, this)
    }


    render() {
        const { t } = this.props;
        return (
            <Box>
                <TableContainer component={Paper}>
                    <Table aria-label="courses-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('Code')}</TableCell>
                                <TableCell>{t('Class')}</TableCell>
                                <TableCell>{t('Semester')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.renderTableRows()
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        )
    }
}
export default withTranslation()(CoursesTable);