import React from 'react';
import { Button } from '@material-ui/core';


export default class LogoutButton extends React.Component {
    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    componentDidMount(){
    }

    logout = async function(){
        const response = await fetch('/logout', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        var message = data.message;
        if(message === "Logged out")
            this.props.parentCallback("Logout");
        else if(message === "No session available")
            this.props.parentCallback("Logout");
    }

    render() {
        return(
            <Button color="inherit" onClick={() => {this.logout()}}>
              Wyloguj
            </Button>
        )
    }
}