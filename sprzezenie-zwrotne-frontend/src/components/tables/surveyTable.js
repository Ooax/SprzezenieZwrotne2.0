import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Tooltip } from '@material-ui/core';
import { lightBlue, grey } from '@material-ui/core/colors';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import AddIcon from '@material-ui/icons/Add';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import InfoIcon from '@material-ui/icons/Info'
import SettingsIcon from '@material-ui/icons/Settings';
import i18n from '../../i18n';
import { withTranslation } from 'react-i18next';

//Tabela ankiet
class SurveysTable extends React.Component {
    constructor(props) {
        super(props);

        this.renderTableRows = this.renderTableRows.bind(this);
        this.onChosen = this.onChosen.bind(this);
        this.onChosenCourse = this.onChosenCourse.bind(this);
    }

    onChosen(event, survey) {
        this.props.parentCallback(survey);
    }
    onChosenCourse(surveyId, button) {
        this.props.parentCallback2(surveyId, button);
    }

    componentDidMount() {
    }

    renderTableRows() {
        return this.props.data.map(function (row, index) {
            const { courseInfo, lecturer } = row;
            return (
                <TableRow key={"row_"+index}>
                    <TableCell component="th" scope="row">
                        {courseInfo.courseId}
                    </TableCell>
                    <TableCell>{courseInfo.courseName[i18n.language] + " " + courseInfo.termId + " [" + courseInfo.classType + "] "}</TableCell>
                    <TableCell>{lecturer.first_name + " " + lecturer.last_name}</TableCell>
                    <TableCell>

                            <IconButton aria-label="fillOut-survey" onClick={(event) => { this.onChosen(event, row) }} style={{color: lightBlue[600], background: grey[200]}}>
                                <QuestionAnswerIcon />
                            </IconButton>
                            <IconButton color="primary" aria-label="info-choose-survey" onClick={() => { this.onChosenCourse(courseInfo.courseId, "info") }} style={{color: lightBlue[600], background: grey[200], marginLeft: 10}}>
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
                <TableContainer component={Paper}>
                    <Table aria-label="surveys-table">
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
        )
    }
}
export default withTranslation()(SurveysTable);