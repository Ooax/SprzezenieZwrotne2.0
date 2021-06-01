import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Tooltip } from '@material-ui/core';
import { lightBlue, grey } from '@material-ui/core/colors';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import AddIcon from '@material-ui/icons/Add';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SettingsIcon from '@material-ui/icons/Settings';
import i18n from '../../i18n';
import { withTranslation } from 'react-i18next';

//Tabela komentarzy z odpowiedzi do ankiet
class SurveyCommentsTable extends React.Component {
    constructor(props) {
        super(props);

        this.renderTableRows = this.renderTableRows.bind(this);
    }

    componentDidMount() {
    }

    renderTableRows() {
        return this.props.data.map(function (comment, index) {
            return (
                <TableRow key={"comment_"+index}>
                    <TableCell component="th" scope="row">
                        {comment}
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
                    <Table aria-label="comments-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Box fontWeight="fontWeightBold">
                                        {t('CommentsForSurvey')}
                                    </Box>
                                </TableCell>
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
export default withTranslation()(SurveyCommentsTable);