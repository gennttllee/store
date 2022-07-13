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
    const [visible, setVisible] = useState();
    const [load, setLoad] = useState(false)

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

    const selectMe = (item) => {
        setVisible(item.image);
        setLoad(true)
    }


    return (
        <Layouts>
            <div className={styles.home}>
                <div className={styles.child}>
                    <Link href='/Loading'>
                        <a>Home</a>
                    </Link>
                    <p>Shopping Cart</p>
                </div>
            </div>
            {len < 1 ? <div className={styles.div1}>
                <div>
                    <span className={`fa fa-shopping-cart ${styles.biggy}`}> </span>
                    <h3> Cart is empty please go shopping :<Link href='/Loading'>
                        <a className={styles.anchor}>click here</a>
                    </Link></h3>
                </div>
            </div> : <div className={styles.div}>
                <h1 className={styles.h5}>Shopping Cart</h1>
                {load ? <div>
                    <button className={styles.back} onClick={() => setLoad(false)}>back</button>
                    <Image loader={() => visible} src={visible} alt='image' width={500} height={600}></Image>
                </div> : <div className={styles.container}>
                    {cart.cartItems.map((item) => <ul className={styles.ul} key={item._id}>

                        <div className={styles.images}>
                            <div onClick={() => selectMe(item)}> <Image src={item.image} alt='my' width={200} height={150} /></div>
                            <div className={styles.tiny}>
                                <div>
                                    <h2 className={styles.h1}>{item.name}</h2>
                                    <div className={styles.flex}>
                                        <p className={styles.color}>Size :</p>
                                        <select value={item.size} onChange={(e) => mySize(item, e.target.value)} className={styles.select}>
                                            <option className={styles.options} value={item.size}>{item.size}</option>
                                            {sizes.map(i => <option className={styles.options} key={i.index}>{i}</option>)}
                                        </select>
                                    </div>
                                    <div className={styles.flex}>
                                        <p className={styles.color}>Quantity</p>
                                        <select className={styles.select} onChange={(e) =>
                                            upDateCart(item, parseInt(e.target.value))
                                        } >
                                            <option className={styles.options} value={item.quantity} > {item.quantity}</option>
                                            {[...Array(item.countInStock).keys()].map((x) => <option className={styles.options} key={x + 1} value={x + 1}> {x + 1}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.para}>
                                    <p className={styles.color}>Color:<span className={styles.span1}>{item.color}</span></p>
                                    <p className={styles.color}> Price <span className={styles.naira}>N</span>{item.price}</p>
                                    <p className={styles.color}>Total : <span className={styles.naira}>N</span>{item.price * item.quantity}</p>
                                </div>
                            </div>
                        </div>
                        <button className={styles.btn1} onClick={() => removeItem(item)}> X</button>
                    </ul>)}
                </div>}
                <p className={styles.h2}>Items : {cart.cartItems.reduce((a, c) => a + c.quantity * 1, 0)} </p>
                <p className={styles.h3}>Amount : <span className={styles.naira}>N</span>{cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}</p>
                <button className={loading ? styles.load : styles.btn} onClick={checkout}>{loading ? 'Loading...' : 'Checkout'}</button>
            </div>}
        </Layouts>
    )
};

export default dynamic(() => Promise.resolve(Cart), { ssr: false })