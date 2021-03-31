import React, {useState, useEffect}from 'react'
import axios from 'axios';
import Coin from '../components/Coin';
import { database } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

function Sell() {
    const [currencies, setCurriencies] = useState()
    const {currentUser} = useAuth()
    const [valueSell, setValueSell] = useState('')
    const [currency, setCurrency]= useState('')
    const[currencyBalance, setCurrencyBalance] = useState('')
    const[coins, setCoins] = useState()
    const[userCurrencies, setUserCurrencies] = useState('')

    useEffect(() => {
        const currenciesRef = database.ref('users').child(currentUser.uid).child('currencies')
        currenciesRef.on('value', snapshot => {
            const data = snapshot.val()
            const currencies = []
            for(let symbol in data) {
                currencies.push({symbol, ...data[symbol]})
            }
            setCurriencies(currencies)
        })

        const fetchData = async () => {
            try {
              let { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=gbp&order=market_cap_desc&per_page=20&page=1&sparkline=false')
              setCoins(data)
            const filtererdCoins = []
            coins.map(item => {
                for(let currency of currencies){
                    if(currency.symbol === item.symbol){
                        filtererdCoins.push(item)
                    }
                }
            })
            setUserCurrencies(filtererdCoins);
    
            } catch (error) {
              console.log(error);
            }
          }
          fetchData()
    }, [])

    useEffect(()=>{
        if(currency){
            const symbolRef = database.ref('users').child(currentUser.uid).child('currencies').child(currency)
            symbolRef.on('value', (snapshot)=> {
            const data = snapshot.val();
            if(data == null){
                setCurrencyBalance('')
                
            } else {
                setCurrencyBalance(data.equity)
               
            }
          })
        }
        
    }, [currency])
    
    const handleChangeSell = e => {
        setValueSell(e.target.value)
        
    }

    const handleSelectCurrency = e => {
        setCurrency(e.target.value)
        
    }

    const handleSubmit = async e => {
        e.preventDefault()
        if(valueSell > currencyBalance){
            return alert('sorry you dont have that amount to sell')
        }

        try {
            const userRef = database.ref('users').child(currentUser.uid)
            const currencyRef = database.ref('users').child(currentUser.uid).child('currencies').child(currency)
        } catch (error) {
            console.log(error.message);
        }
    //     try {
    //         const userRef = database.ref('users').child(currentUser.uid)

    //         const currencies = coins.filter(coin => coin.id === id)

    //         const price = currencies[0].current_price
    //         const name = currencies[0].name
    //         const symbol = currencies[0].symbol
    //         const equitySum = parseFloat(currentlyEquity) || 0
    //         const equity = parseFloat((valueBuy / price) + equitySum).toFixed(5)
    //         const currency = {
    //             name, 
    //             equity,
    //         }

    //         const transaction = {
    //             equity,
    //             name,
    //             price,
    //             symbol,
    //             transacted: Date.now()
    //         }

    //         userRef.child('currencies').child(symbol).set(currency)
    //         userRef.child('transactions').push(transaction)

    //         userRef.update({
    //             money: user.money - valueBuy
    //         })     

    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // }
    }

    return (
        <div>
             <h1 >sell cripto</h1>
            <form onSubmit={handleSubmit}>
            <label >What currency do you want sell?</label>
            <select onChange={handleSelectCurrency}>
                {currencies && currencies.map(currency => {
                    return (
                        <option 
                            key={currency.symbol} 
                            value={currency.symbol}
                        >
                        {currency.name}
                        </option>
                    )
                })}
            </select>
            <label>amount available</label>
            <input type="number"value={currencyBalance} disabled/>
            <label> how much do you want sell</label>
            <input type="number" onChange={handleChangeSell}/>
            <button type="submit">Sell</button>
            </form>
        </div>
    )
}

export default Sell;

