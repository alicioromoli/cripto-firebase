import React, {useState, useEffect}from 'react'
import { database } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import SimpleDateTime  from 'react-simple-timestamp-to-date'

function Transactions() {
    const [transactions, setTransactions] = useState([])
    const {currentUser} = useAuth()

    useEffect(()=> {    
        const userRef = database.ref('users').child(currentUser.uid).child('transactions')
          userRef.on('value', (snapshot)=> {
            const data = snapshot.val();
            const transactions = []
            for(let id in data){
                transactions.push(data[id])
            }
            setTransactions(transactions);
          })
    }, [])

    return (
        <div className="container">
            <div className="wrapper">
            <h1>Transactions</h1>
            <table className='container__dashboard'>
            <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Equity</th>
                <th>Price</th>
                <th>Type</th>
                <th>Transacted</th>
            </tr>
            {transactions && transactions.map(transaction => {
                return (
                    <>
                    <tr key={transaction.transacted}>
                        <td>{transaction.symbol}</td>
                        <td>{transaction.name}</td>
                        <td>{transaction.equity}</td>
                        <td>{transaction.price}</td>
                        <td>{transaction.type}</td>
                        <td><SimpleDateTime dateSeparator="-" format="MYD" timeSeparator=":" meridians="1">{Math.floor(transaction.transacted / 1000)}</SimpleDateTime></td>
                    </tr>
                    </>
                )
            })}
            </table>
            </div>
        </div>
    )
}

export default Transactions
