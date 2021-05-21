import Home from "./pages/home/Home";
import SwitchMap from "./pages/switchMap/SwitchMap";
import MergeMap from "./pages/mergeMap/MergeMap";
import ExhaustMap from "./pages/exhaustMap/ExhaustMap";
import ConcatMap from "./pages/concatMap/ConcatMap";
import Share from "./pages/share/Share";

const config = {    
    switchMap: {
        name: 'switchMap',
        url: '/switchMap',
        component: <SwitchMap />,
        navOrder: 2,
        routeOrder: 1
    }, 
    mergeMap: {
        name: 'mergeMap',
        url: '/mergeMap',
        component: <MergeMap />,
        navOrder: 3,
        routeOrder: 2
    }, 
    exhaustMap: {
        name: 'exhaustMap',
        url: '/exhaustMap',
        component: <ExhaustMap />,
        navOrder: 4,
        routeOrder: 3
    },
    concatMap: {
        name: 'concatMap',
        url: '/concatMap',
        component: <ConcatMap />,
        navOrder: 5,
        routeOrder: 4
    },
    share: {
        name: 'share',
        url: '/share',
        component: <Share />,
        navOrder: 6,
        routeOrder: 5
    },
    home: {
        name: 'Home',
        url: '/',
        component: <Home />,
        navOrder: 1,
        routeOrder: 99
    },
};

export default config;
