import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { withTranslation } from "react-i18next";

//Zarzadzanie szuflada
class DrawerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chosenDrawer: "Main",
        }

        this.onChosen = this.onChosen.bind(this);
        this.renderMainDrawer=this.renderMainDrawer.bind(this);
        this.renderSurveysDrawer=this.renderSurveysDrawer.bind(this);
    }

    onChosen(event, moduleName, moduleDrawerName) {
        if(moduleDrawerName)
            this.setState({chosenDrawer: moduleDrawerName});
        if(moduleName)
            this.props.parentCallback(moduleName);
        event.preventDefault();
    }

    componentDidMount(){
    }


    renderMainDrawer(){
        const { t } = this.props;
        return (
            <List>
                <ListItem button key="drawer_item_survey" onClick = {(event) => { this.onChosen(event, null, "Surveys") }}>
                    <ListItemText primary={t('Surveys')} />
                </ListItem>
                <ListItem button key="drawer_item_usosSurvey" onClick = {(event) => { this.onChosen(event, null, "SurveysUSOS") }}>
                    <ListItemText primary={t('USOSSurveys')} />
                </ListItem>
            </List>
        )
    }

    renderSurveysDrawer(){
        const { t } = this.props;
        return (
            <List>
                <ListItem button key="drawer_item_back" onClick = {(event) => { this.onChosen(event, null, "Main")}} >
                    <ListItemIcon>
                        <ArrowBackIcon />
                    </ListItemIcon>
                </ListItem>
                {
                    (this.props.data.student_status === 2) ?
                        (<ListItem button key="drawer_item_availableSurveys" onClick={(event) => { this.onChosen(event, "GetSurveys", "Surveys") }} >
                            <ListItemText primary={t('AvailableSurveys')} />
                        </ListItem>) :
                        false
                }
                {
                    (this.props.data.staff_status === 2) ?
                        (<ListItem button key="drawer_item_usos_addSurvey" onClick={(event) => { this.onChosen(event, "AddSurvey", "Surveys") }} >
                            <ListItemText primary={t('AddSurvey')} />
                        </ListItem>) :
                        false
                }
                {
                    //Zmienic na staff_status
                    (this.props.data.staff_status === 2) ?
                        (<ListItem button key="drawer_item_manageSurveys" onClick={(event) => { this.onChosen(event, "ManageSurveys", "Surveys") }} >
                            <ListItemText primary={t('ManageSurveys')} />
                        </ListItem>) :
                        false
                }
            </List>
        )
    }

    renderSurveysUSOSDrawer(){
        const { t } = this.props;
        return (
            <List>
                <ListItem button key="drawer_item_back" onClick = {(event) => { this.onChosen(event, null, "Main")}}>
                    <ListItemIcon>
                        <ArrowBackIcon />
                    </ListItemIcon>
                </ListItem>
                {
                    (this.props.data.student_status === 2)?
                    (<ListItem button key="drawer_item_usosAvailableSurveys" onClick = {(event) => { this.onChosen(event, "GetUSOSSurveys", "SurveysUSOS")}}>
                        <ListItemText primary={t('SubjectSurveys')} />
                    </ListItem>):
                    false
                }
            </List>
        )
    }

    render() {
        if(this.state.chosenDrawer === "Main")
            return this.renderMainDrawer();
        else if(this.state.chosenDrawer === "Surveys")
            return this.renderSurveysDrawer();
        else if(this.state.chosenDrawer === "SurveysUSOS")
            return this.renderSurveysUSOSDrawer();
    }
}
export default withTranslation()(DrawerList);