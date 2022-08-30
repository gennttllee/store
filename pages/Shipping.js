import Layouts from "../components/Layouts"
import { useRouter } from "next/router"
import { Store } from "../utils/Mystore";
import { useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import styles from '../styles/shipping.module.css'
import Link from 'next/link';
import dynamic from "next/dynamic";

function Shipping() {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('')
    const [full, setFull] = useState('')
    const [loading, setLoading] = useState(false)
    const [number, setNumber] = useState('')
    const router = useRouter();
    const { state, dispatch } = useContext(Store)
    const { userInfo } = state;
    const mark = state.cart.cartItems.reduce((a, c) => a + c.quantity * 1, 0)

    useEffect(() => {
        const mark = state.cart.cartItems.reduce((a, c) => a + c.quantity * 1, 0)
        if (mark < 1) {
            router.push('/Loading')
        } else if (!userInfo.name) {
            router.push('/Login')
        }
        const myData = Cookies.get('shippingAddress');
        if (myData) {
            const data = JSON.parse(myData)
            setFull(data.full);
            setAddress(data.address);
            setNumber(data.number);
            setCity(data.city);
        }
    }, [mark, router, userInfo, state.cart.cartItems])



    const submitHandler = (e) => {
        e.preventDefault()
        setLoading(true)
        dispatch({ type: 'SAVE_SHIPPING_ADDRESS', payload: { full, address, city, number } })
        Cookies.set('shippingAddress', JSON.stringify({ full, address, city, number }))
        router.push('/Payment')
    };

    return (
        <Layouts title='shipping'>
            <div className={styles.home}>
                <div className={styles.child}>
                    <Link href='/Loading'>
                        <a>Home</a>
                    </Link>
                    <p>Shipping Info</p>
                </div>
            </div>
            <div className={styles.div}>
                <h1 className={styles.h1}>Shipping Info</h1>
                <form className={styles.form} onSubmit={submitHandler}>
                    <input className={styles.input1} onChange={(e) => setFull(e.target.value)} type='text' placeholder='Full name' value={full} required></input>
                    <input className={styles.input1} onChange={(e) => setAddress(e.target.value)} type='text' placeholder='Address' value={address} required></input>
                    <input className={styles.input1} onChange={(e) => setCity(e.target.value)} type='text' placeholder='City' value={city} required></input>
                    <input className={styles.input1} onChange={(e) => setNumber(e.target.value)} type='tel' placeholder='Phone number' value={number} required></input>
                    <button className={loading ? styles.load : styles.btn} type='submit'>{loading ? 'Loading...' : 'Submit'}</button>
                </form>
            </div>
        </Layouts>
    )
};

export default dynamic(() => Promise.resolve(Shipping), { ssr: false })