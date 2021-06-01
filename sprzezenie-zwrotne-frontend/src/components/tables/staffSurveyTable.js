import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Tooltip } from '@material-ui/core';
import { lightBlue, grey } from '@material-ui/core/colors';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import AddIcon from '@material-ui/icons/Add';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SettingsIcon from '@material-ui/icons/Settings';
import i18n from '../../i18n';
import { withTranslation } from 'react-i18next';

//Tabela ankiet pracownika
class StaffSurveysTable extends React.Component {
    constructor(props) {
        super(props);

        this.renderTableRows = this.renderTableRows.bind(this);
        this.onChosen = this.onChosen.bind(this);
    }

    onChosen(event, survey, button) {
        this.props.parentCallback(survey, button);
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
                    <TableCell>{courseInfo.courseName[i18n.language] + " " + courseInfo.termId}</TableCell>
                    <TableCell>{" [" + courseInfo.classType + "] "}</TableCell>
                    <TableCell>
                            {
                                ((this.props.buttons)
                                    ?
                                    (
                                        (this.props.buttons.settings)
                                            ?
                                            (
                                                <Tooltip title="Ustawienia">
                                                    <IconButton aria-label="settings-survey" onClick={(event) => { this.onChosen(event, row, "settings") }}
                                                    style={{color: lightBlue[600], background: grey[200]}}>
                                                        <SettingsIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )
                                            :
                                            false
                                    )
                                    :
                                    false)
                            }
                            {
                                ((this.props.buttons)
                                    ?
                                    (
                                        (this.props.buttons.statistics)
                                            ?
                                            (
                                                <Tooltip title="Statystyki">
                                                    <IconButton aria-label="statistics-survey" onClick={(event) => { this.onChosen(event, row, "statistics") }}
                                                    style={{color: lightBlue[600], background: grey[200]}}>
                                                        <EqualizerIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )
                                            :
                                            false
                                    )
                                    :
                                    false)
                            }
                        
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
                                <TableCell>{t('TypeOfClasses')}</TableCell>
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
export default withTranslation()(StaffSurveysTable);