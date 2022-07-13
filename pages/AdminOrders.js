import Layouts from "../components/Layouts";
import db from '../utils/db'
import Order from '../models/Order'
import { useEffect, useContext, useState } from "react";
import Image from 'next/image';
import { Store } from '../utils/Mystore';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import styles from '../styles/adminOrders.module.css'
import Load from '../components/Load'
import Link from 'next/link';


export default function AdminOrders(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();
    const { state } = useContext(Store);
    const { userInfo } = state;
    const { data } = props;
    const orders = JSON.parse(data);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!userInfo) {
            router.push('/Loading')
        } else if (!userInfo.isAdmin) {
            router.push('/Loading')
        }
    }, [userInfo]);


    const handleDelete = async (order) => {
        setLoading(true)
        try {
            closeSnackbar()
            await axios.post('/api/orders/remover', { order })
            window.location.reload(false);
            enqueueSnackbar('successful', { variant: 'success' });
            setLoading(false)
        } catch (err) {
            setLoading(false)
            enqueueSnackbar(err, { variant: 'error' });
        }
    }

    return (
        <Layouts>
            <div className={styles.home}>
                <div className={styles.child}>
                    <Link href='/Loading'>
                        <a>Home</a>
                    </Link>
                    <p>All Sales History</p>
                </div>
            </div>
            {loading ? <Load /> : <div className={styles.div}>
                {orders.length < 1 ? <h1>no orders yet</h1> :
                    orders.map((order) => <ul className={styles.ul} key={order.id}>
                        <h4 className={styles.li}> <span className={styles.h3}>Date :</span> {order.createdAt}</h4>
                        <h4 className={styles.li}>  <span className={styles.h3}>Order-id :</span> {order._id}</h4>
                        <h4 className={styles.li1}> <span className={styles.h3}>Customer :</span> {order.shippingAddress.full}</h4>
                        {order.orderItems.map((item) => <table className={styles.table} key={item.id}>
                            <tr>
                                <th className={styles.th}>image</th>
                                <th className={styles.th1}>product</th>
                                {item.size && <th className={styles.th2}>Size</th>}
                                <th className={styles.th2}>price</th>
                                <th className={styles.th2}>Qty</th>
                            </tr>
                            <tr>
                                <td><Image src={item.image} alt='image' width={50} height={40} /></td>
                                <td>{item.name}</td>
                                {item.size && <td>{item.size}</td>}
                                <td><span className={styles.naira}>N</span>{item.price}</td>
                                <td>{item.quantity}</td>
                            </tr>
                        </table>)}
                        <table className={styles.table}>
                            <tr>
                                <th className={styles.th2}> Address</th>
                                <th className={styles.th2}>M.O.P</th>
                                <th className={styles.th2}>delivery</th>
                                <th className={styles.th2}>price</th>
                                <th className={styles.th2}>Total</th>
                            </tr>
                            <tr>
                                <td>{order.shippingAddress.address}</td>
                                <td>{order.paymentMethod}</td>
                                <td><span className={styles.naira}>N</span>{order.shippingPrice}</td>
                                <td><span className={styles.naira}>N</span>{order.itemsPrice}</td>
                                <td><span className={styles.naira}>N</span>{order.totalPrice}</td>
                            </tr>
                        </table>
                        <button className={styles.btn} onClick={() => handleDelete(order)}>delete order</button>
                    </ul>)}
                <h2 className={styles.h1}>Total orders :<span className={styles.span}>{orders.length}</span></h2>
            </div>}
        </Layouts>
    )
}

export async function getServerSideProps() {
    await db.connect();
    const orders = await Order.find({}).lean();
    const data = JSON.stringify(orders)
    await db.disconnect();
    return {
        props: {
            data
        },
    };
}