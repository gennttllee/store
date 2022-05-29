import styles from '../styles/cart.module.css'
import Layouts from '../components/Layouts';
import { useContext, useState } from 'react';
import { Store } from '../utils/Mystore';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/router';

function Cart() {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const { cart, userInfo } = state;
    let len = cart.cartItems.length
    const [loading, setLoading] = useState(false)

    const sizes = [37, 38, 39, 40, 41, 41, 42, 43, 44, 45, 46, 47]

    const upDateCart = async (item, quantity) => {
        const { data } = await axios.get(`/api/products/${item._id}`);
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
    }

    const mySize = (item, size) => {
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, size } })
    }

    const removeItem = (item) => {
        dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
    }

    const checkout = () => {
        setLoading(true)
        router.push('/Shipping');
    }


    return (
        <Layouts>
            {len < 1 ? <div className={styles.div1}>
                <span className={`material-symbols-outlined ${styles.biggy}`}>
                    production_quantity_limits
                </span>
                <h3> Cart is empty please go shopping :<Link href='/Loading'>
                    <a className={styles.anchor}>click here</a>
                </Link></h3>
            </div> : <div className={styles.div}>
                <h1 className={styles.h1}>SHOPPING CART</h1>
                {cart.cartItems.map((item) => <ul className={styles.ul} key={item._id}>
                    <table className={styles.table}>
                        <tr className={styles.tr}>
                            <th className={styles.th}> image</th>
                            <th className={styles.th1}> name</th>
                            {item.size && <th className={styles.th2}>Size</th>}
                            <th className={styles.th2}>Qty</th>
                            <th className={styles.th3}>price</th>
                        </tr>
                        <tr>
                            <td> <Image loader={() => item.image} src={item.image} alt='my' width={50} height={40} /></td>
                            <td>{item.name}</td>
                            {item.size && <td> <select value={item.size} onChange={(e) => mySize(item, e.target.value)} className={styles.select}>
                                <option value={item.size}>{item.size}</option>
                                {sizes.map(i => <option key={i.index}>{i}</option>)}
                            </select></td>}
                            <td> <select className={styles.select} onChange={(e) =>
                                upDateCart(item, parseInt(e.target.value))
                            } >
                                <option value={item.quantity} > {item.quantity}</option>
                                {[...Array(item.countInStock).keys()].map((x) => <option key={x + 1} value={x + 1}> {x + 1}</option>)}
                            </select></td>
                            <td> <span className={styles.naira}>N</span> {item.price}</td>
                        </tr>
                    </table>
                    <button className={styles.btn1} onClick={() => removeItem(item)}> remove item</button>
                </ul>)}
                <h2 className={styles.h2}>Items : {cart.cartItems.reduce((a, c) => a + c.quantity * 1, 0)} </h2>
                <h1 className={styles.h3}>Amount : <span className={styles.naira}>N</span>{cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}</h1>
                <button className={loading ? styles.load : styles.btn} onClick={checkout}>{loading ? 'Loading...' : 'Checkout'}</button>
            </div>}
        </Layouts>
    )
};

export default dynamic(() => Promise.resolve(Cart), { ssr: false })