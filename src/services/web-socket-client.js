import { webSocket } from "rxjs/webSocket";

export const socketWrapper = {
    socket$: url => {
        console.log('socketWrapper.socket$')
        return webSocket(url)
    }
}