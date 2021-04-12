import React from 'react';
import { withTranslation } from "react-i18next";


class MainPage extends React.Component {

    componentDidMount(){
    }


    render() {
        const { t } = this.props;
        return (
            <div>
                <h1>{t('Welcome')}</h1>
                <h2>{t('ChooseModule')}</h2>
            </div>
        )
    }
}
export default withTranslation()(MainPage);