import Layouts from "../components/Layouts";
import db from '../utils/db'
import Order from '../models/Order'
import { useEffect, useContext } from "react";
import Image from 'next/image';
import {Store} from '../utils/Mystore';
import {useRouter} from 'next/router';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import styles from '../styles/adminOrders.module.css'


export default function AdminOrders(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();
    const {state} = useContext(Store);
    const {userInfo} = state;
    const { data } = props;
    const orders = JSON.parse(data);

    useEffect(() => {
        if (!userInfo){
            router.push('/Loading')
        } else if (!userInfo.isAdmin ){
            router.push('/Loading')
        }
    }, [userInfo]);


        const handleDelete = async (order) => {
            try {
                closeSnackbar()
                await axios.post('/api/orders/remover', { order })
                window.location.reload(false);
                enqueueSnackbar('successful', { variant: 'success' });
            } catch (err) {
                enqueueSnackbar(err, { variant: 'error' });
            }
        }

    return (
        <Layouts>
            <div>
                <h1 className={styles.h1}>Order History</h1>
                {orders.length < 1 ? <h1>no orders yet</h1> :
                orders.map((order) => <ul className={styles.ul} key={order.id}>
                    <li>{order.createdAt}</li>
                    <ul>
                        <h3> <span className={styles.h3}>Customer :</span> {order.shippingAddress.full}</h3>
                        {order.orderItems.map((item) => <table className={styles.table} key={item.id}>
                            <tr>
                                <th className={styles.th}>image</th>
                                <th className={styles.th1}>product</th>
                                <th className={styles.th2}>price</th>
                                <th className={styles.th2}>quantity</th>
                            </tr>
                            <tr>
                                <td><Image src={item.image} alt='image' width={70} height={50} /></td>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{item.quantity}</td>
                            </tr>
                        </table>)}
                    </ul>
                    <table className={styles.table}>
                    <tr>
                                <th className={styles.th2}> Address</th>
                                <th className={styles.th2}>M.O.P</th>
                                <th className={styles.th2}>delivery</th>
                                <th className={styles.th2}>items price</th>
                                <th className={styles.th2}>Total</th>
                                <th className={styles.th4} >action</th>
                            </tr>
                            <tr>
                                <td>{order.shippingAddress.address}</td>
                                <td>{order.paymentMethod}</td>
                                <td>{order.shippingPrice}</td>
                                <td>{order.itemsPrice}</td>
                                <td>{order.totalPrice}</td>
                                <td><button className={styles.btn} onClick={() => handleDelete(order)}>X</button></td>
                            </tr>
                    </table>
                </ul>)}
                <h2 className={styles.h1}>Total orders :<span className={styles.span}>{orders.length}</span></h2>
            </div>
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