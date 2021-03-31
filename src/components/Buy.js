import React, {useState, useEffect}from 'react'
import axios from 'axios';
import Coin from '../components/Coin';
import { database } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

function Buy() {
    const [coins, setCoins] = useState([])
    const [search, setSearch] = useState('')
    const [selectedCoin, setSelectedCoin] = useState('')
    const [id, setId] = useState('')
    const [valueBuy, setValueBuy] = useState(0)
    const {currentUser} = useAuth()
    const[user, setUser]= useState('')
    const[sym, setSym] = useState('')
    const [currentlyEquity, setCurrentlyEquity] = useState('')
  
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
                transacted: Date.now()
            }

            userRef.child('currencies').child(symbol).set(currency)
            userRef.child('transactions').push(transaction)

            userRef.update({
                money: user.money - valueBuy
            })
          

        } catch (error) {
            console.log(error.message);
        }


    }

    const filteredCoins = coins.filter(coin => coin.name.toLowerCase().includes(search.toLowerCase()))


    return (
        <div>
             <h1 >Search for a crypto</h1>
            <form onSubmit={handleSubmit}>
            <input type="text" placeholder='search' onChange={handleChange}/>
            <label> how much do you want to buy</label>
            <input type="number" onChange={handleChangeBuy}/>
            <button type="submit">Buy</button>
            </form>
            <h1>Selected Coin</h1>
            {id && 
            filteredCoins.filter(item => {
                return item.id === id
            }).map(coin => {
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
            <div>_________________________________</div>
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
    )
}

export default Buy
