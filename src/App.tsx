import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import logo from './logo.svg';
import './App.css';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

import HomePage from "./components/pages/HomePage";
import RankPage from "./components/pages/ranks";

function App() {
  const prefersDarkMode = true; // useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
        <Route path="/" component={HomePage} exact />
        <Route path="/ranks" component={RankPage} exact />
        </Switch>
      </ Router>
    </ ThemeProvider>
  );
}

export default App;
