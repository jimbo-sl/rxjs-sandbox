import Home from "./pages/home/Home";
import SwitchMap from "./pages/operators/switchMap/SwitchMap";
import MergeMap from "./pages/operators/mergeMap/MergeMap";
import ExhaustMap from "./pages/operators/exhaustMap/ExhaustMap";
import Share from "./pages/operators/share/Share";
import WebSocket from "./pages/demos/stocks/Stocks";
import ConcatMap from "./pages/operators/concatMap/ConcatMap";

const routes = [
    {
        name: 'switchMap',
        url: '/switchMap',
        component: <SwitchMap />,
        navOrder: 2,
        routeOrder: 1,
        category: 'Operators'
    }, 
    {
        name: 'mergeMap',
        url: '/mergeMap',
        component: <MergeMap />,
        navOrder: 3,
        routeOrder: 2,
        category: 'Operators'
    }, 
    {
        name: 'exhaustMap',
        url: '/exhaustMap',
        component: <ExhaustMap />,
        navOrder: 4,
        routeOrder: 3,
        category: 'Operators'
    },
    {
        name: 'concatMap',
        url: '/concatMap',
        component: <ConcatMap />,
        navOrder: 5,
        routeOrder: 4,
        category: 'Operators'
    },
    {
        name: 'share',
        url: '/share',
        component: <Share />,
        navOrder: 6,
        routeOrder: 5,
        category: 'Operators'
    },
    {
        name: 'stocks',
        url: '/stocks',
        component: <WebSocket />,
        navOrder: 7,
        routeOrder: 6,
        category: 'Demos'
    },
    {
        name: 'Home',
        url: '/',
        component: <Home />,
        navOrder: 1,
        routeOrder: 99
    }
];

export default routes;
