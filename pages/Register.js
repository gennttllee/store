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
    const initialState ={email : '', password : '', confirm : '', name : ''} 
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();
    const { dispatch, state } = useContext(Store)
    const [user, setUser] = useState(initialState);
    const [loading, setLoading] = useState()

    const submitHandler = async (e) => {
        e.preventDefault()
        closeSnackbar()
        if (user.confirm !== user.password) {
            enqueueSnackbar('Password does not match', { variant: 'error' });
        } else {
            setLoading(true)
            try {
                const { data } = await axios.post(`/api/users/:${user.email}`, user);
                setUser(initialState);
                dispatch({ type: 'USER_LOGIN', payload: data })
                Cookies.set('userInfo', JSON.stringify(data))
                enqueueSnackbar('Registered successfully', { variant: 'success' });
                setLoading(false)
                if (state.cart.cartItems.length >= 1) {
                    router.push('/Shipping');
                } else {
                    router.push('/Loading');
                }
            } catch (error) {
                setLoading(false)
                enqueueSnackbar(error.response.data, { variant: 'error' });
            };
        }
    };

    const changes =(e)=>{
        setUser({...user, [e.target.name] : e.target.value})
    }

    return (
        <Layouts title='register'>
            <div className={styles.home}>
                <div className={styles.child}>
                    <Link href='/Loading'>
                        <a>Home</a>
                    </Link>
                    <p>Create an account</p>
                </div>
            </div>
            <div className={styles.div}>
                <form className={styles.form} onSubmit={submitHandler}>
                    <h1 className={styles.h1}>Create an account</h1>
                    <input className={styles.input} onChange={changes} type='text' name='name' value={user.name} placeholder='First name' required></input>
                    <input className={styles.input} onChange={changes} type='email' name='email' value={user.email} placeholder='Email' required></input>
                    <input className={styles.input} onChange={changes} type='password' name='password' value={user.password} minLength='8' placeholder='Password' required></input>
                    <input className={styles.input} onChange={changes} type='password' name='confirm' value={user.confirm} minLength='8' placeholder=' Confirm password' required></input>
                    <button className={loading ? styles.load : styles.btn} type='submit'>{loading ? 'Loading...' : 'Register'}</button>
                </form>
                <p>Already have an account ? <Link href='/Login'>
                    <a className={styles.anchor}>Login here</a>
                </Link></p>
            </div>
        </Layouts>
    )
};

