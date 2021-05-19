import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import Page from './Page';
import pageConfig from './page-config';

function App() {
  return (
    <BrowserRouter>
      <Page>
        <Switch>
          {
            Object.values(pageConfig)
              .sort((a, b) => a.routeOrder - b.routeOrder)
              .map(page => <Route key={page.name} path={page.url}>{page.component}</Route>)
          }
        </Switch>
      </Page>
    </BrowserRouter>
  );
}

export default App;
