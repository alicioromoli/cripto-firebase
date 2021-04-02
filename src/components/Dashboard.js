import React, { useState, useEffect } from 'react'
import { database } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios';
import './Dashboard.css'

function Dashboard() {
    const {currentUser} = useAuth()
    const [coins, setCoins] = useState()
    const [user, setUser] = useState('')
    const[currencies, setCurrencies]= useState([])
    const[userCurrencies, setUserCurrencies] = useState('')
    const[totalValueCurrency, setTotalValueCurrency] = useState('')
    

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
        <div className="container">
            <div className="wrapper">
            <h1>Dashboard</h1>
            <div className="container__money">
                <h2 className="container__money-font-total">Cash available</h2>
                <h2 className="container__money-font">£ {user && user.money.toFixed(2) }</h2>
            </div>
            <table className='container__dashboard'>
            <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Equity</th>
                <th>Price</th>
                <th>TOTAL</th>
            </tr>
            {currencies && currencies.map(item => {
                return (
                    <tr key={item.symbol}>
                        <td>{item.symbol}</td>
                        <td>{item.name}</td>
                        <td>{item.equity}</td>
                        <td>{userCurrencies.length > 0 && userCurrencies.filter(curr => curr.symbol == item.symbol)[0].price}</td>
                        <td>£ {parseFloat(item.equity * userCurrencies.filter(curr => curr.symbol == item.symbol)[0].price).toFixed(2)}</td>
                    </tr>
                )
            })}
            </table>
            </div>
        </div>
    )
}

export default Dashboard
