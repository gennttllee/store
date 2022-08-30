import Link from 'next/link';
import { useState, useContext, useEffect } from 'react';
import { Store } from '../utils/Mystore';
import { useRouter } from "next/router"
import Cookies from 'js-cookie';
import Layouts from '../components/Layouts'
import styles from '../styles/profile.module.css'

export default function Profile() {
    const { dispatch, state } = useContext(Store)
    const { userInfo, cart } = state;
    const router = useRouter();
    const [status, setStatus] = useState();
    const myData = Cookies.get('shippingAddress') ? JSON.parse(Cookies.get('shippingAddress')) : ''
    const [loading, setLoading] = useState()

    useEffect(() => {
        if (userInfo === 'boy') {
            router.push('/Login')
        }
        if (userInfo.isAdmin === true) {
            setStatus('Admin')
        } else {
            setStatus('Customer')
        }
    }, [router, userInfo]);

    const clicker = (item) => {
        setLoading(item)
    }

    const logout =()=>{
        setLoading(3)
        dispatch({type : 'USER_LOGOUT'})
        Cookies.remove('userInfo')
        Cookies.remove('cartItems')
        Cookies.remove('shippingAddress')
        router.push('/Loading')
    }

    return (
        <Layouts>
            <div className={styles.home}>
                <div className={styles.child}>
                    <Link href='/Loading'>
                        <a>Home</a>
                    </Link>
                    <p>{userInfo.name} profile</p>
                </div>
            </div>
            <div className={styles.div}>
                <div>
                    <span className={`fa fa-user ${styles.user}`}></span>
                    <div className={styles.flexed}>
                        <div>
                            <h3>name</h3>
                            <h3>Status</h3>
                            <h3>Email Address</h3>
                            <h3>Phone Number</h3>
                            <h3>Address</h3>
                            <h3>City Of Residence</h3>
                        </div>
                        <div>
                            <h3 className={styles.normal}>{userInfo.name}</h3>
                            <h3 className={styles.normal}>{status}</h3>
                            <h3 className={styles.normal}>{userInfo.email}</h3>
                            <h3 className={styles.normal}>{myData ? myData.number : 'Not set'}</h3>
                            <h3 className={styles.normal}>{myData ? myData.address : 'Not set'}</h3>
                            <h3 className={styles.normal}>{myData ? myData.city : 'Not set'}</h3>
                        </div>
                    </div>
                </div>
                <Link href={userInfo.isAdmin ? `/Admin/orders/${userInfo._id}` : `/${userInfo._id}`}>
                    <a onClick={()=>clicker(1)} className={styles.link}>{loading === 1 ? 'loading...' : 'History'} <span className={`fa fa-arrow-right-long ${styles.arrows}`}></span></a>
                </Link>
                {userInfo.isAdmin && <Link href={`/Admin/products/${userInfo._id}`}>
                    <a onClick={()=>clicker(2)} className={styles.link}>{loading === 2 ? 'loading...' : 'Products'} <span className={`fa fa-arrow-right-long ${styles.arrows}`}></span></a>
                </Link>}
                <button onClick={logout} className={styles.link}>{loading === 3 ? 'Loading...' : 'Logout'}</button>
            </div>
        </Layouts>
    )
}
