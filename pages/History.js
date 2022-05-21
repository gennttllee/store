import Layouts from "../components/Layouts";
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { Store } from '../utils/Mystore';
import db from '../utils/db'
import Order from '../models/Order'
import Image from 'next/image';
import styles from '../styles/history.module.css'

export default function History(props) {
    const router = useRouter();
    const { state, dispatch } = useContext(Store)
    const { userInfo } = state;
    useEffect(() => {
        if (!userInfo.name) {
            router.push('/Login')
        }
    }, []);

    const { baba } = props;
    const orders = JSON.parse(baba)
    const myHistory = orders.filter(item => item.user === userInfo._id)
    console.log(myHistory)
    return (
        <Layouts>
            <div>
                <h1 className={styles.h1}>HISTORY</h1>
                {myHistory.map((item) => <ul key={item._id}>
                    <li className={styles.li}>
                        {item.orderItems.map((order) => <table className={styles.table} key={order._id}>
                            <tr>
                                <th className={styles.th}>image</th>
                                <th className={styles.th1}>name</th>
                                <th className={styles.th2} >Quantity</th>
                                <th className={styles.th2}>price</th>
                            </tr>
                            <tr>
                                <td><Image src={order.image} alt='image' width={60} height={40} /></td>
                                <td>{order.name}</td>
                                <td>{order.quantity}</td>
                                <td>{order.price}</td>
                            </tr>
                        </table>)}
                        <table className={styles.table}>
                            <tr className={styles.tr}>
                                <th>Date</th>
                                <th>Mop</th>
                                <th>Delivery</th>
                                <th>items price</th>
                                <th>total</th>
                            </tr>
                            <tr>
                                <td> {item.createdAt}</td>
                                <td>{item.paymentMethod}</td>
                                <td>{item.shippingPrice}</td>
                                <td>{item.itemsPrice}</td>
                                <td> {item.totalPrice}</td>
                            </tr>
                        </table>
                    </li>
                </ul>)}
                <h2 className={styles.h1}>Total orders: <span className={styles.spanner}>{myHistory.length}</span></h2>
            </div>
        </Layouts>
    )
}

export async function getServerSideProps() {
    db.connect();
    const orders = await Order.find({})
    const baba = JSON.stringify(orders)
    db.disconnect();
    return {
        props: {
            baba
        },
    };
}

