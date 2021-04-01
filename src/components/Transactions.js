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
        <div>
            <h1>Transactions</h1>
            {transactions && transactions.map(transaction => {
                return (
                    <>
                    <div key={transaction.transacted}>
                        <p>Symbol: {transaction.symbol}</p>
                        <p>Name: {transaction.name}</p>
                        <p>Equity Value: {transaction.equity}</p>
                        <p>Price: {transaction.price}</p>
                        <p>type: {transaction.type}</p>
                        <p>Transacted: <SimpleDateTime dateSeparator="-" format="MYD" timeSeparator=":" meridians="1">{Math.floor(transaction.transacted / 1000)}</SimpleDateTime></p>
                    </div>
                    <div key='73' >________________________________</div>
                    </>
                )
            })}
        </div>
    )
}

export default Transactions
