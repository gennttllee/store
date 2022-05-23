import Layouts from "../components/Layouts"
import { Store } from '../utils/Mystore';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'
import { Link } from "@mui/material";
import styles from '../styles/payment.module.css';

export default function Payment() {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const [payment, setPayment] = useState('')
    const [loading, setLoading]= useState(false)

    useEffect(() => {
        setLoading(false)
        if (!cart.shippingAddress) {
            router.push('/Shipping')
        } else {
            setPayment(Cookies.get('paymentMethod') || '');
        }
    }, []);

    const submit = () => {
        setLoading(true)
        if (payment === '') {
            alert('please select a payment method')
            setLoading(false)
        } else {
            dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: payment });
            Cookies.set('paymentMethod', payment);
            router.push('/PlaceOrder');
        }
    }

    return (
        <Layouts>
            <div className={styles.div}>
                <h1 className={styles.h1}>Payment Method</h1>
                <input className={styles.input} onChange={(e) => setPayment(e.target.value)} type='radio' name="payment" value='cash' checked={payment === 'cash'}></input>
                <label className={styles.label}>Cash on delivery</label>
                <br />
                <input className={styles.input} onChange={(e) => setPayment(e.target.value)} type='radio' name="payment" value='debit' checked={payment ==='debit'} ></input>
                <label className={styles.label}> Debit card</label>
                <br />
                <input className={styles.input} onChange={(e) => setPayment(e.target.value)} type='radio' name="payment" value='bank' checked={payment ==='bank'} ></input>
                <label className={styles.label}>Bank Transfer</label>
                <br />
                <button className={loading ? styles.load : styles.btn} onClick={submit}>{loading ? 'Loading...' : 'Submit'}</button>
                <br />
                <Link href="/Shipping">
                    <a className={styles.anchor}>Back</a>
                </Link>
            </div>
        </Layouts>
    )
}
