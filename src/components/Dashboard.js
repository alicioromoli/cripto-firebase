import React, { useState, useEffect } from 'react'
import { database } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios';

function Dashboard() {
    const {currentUser} = useAuth()
    const [coins, setCoins] = useState()
    const [user, setUser] = useState('')
    const[currencies, setCurrencies]= useState([])
    const[userCurrencies, setUserCurrencies] = useState('')
    

    useEffect(() => {
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
    

    useEffect(()=> {
        const currencies = []
        const currency = user.currencies
        for(let symbol in currency){
            currencies.push({symbol, ...currency[symbol]})
        }
        setCurrencies(currencies)
        if(coins){
            const filtererdCoins = []
            coins.map(item => {
                for(let currency of currencies){
                    if(currency.symbol === item.symbol){
                        const coin = {
                            symbol: item.symbol,
                            price: item.current_price
                        }
                        filtererdCoins.push(coin)
                    }
                }
            })
            setUserCurrencies(filtererdCoins)
            
            
        }

    },[coins, user])

    
    return (
        <div>
            <h1>Dashboard</h1>
            <h2>money available £ {user && user.money.toFixed(2) }</h2>
            {currencies && currencies.map(item => {
                return (
                    <div key={item.symbol}>
                        <p>Symbol: {item.symbol}</p>
                        <p>Name: {item.name}</p>
                        <p>Equity: {item.equity}</p>
                        <p>Price: {userCurrencies.length > 0 && userCurrencies.filter(curr => curr.symbol == item.symbol)[0].price}</p>
                        <p>TOTAL £ {parseFloat(item.equity * userCurrencies.filter(curr => curr.symbol == item.symbol)[0].price).toFixed(2)}</p>
                        <p>_________________________</p>
                    </div>
                )
            })}
        </div>
    )
}

export default Dashboard
