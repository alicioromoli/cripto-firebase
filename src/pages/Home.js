import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Coin from '../components/Coin';

function Home() {
    const [coins, setCoins] = useState([])
    const [search, setSearch] = useState('')
  
    useEffect( () => {
      const fetchData = async () => {
        try {
          let { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=gbp&order=market_cap_desc&per_page=100&page=1&sparkline=false')
          setCoins(data)
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      }
      fetchData()
    }, [])
  
    const handleChange = e => {
      setSearch(e.target.value)
    }
    const filtererdCoins = coins.filter(coin => coin.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="coin-app">
      <div className="coin-search">
        <h1 className="coin-text">Search for a crypto</h1>
        <form >
          <input className='coin-input' type="text" placeholder='search'onChange={handleChange}/>
        </form>
      </div>
      { filtererdCoins.map(coin => {
        return (
            <Coin 
            key={coin.id} 
            name={coin.name} 
            image={coin.image}
            symbol={coin.symbol}
            price={coin.current_price}
            volume={coin.total_volume}
            priceChange={coin.price_change_percentage_24h}
            marketcap={coin.market_cap}
          />
        )
      })
      }
    </div>
        
    )
}

export default Home
