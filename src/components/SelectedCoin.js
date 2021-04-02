import React from 'react'
import './Coin.css'

function SelectedCoin({image, name, price, symbol, volume, priceChange, marketcap, setId, id, setSym}) {
    const handleSelect = () => {
        setId(id)
        setSym(symbol)
    }

    return (
        <div className='coin-container' style={styles}>
            <div className="coin-row"style={styles}>
                <div className="coin"style={styles}>
                    <img src={image} style={styles}alt="cryipto-currency"/>
                    <h1 style={styles}>{name}</h1>
                    <p className="coin_symbol"style={styles}>{symbol}</p>
                </div>
                <div className="coin-data"style={styles}>
                    <p className="coin-price"style={styles}>£{price}</p>
                    <p className="coin-volume"style={styles}>£{volume.toLocaleString()}</p>
                    {priceChange < 0 ? (
                        <p className='coin-percent red' style={{backgroundColor: '#196FB1'}}>{priceChange.toFixed(2)}%</p>
                    ) : <p className='coin-percent green' style={{backgroundColor: '#196FB1' }}>{priceChange.toFixed(2)}% </p>
                    }
                    <p className="coin-market-cap"style={styles}>
                        Market Cap: £{marketcap.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    )
}
export const styles = {
    backgroundColor: '#196FB1',
    color: '#fff',
    borderRadius: '2px'
}

export default SelectedCoin
