
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
    const [loading, setLoading]= useState(false)

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
        setLoading(true)
        router.push('/AdminOrders')
    }


    return (
        <Layouts>
            <div className={styles.div}>
            <h1 className={styles.h1}>PROFILE</h1>
            <table className={styles.table}>
                <tr>
                    <th>Name :</th>
                    <td>{userInfo.name}</td>
                </tr>
                <tr>
                    <th>Status :</th>
                    <td>{status}</td>
                </tr>
                <tr>
                    <th>Email :</th>
                    <td>{userInfo.email}</td>
                </tr>
                <tr>
                    <th>Phone Number :</th>
                    <td>{ myData ? myData.number : 'Not Set'}</td>
                </tr>
                <tr>
                    <th>Address :</th>
                    <td>{ myData ? myData.address : 'Not Set'}</td>
                </tr>
                <tr>
                    <th>City Of Res :</th>
                    <td>{ myData ? myData.city : 'Not Set'}</td>
                </tr>
            </table>
                {userInfo.isAdmin ? <button onClick={clicker} className={loading ? styles.load : styles.btn}>{loading ? 'Loading...' : 'Orders'}</button> : <p className={styles.h1}>Slides by ego</p>}
            </div>
        </Layouts>
    )
}
