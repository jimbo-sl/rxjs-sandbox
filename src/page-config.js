import Home from "./pages/home/Home";
import SwitchMap from "./pages/switchMap/SwitchMap";

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
        component: <h1>Merge Map</h1>,
        navOrder: 3,
        routeOrder: 2
    }, 
    exhaustMap: {
        name: 'exhaustMap',
        url: '/exhaustMap',
        component: <h1>Exhaust Map</h1>,
        navOrder: 4,
        routeOrder: 3
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
