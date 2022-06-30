import Layouts from "../components/Layouts"
import { Store } from '../utils/Mystore';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'
import { Link } from "@mui/material";
import styles from '../styles/payment.module.css';
import { useSnackbar } from 'notistack';

export default function Payment() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const [payment, setPayment] = useState('')
    const [loading, setLoading] = useState(false)

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
            enqueueSnackbar('Please select a payment method', { variant: 'error' });
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
                <div className={styles.div}>
                    <div className={styles.child}>
                        <input className={styles.input} onChange={(e) => setPayment(e.target.value)} type='radio' name="payment" value='cash' checked={payment === 'cash'}></input>
                        <label className={styles.label}>Cash on delivery</label>
                    </div>

                    <div className={styles.child}>
                        <input className={styles.input} onChange={(e) => setPayment(e.target.value)} type='radio' name="payment" value='debit' checked={payment === 'debit'} ></input>
                        <label className={styles.label}> Debit card</label>
                    </div>

                    <div className={styles.child}>
                        <input className={styles.input} onChange={(e) => setPayment(e.target.value)} type='radio' name="payment" value='bank' checked={payment === 'bank'} ></input>
                        <label className={styles.label}>Bank Transfer</label>
                    </div>

                </div>
                <button className={loading ? styles.load : styles.btn} onClick={submit}>{loading ? 'Loading...' : 'Submit'}</button>
                <br />
                <Link href="/Shipping">
                    <a className={styles.anchor}>Back</a>
                </Link>
            </div>
        </Layouts>
    )
}
