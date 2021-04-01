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
    const[user, setUser]= useState('')

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

    useEffect(()=> {
        if(currencies){
            const filtererdCoins = []
                coins.map(item => {
                    for(let currency of currencies){
                        if(currency.symbol === item.symbol){
                            filtererdCoins.push(item)
                        }
                    }
                })
                setUserCurrencies(filtererdCoins);
        }
        
    }, [coins, currencies])
    
    const handleChangeSell = e => {
        setValueSell(e.target.value)
        
    }

    const handleSelectCurrency = e => {
        setCurrency(e.target.value)
        
    }

    const handleSubmit = async e => {
        e.preventDefault()

        if(valueSell > currencyBalance ){
            return alert('sorry you dont have that amount to sell')
        } 

        try {
            console.log(userCurrencies);
            const currentlyPriceCurrency = userCurrencies.filter(coin => coin.symbol == currency)[0].current_price
            const currencyName = userCurrencies.filter(coin => coin.symbol == currency)[0].name
            const value = (parseFloat(currencyBalance - valueSell) * currentlyPriceCurrency).toFixed(2)
            
            const userRef = database.ref('users').child(currentUser.uid)
            const currencyRef = database.ref('users').child(currentUser.uid).child('currencies').child(currency)

            const updateCurrencyEquity = parseFloat(currencyBalance - valueSell).toFixed(5)

            if (updateCurrencyEquity <= 0){
                currencyRef.remove()
            }else{
                currencyRef.update({
                equity: parseFloat(currencyBalance - valueSell).toFixed(5)
            })
            }

            userRef.update({
                money: parseFloat(user.money) + parseFloat(value)
            })

            const transaction = {
                equity: parseFloat(valueSell).toFixed(5),
                name: currencyName,
                price: currentlyPriceCurrency,
                symbol: currency,
                transacted: Date.now(),
                type: 'sell'
            }

            userRef.child('transactions').push(transaction)
            
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className="container">
            <div className="wrapper">
            <form onSubmit={handleSubmit} className='exchange__form'>
            <label >What currency do you want sell?</label>
            <select onChange={handleSelectCurrency} className='select-form' >
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
            <input  type='number' step='0.00001'  onChange={handleChangeSell}/>
            <button type="submit">Sell</button>
            </form>
            </div>
        </div>
    )
}

export default Sell;

