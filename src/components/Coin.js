import React from 'react'
import './Coin.css'

function Coin({image, name, price, symbol, volume, priceChange, marketcap, setId, id, setSym}) {
    const handleSelect = () => {
        setId(id)
        setSym(symbol)
    }

    return (
        <div className='coin-container'>
            <div className="coin-row">
                <div className="coin">
                    <img src={image} alt="cryipto-currency"/>
                    <h1>{name}</h1>
                    <p className="coin_symbol">{symbol}</p>
                </div>
                <div className="coin-data">
                    <p className="coin-price">£{price}</p>
                    <p className="coin-volume">£{volume.toLocaleString()}</p>
                    {priceChange < 0 ? (
                        <p className='coin-percent red'>{priceChange.toFixed(2)}%</p>
                    ) : <p className='coin-percent green'>{priceChange.toFixed(2)}% </p>
                    }
                    <p className="coin-market-cap">
                        Market Cap: £{marketcap.toLocaleString()}
                    </p>
                    <button onClick={handleSelect}>select</button>
                </div>
            </div>
        </div>
    )
}

export default Coin
