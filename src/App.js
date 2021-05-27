import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import Page from './Page';
import routes from './routes';

function App() {
  return (
    <BrowserRouter>
      <Page>
        <Switch>
          {
            routes
              .sort((a, b) => a.routeOrder - b.routeOrder)
              .map(page => <Route key={page.name} path={page.url}>{page.component}</Route>)
          }
        </Switch>
      </Page>
    </BrowserRouter>
  );
}

export default App;
