import Layouts from '../components/Layouts'
import Link from 'next/link';
import axios from 'axios';
import { useState, useContext } from 'react';
import { Store } from '../utils/Mystore';
import { useRouter } from "next/router"
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import styles from '../styles/register.module.css'

export default function Register() {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const router = useRouter();
    const { dispatch, state } = useContext(Store)
    const [email, setEmail] = useState();
    const [password, setPassword] = useState()
    const [confirm, setConfirm] = useState()
    const [name, setName] = useState()
    const [loading, setLoading] = useState()


    const submitHandler = async (e) => {
        e.preventDefault()
        closeSnackbar()
        if (confirm !== password) {
            enqueueSnackbar('Password does not match', {variant: 'error'} );
        } else {
            setLoading(true)
            try {
                const { data } = await axios.post('/api/users/register', { email, password, name });
                dispatch({ type: 'USER_LOGIN', payload: data })
                Cookies.set('userInfo', JSON.stringify(data))
                enqueueSnackbar('Registered successfully', {variant: 'success'} );
                setLoading(false)
                if (state.cart.cartItems.length >= 1) {
                    router.push('/Shipping');
                } else {
                    router.push('/Loading');
                }
            } catch (error) {
                setLoading(false)
                enqueueSnackbar(error.message, {variant: 'error'} );
            };
        }
    };

    return (
        <Layouts title='register'>
            <div className={styles.div}>
                <form className={styles.form} onSubmit={submitHandler}>
                <h1 className={styles.h1}>Register</h1>
                    <input className={styles.input} onChange={(e) => setName(e.target.value)} type='text' placeholder='Name' required></input>
                    <input className={styles.input} onChange={(e) => setEmail(e.target.value)} type='email' placeholder='email' required></input>
                    <input className={styles.input} onChange={(e) => setPassword(e.target.value)} type='password' minLength='8' placeholder='password' required></input>
                    <input className={styles.input} onChange={(e) => setConfirm(e.target.value)} type='password' minLength='8'  placeholder=' Confirm password' required></input>
                    <button className={ loading ? styles.load : styles.btn} type='submit'>{loading ? 'Loading...' : 'Register'}</button>
                </form>
                <p>Already have an account ? <Link href='/Login'>
                    <a className={styles.anchor}>Login here</a>
                </Link></p>
            </div>
        </Layouts>
    )
};

