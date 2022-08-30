import Layouts from "../../../components/Layouts";
import { database } from '../../../utils/db'
import Order from '../../../models/Order'
import { useState } from "react";
import Image from 'next/image';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import styles from '../../../styles/adminOrders.module.css'
import Load from '../../../components/Load'
import Link from 'next/link';
import User from '../../../models/User'

export default function AdminOrders({ data }) {
    const [orders, setOrders] = useState(JSON.parse(data))
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false)

    const handleDelete = async (id) => {
        setLoading(true)
        try {
            closeSnackbar()
            const {data} = await axios.delete(`/api/orders/${id}`)
            enqueueSnackbar('success', { variant: 'success' });
            setLoading(false)
            let minor = [...orders];
            minor = minor.filter(item => item._id !== data)
            setOrders(minor)
        } catch (err) {
            setLoading(false)
            enqueueSnackbar(err.response.data, { variant: 'error' });
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
                    orders.map((order, index) => <ul className={styles.ul} key={index}>
                        <h4 className={styles.li}> <span className={styles.h3}>Date :</span> {order.createdAt}</h4>
                        <h4 className={styles.li}>  <span className={styles.h3}>Order-id :</span> {order._id}</h4>
                        <h4 className={styles.li1}> <span className={styles.h3}>Customer :</span> {order.shippingAddress.full}</h4>
                        {order.orderItems.map((item, index) => <table className={styles.table} key={index}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>image</th>
                                    <th className={styles.th1}>product</th>
                                    {item.size && <th className={styles.th2}>Size</th>}
                                    <th className={styles.th2}>price</th>
                                    <th className={styles.th2}>Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><Image src={item.image} alt='image' width={50} height={40} /></td>
                                    <td>{item.name}</td>
                                    {item.size && <td>{item.size}</td>}
                                    <td><span className={styles.naira}>N</span>{item.price}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            </tbody>
                        </table>)}
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th2}> Address</th>
                                    <th className={styles.th2}>M.O.P</th>
                                    <th className={styles.th2}>delivery</th>
                                    <th className={styles.th2}>price</th>
                                    <th className={styles.th2}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{order.shippingAddress.address}</td>
                                    <td>{order.paymentMethod}</td>
                                    <td><span className={styles.naira}>N</span>{order.shippingPrice}</td>
                                    <td><span className={styles.naira}>N</span>{order.itemsPrice}</td>
                                    <td><span className={styles.naira}>N</span>{order.totalPrice}</td>
                                </tr>
                            </tbody>
                        </table>
                        <button className={styles.btn} onClick={() => handleDelete(order._id)}>delete order</button>
                    </ul>)}
                <h2 className={styles.h1}>Total orders :<span className={styles.span}>{orders.length}</span></h2>
            </div>}
        </Layouts>
    )
}

export async function getServerSideProps({ params }) {
    await database();
    const { id } = params;
    const user = await User.findById(id)
    if (!user.isAdmin) {
        return {
            notFound: true
        };
    } else {
        const orders = await Order.find({}).lean();
        const data = JSON.stringify(orders)
        return {
            props: {
                data
            },
        };
    }

}