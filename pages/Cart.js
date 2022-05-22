import styles from '../styles/cart.module.css'
import Layouts from '../components/Layouts';
import { useContext } from 'react';
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

    const upDateCart = async (item, quantity) => {
        const { data } = await axios.get(`/api/products/${item._id}`);
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
    }

    const removeItem = (item) => {
        dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
    }

    const checkout = () => {
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
                {cart.cartItems.map((item) => <table className={styles.table} key={item._id}>
                    <tr className={styles.tr}>
                        <th className={styles.th}> image</th>
                        <th className={styles.th1}> name</th>
                        <th className={styles.th2}>Qty</th>
                        <th className={styles.th2}>price</th>
                        <th className={styles.th2}>action</th>
                    </tr>
                    <tr>
                        <td> <Image loader={()=>item.image} src={item.image} alt='my' width={70} height={50} /></td>
                        <td>{item.name}</td>
                        <td> <select className={styles.select} onChange={(e) =>
                            upDateCart(item, e.target.value)
                        } >
                            <option value={item.quantity} > {item.quantity}</option>
                            {[...Array(item.countInStock).keys()].map((x) => <option key={x + 1} value={x + 1}> {x + 1}</option>)}
                        </select></td>
                        <td>{item.price}</td>
                        <button className={styles.btn1} onClick={() => removeItem(item)}> del</button>
                    </tr>
                </table>)}
                <h2 className={styles.h2}>Items : {cart.cartItems.reduce((a, c) => a + c.quantity * 1, 0)} </h2>
                <h1 className={styles.h3}>Amount : N{cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}</h1>
                <button className={styles.btn} onClick={checkout}>Checkout</button>
            </div>}
        </Layouts>
    )
};

export default dynamic(() => Promise.resolve(Cart), { ssr: false })