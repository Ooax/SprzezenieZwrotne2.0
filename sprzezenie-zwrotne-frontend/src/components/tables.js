import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Tooltip } from '@material-ui/core';
import { lightBlue, grey } from '@material-ui/core/colors';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import AddIcon from '@material-ui/icons/Add';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SettingsIcon from '@material-ui/icons/Settings';
import i18n from '../i18n';

//Tabela ankiet USOS
export class SurveysUSOSTable extends React.Component {
    constructor(props) {
        super(props);

        this.renderTableRows = this.renderTableRows.bind(this);
        this.onChosen = this.onChosen.bind(this);
    }

    onChosen(surveyId) {
        this.props.parentCallback(surveyId);
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
                        <IconButton color="primary" aria-label="choose-survey" onClick={() => { this.onChosen(id) }} style={{color: lightBlue[600], background: grey[200]}}>
                            <QuestionAnswerIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            )
        }, this)
    }


    render() {
        return (
            <Box display="block">
                <Box mb={3}>
                    <Typography variant="h4">
                        Ankiety, które można wypełnić:
                    </Typography>
                </Box>
                <Box>
                    <TableContainer component={Paper}>
                        <Table aria-label="usos-surveys-table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Kod</TableCell>
                                    <TableCell>Przedmiot</TableCell>
                                    <TableCell>Prowadzący</TableCell>
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




//Tabela ankiet
export class SurveysTable extends React.Component {
    constructor(props) {
        super(props);

        this.renderTableRows = this.renderTableRows.bind(this);
        this.onChosen = this.onChosen.bind(this);
    }

    onChosen(event, survey) {
        this.props.parentCallback(survey);
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

                        <Tooltip title="Wypełnij ankietę">
                            <IconButton aria-label="fillOut-survey" onClick={(event) => { this.onChosen(event, row) }} style={{color: lightBlue[600], background: grey[200]}}>
                                <QuestionAnswerIcon />
                            </IconButton>
                        </Tooltip>
                    </TableCell>
                </TableRow>
            )
        }, this)
    }


    render() {
        return (
            <Box display="block">
                <TableContainer component={Paper}>
                    <Table aria-label="surveys-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Kod</TableCell>
                                <TableCell>Przedmiot</TableCell>
                                <TableCell>Prowadzący</TableCell>
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

//Tabela ankiet pracownika
export class StaffSurveysTable extends React.Component {
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
        return (
            <Box display="block">
                <TableContainer component={Paper}>
                    <Table aria-label="surveys-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Kod</TableCell>
                                <TableCell>Przedmiot</TableCell>
                                <TableCell>Rodzaj zajęć</TableCell>
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

//Tabela kursow, do ktorych mozemy stworzyc ankiety
export class CoursesTable extends React.Component {
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
        return (
            <Box>
                <TableContainer component={Paper}>
                    <Table aria-label="courses-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Kod</TableCell>
                                <TableCell>Przedmiot</TableCell>
                                <TableCell>Semestr</TableCell>
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


//Tabela komentarzy z odpowiedzi do ankiet
export class SurveyCommentsTable extends React.Component {
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
        return (
            <Box>
                <TableContainer component={Paper}>
                    <Table aria-label="comments-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Box fontWeight="fontWeightBold">
                                        Komentarze do ankiety:
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


