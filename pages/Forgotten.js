import Layouts from "../components/Layouts";
import styles from '../styles/forgotten.module.css'
import { useState } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router'
import Link from 'next/link';
import dynamic from "next/dynamic";

function Forgotten() {
    const ego1 = process.env.NEXT_PUBLIC_EGO_ID;
    const ego3 = process.env.NEXT_PUBLIC_EGO_SERVICE;
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('');
    const [show, setShow] = useState(false);
    const [myOtp, setMyOtp] = useState();
    const [newPassword, setNewPassword] = useState(false);
    const [number, setNumber] = useState(Math.floor(199530 + Math.random() * 194951));
    const [password, setPassword] = useState()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();

    let name;
    var templateParams = {
        name: name,
        message: 'Use this otp to change your password',
        OTP: number,
        expiry: 'expires after 5 minutes',
        email: email
    };

    const submitMe = async (e) => {
        e.preventDefault()
        closeSnackbar()
        setLoading(true)
        console.log(email)
        try {
            const { data } = await axios.get(`/api/users/${email}`);
            name = data.name
            setInterval(() => {
                setNumber(Math.floor(19950 + Math.random() * 19951));
            }, 600000);
            emailjs.send(ego1, 'template_m1kk5rn', templateParams, ego3)
                .then(function (response) {
                    console.log('SUCCESS!', response.status, response.text);
                }, function (error) {
                    console.log('FAILED...', error);
                });
            setLoading(false)
            setShow(true)
            enqueueSnackbar('OTP has been sent to your email address', { variant: 'success' })
            setTimeout(() => {
                enqueueSnackbar('Timeout', { variant: 'error' })
                setShow(false)
            }, 600000);
        } catch (error) {
            enqueueSnackbar(error.response.data, { variant: 'error' })
            setLoading(false)
        }
    };

    const handleSubmit = (e) => {
        setLoading(true)
        e.preventDefault()
        closeSnackbar()
        if (number == myOtp) {
            enqueueSnackbar('success', { variant: 'success' })
            setNewPassword(true)
            setLoading(false)
        } else {
            enqueueSnackbar('invalid OTP', { variant: 'error' })
            setLoading(false)
        }
    }

    const backer = (e) => {
        e.preventDefault();
        setShow(false)
        closeSnackbar()
    }

    const finalSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        closeSnackbar()
        try {
            const { data } = await axios.patch('/api/users', { email, password })
            setLoading(false);
            enqueueSnackbar('password changed successfully', { variant: 'success' })
            router.push('/Login')
        } catch (error) {
            setLoading(false);
            enqueueSnackbar(err.response.data, { variant: 'error' })
        }
    }

    return (
        <Layouts title='login'>
            <div className={styles.home}>
                <div className={styles.child}>
                    <Link href='/Loading'>
                        <a>Home</a>
                    </Link>
                    <p>Reset Password</p>
                </div>
            </div>
            <div className={styles.div}>
                {newPassword ? <form onSubmit={finalSubmit}>
                    <label className={styles.label}>Enter New Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} className={styles.input} type='password' minLength='8' required></input>
                    <button type="submit" className={loading ? styles.btn2 : styles.btn} >{loading ? 'Loading...' : 'Continue'}</button>
                </form> : <div> {show ? '' : <form onSubmit={submitMe}>  <label className={styles.label}>Please enter your email</label>
                    <input onChange={(e) => setEmail(e.target.value)} className={styles.input} type='email' placeholder='Email' required></input>
                    <button type="submit" className={loading ? styles.btn2 : styles.btn}>{loading ? 'Loading...' : 'Continue'}</button></form>}
                    {show && <form onSubmit={handleSubmit}>
                        <button className={styles.btn1} onClick={backer}>Back</button>
                        <label className={styles.label}>Please check your mail for OTP</label>
                        <input onChange={(e) => setMyOtp(e.target.value)} className={styles.input} type='number' placeholder='Valid OTP' required></input>
                        <button type="submit" className={loading ? styles.btn2 : styles.btn} >{loading ? 'Loading...' : 'Continue'}</button>
                    </form>}</div>}
            </div>
        </Layouts>
    )
};

export default dynamic(() => Promise.resolve(Forgotten), { ssr: false })
