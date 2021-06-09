import { useCallback, useEffect, useState } from 'react';
import StocksDisplay from './StocksDisplay';
import stockFeedService from './services/stock-feed-service';

function Stocks() {
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        const sub = stockFeedService.getFeed$()
            .subscribe({
                next: setStocks,
                error: console.log
            });

        return () => {
            sub.unsubscribe();
            stockFeedService.closeConnection();
        }

    }, [])

    const onAddToFeed = useCallback(stock => {
        stockFeedService.subscribeToStock(stock);
    }, [])

    const onRemoveFromFeed = useCallback(stock => {
        stockFeedService.unsubscribeFromStock(stock);
    }, [])

    return (
        <StocksDisplay stocks={stocks} onAddToFeed={onAddToFeed} onRemoveFromFeed={onRemoveFromFeed} />
    )
}

export default Stocks
