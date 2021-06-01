import React from 'react';
import { Box } from '@material-ui/core';
import { withTranslation } from "react-i18next";
import BestStatistics from './bestStatistics.js';


class MainPage extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
    }


    render() {
        console.log(this.props);
        const { t } = this.props;
        return (
            <Box>
                <Box>
                    <h1>{t('Welcome')}</h1>
                    <h2>{t('ChooseModule')}</h2>
                </Box>
                {
                    (this.props.user.staff_status === 2) ?
                    (
                    <BestStatistics>

                    </BestStatistics>
                    ) :
                    false
                }
            </Box>
        )
    }
}
export default withTranslation()(MainPage);