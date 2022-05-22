import Head from 'next/head';
import styles from '../utils/layouts.module.css'
import Link from 'next/link';
import Cookies from "js-cookie"
import dynamic from 'next/dynamic'
import { Store } from '../utils/Mystore'
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Load from '../components/Load';

function Layouts({ title, children }) {
    const router = useRouter();
    const { dispatch, state } = useContext(Store)
    const { userInfo } = state;
    const mark = state.cart.cartItems.reduce((a, c) => a + c.quantity * 1, 0)
    const [loading, setLoading] = useState(false)


    const selectMe = (e) => {
        if (e.target.value === 'logout') {
            dispatch({ type: 'USER_LOGOUT' })
            Cookies.remove('userInfo')
            Cookies.remove('cartItems')
            Cookies.remove('shippingAddress')
            router.push('/Loading')
        } else if (e.target.value === 'profile') {
            setLoading(true)
            router.push('/Profile')
        } else if (e.target.value === 'dashboard') {
            setLoading(true)
            if (!userInfo.isAdmin) {
                router.push('/History')
            } else {
                router.push('/Dashboard')
            }
        }
    };

    useEffect(() => {
        if (!userInfo) {
            Cookies.remove('userInfo')
        }
    }, [userInfo]);

    return (
        <div className={styles.container}>
            <Head>
                <title>{title ? `${title}-mw-shop` : 'mw-shop'}</title>
                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'></meta>
            </Head>
            <nav className={styles.navbar}>
                <Link href='/Loading'>
                    <a className={styles.brand}>
                        <Image src='/images/ego.jpeg' alt='Logo' width={50} height={40} />
                    </a>
                </Link>
                <ul className={styles.ul}>
                    <li className={styles.li}>
                        <Link href='/Cart'>
                            <a>
                                <span className={`material-symbols-outlined ${styles.bigboy}`}>
                                    production_quantity_limits
                                </span>
                                : <span className={styles.spanner}>{mark}</span>
                            </a>
                        </Link>
                    </li>
                    <li>
                        {userInfo ? <select className={styles.select} onChange={selectMe}>
                            <option value={userInfo.name}>{userInfo.name}</option>
                            <option value='dashboard'>dashboard</option>
                            <option value='profile'>profile</option>
                            <option value='logout'>Logout</option>
                        </select> : <Link href='/Login'>
                            <a>Login</a>
                        </Link>}
                    </li>
                </ul>
            </nav>
            {loading ? <Load /> : <main className={styles.main}>{children}</main>}
            <footer className={styles.footer}>
                <p>All rights reserved</p>
            </footer>
        </div>
    )
}
export default dynamic(() => Promise.resolve(Layouts), { ssr: false })