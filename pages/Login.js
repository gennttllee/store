import Layouts from '../components/Layouts'
import Link from 'next/link';
import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { Store } from '../utils/Mystore';
import { useRouter } from "next/router"
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import styles from '../styles/login.module.css'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const { dispatch, state } = useContext(Store)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { userInfo, cart } = state;
    const [show, setShow] = useState(true)
    const mark = cart.cartItems.reduce((a, c) => a + c.quantity * 1, 0)
    useEffect(() => {
        if (userInfo) {
            if (mark >= 1) {
                router.push('/Shipping')
            } else {
                router.push('/')
            }
        }
    }, [mark, router, userInfo])

    const [email, setEmail] = useState();
    const [password, setPassword] = useState()
    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await axios.post('/api/users', { email, password });
            dispatch({ type: 'USER_LOGIN', payload: data })
            Cookies.set('userInfo', JSON.stringify(data))
            enqueueSnackbar('login successfully', { variant: 'success' });
            setLoading(false)
            if (mark < 1) {
                router.push('/Loading');
            } else {
                router.push('/Shipping');
            }
        } catch (error) {
            setLoading(false)
            enqueueSnackbar(error.response.data, { variant: 'error' });
            setShow(true);
        };
    };

    return (
        <Layouts title='login'>
            <div className={styles.home}>
                <div className={styles.child}>
                    <Link href='/Loading'>
                        <a>Home</a>
                    </Link>
                    <p>Login to your account</p>
                </div>
            </div>
            <div className={styles.div}>
                <form className={styles.form} onSubmit={submitHandler}>
                    <h1 className={styles.h1}>Login to your account</h1>
                    <input className={styles.input1} onChange={(e) => setEmail(e.target.value)} type='email' placeholder='Email' required></input>
                    <input className={styles.input1} onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Password' required></input>
                    <button className={loading ? styles.load : styles.btn} type='submit'>{loading ? 'Loading...' : 'Login'}</button>
                </form>
                <p>Dont have an account ? <Link href='/Register'>
                    <a className={styles.anchor}>Register here</a>
                </Link></p>
                {show && <p>Forgotten your password ? <Link href='/Forgotten'>
                    <a className={styles.anchor1}>Click here</a>
                </Link></p>}
            </div>
        </Layouts>
    )
};
