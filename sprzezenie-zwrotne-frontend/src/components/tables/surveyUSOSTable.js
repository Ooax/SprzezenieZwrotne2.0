import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box } from '@material-ui/core';
import { lightBlue, grey } from '@material-ui/core/colors';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import i18n from '../../i18n';
import { withTranslation } from 'react-i18next';
import InfoIcon from '@material-ui/icons/Info';

//Tabela ankiet USOS
class SurveysUSOSTable extends React.Component {
    constructor(props) {
        super(props);

        this.renderTableRows = this.renderTableRows.bind(this);
        this.onChosen = this.onChosen.bind(this);
    }

    onChosen(surveyId, button) {
        this.props.parentCallback(surveyId, button);
    }

    componentDidMount() {
    }     

    renderTableRows() {
        return this.props.data.map(function (row, index) {
            const { id, course_info, lecturer } = row;
            return (
                <TableRow key={id}>
                    <TableCell component="th" scope="row">
                        {course_info.course_id}
                    </TableCell>
                    <TableCell>{course_info.course_name[i18n.language] + " " + course_info.term_id + " [" + course_info.classtype_id + "] "}</TableCell>
                    <TableCell>{lecturer.first_name + " " + lecturer.last_name}</TableCell>
                    <TableCell>
                        <IconButton color="primary" aria-label="choose-survey" onClick={() => { this.onChosen(id, "answer") }} style={{color: lightBlue[600], background: grey[200]}}>
                            <QuestionAnswerIcon />
                        </IconButton>
                        <IconButton color="primary" aria-label="info-choose-survey" onClick={() => { this.onChosen(course_info.course_id, "info") }} style={{color: lightBlue[600], background: grey[200], marginLeft: 10}}>
                            <InfoIcon/>
                        </IconButton>
                    </TableCell>
                </TableRow>
            )
        }, this)
    }


    render() {
        const { t } = this.props;
        return (
            <Box display="block">
                <Box mb={3}>
                    <Typography variant="h4">
                        {t('SurveysToFill')}
                    </Typography>
                </Box>
                <Box>
                    <TableContainer component={Paper}>
                        <Table aria-label="usos-surveys-table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('Code')}</TableCell>
                                    <TableCell>{t('Class')}</TableCell>
                                    <TableCell>{t('Instructor')}</TableCell>
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
            </Box>
        )
    }
}
export default withTranslation()(SurveysUSOSTable);