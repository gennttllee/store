
import { useState, useContext, useEffect } from 'react';
import { Store } from '../utils/Mystore';
import { useRouter } from "next/router"
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import Layouts from '../components/Layouts'
import styles from '../styles/profile.module.css'

export default function Profile() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { dispatch, state } = useContext(Store)
    const { userInfo, cart } = state;
    const router = useRouter();
    const[status, setStatus] = useState();
    const myData = Cookies.get('shippingAddress') ? JSON.parse( Cookies.get('shippingAddress')) : ''
    console.log(myData)

    useEffect(() => {
        if (userInfo === 'boy') {
            router.push('/Login')
        }
        if (userInfo.isAdmin === true){
            setStatus('Admin')
        } else {
            setStatus('Customer')
        }
    }, [userInfo]);

    const clicker =()=>{
        router.push('/AdminOrders')
    }


    return (
        <Layouts>
            <div className={styles.div}>
                <h1 className={styles.h1}>PROFILE</h1>
                <h1 className={styles.p}><span className={styles.span1}>Name :</span>  <span className={styles.spanner}> {userInfo.name}</span></h1>
                <div className={styles.p}><span className={styles.span1}>Status :</span> :<span className={styles.spanner}>  {status} </span></div>
                <div className={styles.p}><span className={styles.span1}>Email :</span>  <span className={styles.spanner}> {userInfo.email}</span> </div>
                <div className={styles.p}><span className={styles.span1}>Phone :</span> <span className={styles.spanner}> {myData ? myData.number : 'Not set' }</span> </div>
                <div className={styles.p}><span className={styles.span1}>Address :</span>  <span className={styles.spanner}>{myData ? myData.address : 'Not set'}</span> </div>
                <div className={styles.p}><span className={styles.span1}>City of Res :</span> <span className={styles.spanner}>{myData ? myData.city : 'Not set'}</span> </div>
                {userInfo.isAdmin ? <button onClick={clicker} className={styles.btn}>Orders</button> : <p className={styles.h1}>Slides by ego</p>}
            </div>
        </Layouts>
    )
}
