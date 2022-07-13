import Layouts from "../components/Layouts";
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { Store } from '../utils/Mystore';
import db from '../utils/db'
import Order from '../models/Order'
import Image from 'next/image';
import Link from 'next/link';
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
            <div className={styles.home}>
                <div className={styles.child}>
                    <Link href='/Loading'>
                        <a>Home</a>
                    </Link>
                    <p>{userInfo.name} purchase history</p>
                </div>
            </div>
            <div>
                {myHistory.map((item) => <ul className={styles.li} key={item._id}>
                    <h4 className={styles.h4}><span className={styles.span}>Date : </span>{item.createdAt}</h4>
                    <h4 className={styles.h4}><span className={styles.span}>Order-id : </span>{item._id}</h4>
                    {item.orderItems.map((order) => <table className={styles.table} key={order._id}>
                        <tr>
                            <th className={styles.th}>image</th>
                            <th className={styles.th1}>name</th>
                            {order.size && <th className={styles.th2}>Size</th>}
                            <th className={styles.th2} >Qty</th>
                            <th className={styles.th3}>price</th>
                        </tr>
                        <tr>
                            <td><Image src={order.image} alt='image' width={50} height={40} /></td>
                            <td>{order.name}</td>
                            {order.size && <td>{order.size}</td>}
                            <td>{order.quantity}</td>
                            <td><span className={styles.span1}>N</span>{order.price}</td>
                        </tr>
                    </table>)}
                    <table className={styles.table}>
                        <tr className={styles.tr}>
                            <th>Mop</th>
                            <th>Delivery</th>
                            <th>items price</th>
                            <th>total</th>
                        </tr>
                        <tr>
                            <td>{item.paymentMethod}</td>
                            <td><span className={styles.span1}>N</span>{item.shippingPrice}</td>
                            <td><span className={styles.span1}>N</span>{item.itemsPrice}</td>
                            <td> <span className={styles.span1}>N</span>{item.totalPrice}</td>
                        </tr>
                    </table>
                </ul>)}
                <h2 className={styles.h1}>Total orders: <span className={styles.spanner}>{myHistory.length}</span></h2>
            </div>
        </Layouts>
    )
}

export async function getServerSideProps() {
    await db.connect();
    const orders = await Order.find({})
    const baba = JSON.stringify(orders)
    await db.disconnect();
    return {
        props: {
            baba
        },
    };
}

