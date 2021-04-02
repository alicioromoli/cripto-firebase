import React, {useState, useEffect}from 'react'
import axios from 'axios';
import Coin from '../components/Coin';
import { database } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import SelectedCoin from '../components/SelectedCoin'
import './Buy.css'

function Buy() {
    const [coins, setCoins] = useState([])
    const [search, setSearch] = useState('')
    const [selectedCoin, setSelectedCoin] = useState(false)
    const [id, setId] = useState('')
    const [valueBuy, setValueBuy] = useState(0)
    const {currentUser} = useAuth()
    const[user, setUser]= useState('')
    const[sym, setSym] = useState('')
    const [currentlyEquity, setCurrentlyEquity] = useState('')
    const [success , setSuccess ] = useState(false)
  
    useEffect( () => {
      const fetchData = async () => {
        try {
          let { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=gbp&order=market_cap_desc&per_page=20&page=1&sparkline=false')
          setCoins(data)
          const userRef = database.ref('users').child(currentUser.uid)
          userRef.on('value', (snapshot)=> {
            const data = snapshot.val();
            setUser(data)
          })

        } catch (error) {
          console.log(error);
        }
      }
      fetchData()
    }, [])

    useEffect(()=>{
        if(sym){
            const symbolRef = database.ref('users').child(currentUser.uid).child('currencies').child(sym)
            symbolRef.on('value', (snapshot)=> {
            const data = snapshot.val();
            if(data == null){
                setCurrentlyEquity('')
            } else {
                setCurrentlyEquity(data.equity)
            }
          })
        } 
        console.log(currentlyEquity);
    }, [sym])

    const handleChange = e => {
        setSearch(e.target.value)
      }
    
    const handleChangeBuy = e => {
        setValueBuy(e.target.value)
    }

    const handleSubmit = async e => {
        e.preventDefault()
        if(user.money < valueBuy){
            return alert('sorry you dont have enough money to buy')
        }
        try {
            const userRef = database.ref('users').child(currentUser.uid)

            const currencies = coins.filter(coin => coin.id === id)

            const price = currencies[0].current_price
            const name = currencies[0].name
            const symbol = currencies[0].symbol
            const equitySum = parseFloat(currentlyEquity) || 0
            const equity = parseFloat((valueBuy / price) + equitySum).toFixed(5)
            const currency = {
                name, 
                equity,
            }

            const transaction = {
                equity,
                name,
                price,
                symbol,
                transacted: Date.now(),
                type: 'buy'
            }

            userRef.child('currencies').child(symbol).set(currency)
            userRef.child('transactions').push(transaction)

            userRef.update({
                money: user.money - valueBuy
            })
            
            setSuccess(true)

            setTimeout(()=>{
                setSuccess(false)
            }, 3000)

        } catch (error) {
            console.log(error.message);
        }


    }

    const filteredCoins = coins.filter(coin => coin.name.toLowerCase().includes(search.toLowerCase()))


    return (
        <>
        {success &&
            <div className='buy'>
            Bought!
            </div>
        }
        <div className="container">
            <div className="wrapper">
                <h1 >Search for a crypto</h1>
                <form onSubmit={handleSubmit} className='exchange__form'>
                <input type="text" placeholder='search' onChange={handleChange}/>
                <label className='label' > how much do you want to buy</label>
                <input type="number" placeholder='££' onChange={handleChangeBuy}/>
                <button type="submit">Buy</button>
                </form>
                <h1>Selected Coin</h1>
                <div className="coin__selected">
                {id && 
                filteredCoins.filter(item => {
                    return item.id === id
                }).map(coin => {
                    return (
                        <SelectedCoin 
                        key={coin.id} 
                        name={coin.name} 
                        image={coin.image}
                        symbol={coin.symbol}
                        price={coin.current_price}
                        volume={coin.total_volume}
                        priceChange={coin.price_change_percentage_24h}
                        marketcap={coin.market_cap}
                        id={coin.id}
                        setId={setId}
                        setSym={setSym}
                        
                    />
                            )
                })
                }
                
                </div>
                <div className="coins__container">
                { search &&
                        filteredCoins.map(coin => {
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
                                id={coin.id}
                                setId={setId}
                                setSym={setSym}
                                
                            />
                                    )
                            })
                }
                </div>
            </div>
        </div>
        </>
    )
}

export default Buy
