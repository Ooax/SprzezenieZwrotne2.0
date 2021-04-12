import React, { useState } from 'react';
import { CssBaseline, AppBar, Toolbar, Drawer, Button, Select, FormControl, MenuItem, Typography, InputLabel } from '@material-ui/core';
import DrawerList from "./components/drawer-list"
import { makeStyles } from '@material-ui/core/styles';
import MainView from './components/mainView';
import LogoutButton from './components/logout';
import i18n from "./i18n";
import { useTranslation } from "react-i18next";

const drawerWidth = 200;


const styles = makeStyles((theme) => ({
  div: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: "12%",
    minWidth: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: "12%",
    minWidth: drawerWidth
  },
  drawerContainer: {
    overflow: 'auto',
  },
  main: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));




function App() {
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  }
  const {t, i18n} = useTranslation('translations');
  const classStyles = styles();
  const [selectedModule, setSelectedModule] = useState("Main");
  const [userData, setUserData] = useState(
    {
      id: null,
      first_name: null,
      middle_names: null,
      last_name: null,
      sex: null,
      student_status: null,
      staff_status: null,
      term: null
    });

  //Jednokrotne pobranie danych z sesji uzytkownika, ktore zarazem sprawdza czy sesja byla uwierzytelniona
  React.useEffect(() => {
    async function fetchUserData() {
      const response = await fetch('/getUserInfo', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const userInfo = await response.json();
      if (userInfo.id) {
        setUserData(userInfo);
      }
    }
    fetchUserData();
  }, [])

  //Strona w 2 wersjach - przed i po zalogowaniu
  if (userData ? userData.id : false) {
    return (
      <div className={classStyles.div}>
        <CssBaseline />
        <AppBar position="fixed" className={classStyles.appBar} >
          <Toolbar>
            <Typography variant="h6" className={classStyles.title}>
              {t('Title')}
            </Typography>
            <FormControl variant="outlined">
            <InputLabel id="select-language-label"></InputLabel>
            <Select labelId="select-language-label" id="select-language" onChange={(event) => changeLanguage(event.target.value)} style={{width: '200px', color: "white"}}>
                <MenuItem value="pl">polski</MenuItem>
                <MenuItem value="en">english</MenuItem>
            </Select>
            </FormControl>
            <LogoutButton parentCallback={(command) => { if (command === "Logout") setUserData(null) }} />
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" className={classStyles.drawer} classes={{ paper: classStyles.drawerPaper }}>
          <Toolbar />
          <div className={classStyles.drawerContainer}>
            <DrawerList data={userData} parentCallback={(chosenModule) => { if (chosenModule) setSelectedModule(chosenModule) }} />
          </div>
        </Drawer>
        <main className={classStyles.main}>
          <Toolbar />
          <MainView data={selectedModule} />
        </main>
      </div>
    )
  }
  else {
    return (
      <div className={classStyles.div}>
        <CssBaseline />
        <AppBar position="fixed" className={classStyles.appBar} >
          <Toolbar>
            <Typography variant="h6" className={classStyles.title}>
              System ankiet
            </Typography>
            <Button color="inherit" href="http://localhost:5000/login" target="_self" onClick={(event) => event.preventDefault}>
              Zaloguj
            </Button>
          </Toolbar>
        </AppBar>
        <main className={classStyles.main}>
          <Toolbar />
        </main>
      </div>
    )
  }
}

// function ChooseLanguage(e) {
//   //alert(document.getElementById('select-language').value);
//   language = e.target.value;
//   alert(language);
//   //alert(language);
//   //document.getElementById('select-language').addEventListener('change', function() {
//     //console.log('You selected: ', this.value);
//   //});
// }
export default App;
