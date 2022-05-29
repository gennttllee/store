import styles from '../styles/placeorder.module.css'
import Layouts from '../components/Layouts';
import { useContext, useState, useEffect } from 'react';
import { Store } from '../utils/Mystore';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import { PaystackButton } from 'react-paystack';
import emailjs from '@emailjs/browser';


function PlaceOrder() {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const { cart, userInfo } = state;
    const { cartItems, shippingAddress, paymentMethod } = cart;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (cart.paymentMethod == 'debit' || cart.paymentMethod == 'bank') {
            setVisible(true)
        } else {
            setVisible(false)
        }
    }, []);


    let orderId;
    const checkout = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post('/api/products/completed', {
                orderItems: cartItems,
                paymentMethod,
                shippingAddress,
                itemsPrice,
                totalPrice,
                shippingPrice,
            }, {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                }
            });
            orderId = data.mainOrder._id
            customerReceipt(orderId);
            adminReceipt();
            enqueueSnackbar('order successful', { variant: 'success' });
            dispatch({ type: 'CART_CLEAR' });
            Cookies.remove('cartItems');
            setLoading(false)
            router.push('/Loading')
        } catch (err) {
            setLoading(false)
            enqueueSnackbar(err.message, { variant: 'error' });
        }
    }

    useEffect(() => {
        if (!userInfo) {
            router.push('/Loading')
        }
    }, [])

    let quantity = cart.cartItems.reduce((a, c) => a + c.quantity * 1, 0)
    let shippingPrice = 1500
    let totalPrice = cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    let itemsPrice = cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    if (cart.paymentMethod === 'cash') {
        totalPrice += shippingPrice;
    } else {
        shippingPrice = 1500;
        totalPrice += shippingPrice;
    }

    const customerReceipt = (orderId) => {
        let templateParam = {
            name: shippingAddress.full,
            message: 'PURCHASE RECEIPT',
            order: orderId,
            quantity: quantity,
            itemsPrice: itemsPrice,
            telephone: shippingAddress.number,
            shippingPrice: shippingPrice,
            shippingAddress: shippingAddress.address,
            city: shippingAddress.city,
            email: userInfo.email,
            totalPrice: totalPrice,
            paymentMethod: cart.paymentMethod,
        };

        emailjs.send('service_jt5ecm8', 'template_7ac7siy', templateParam, 'mCX-8FOZiFNGyqj_7')
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
            }, function (error) {
                console.log('FAILED...', error);
            });
    }

    const adminReceipt = () => {
        let templateParams = {
            name: shippingAddress.full,
            message: 'PURCHASE RECEIPT',
            order: orderId,
            quantity: quantity,
            itemsPrice: itemsPrice,
            telephone: shippingAddress.number,
            shippingPrice: shippingPrice,
            shippingAddress: shippingAddress.address,
            city: shippingAddress.city,
            email: userInfo.email,
            totalPrice: totalPrice,
            paymentMethod: cart.paymentMethod,
        };
        emailjs.send('markwilliamz1995@gmail.c', 'template_j0u011q', templateParams, 'jyIO1gciS2IyWyp9M')
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
            }, function (error) {
                console.log('FAILED...', error);
            });
    }

    const config = {
        reference: (new Date()).getTime().toString(),
        email: userInfo.email,
        amount: totalPrice * 100,
        publicKey: 'pk_test_d6038e47dcccf5bc1f49cef108180ac78dd4b084',
    };

    const handlePaystackSuccessAction = (reference) => {
        checkout();
        console.log(reference);
    };

    const handlePaystackCloseAction = () => {
        console.log('closed')
        enqueueSnackbar('closed', { variant: 'error' });
    }

    let textMe = loading ? 'Loading...' : 'Pay Now';
    const componentProps = {
        ...config,
        text: textMe,
        onSuccess: (reference) => handlePaystackSuccessAction(reference),
        onClose: handlePaystackCloseAction,
    };

    return (
        <Layouts>
            <div className={styles.div}>
                <h1 className={styles.h1}>Order summary</h1>
                <h3 className={styles.h3}>Customer Info</h3>
                <table className={styles.table} >
                    <tr className={styles.tr}>
                        <th className={styles.th9}> full name</th>
                        <th className={styles.th2}> Telephone</th>
                        <th className={styles.th1}>address</th>
                        <th className={styles.th2}>city</th>
                    </tr>
                    <tr>
                        <td> {cart.shippingAddress.full}</td>
                        <td>{cart.shippingAddress.number}</td>
                        <td> {cart.shippingAddress.address}</td>
                        <td>{cart.shippingAddress.city}</td>
                    </tr>
                </table>
                <h3 className={styles.h3}>Payment Info</h3>
                <table className={styles.table} >
                    <tr>
                        <th className={styles.th2}>Payment Method</th>
                    </tr>
                    <tr>
                        <td>{cart.paymentMethod}</td>
                    </tr>
                </table>
                <h3 className={styles.h3}>Order info</h3>
                {cart.cartItems.map((item) => <table className={styles.table} key={item._id}>
                    <tr className={styles.tr}>
                        <th className={styles.th}> image</th>
                        <th className={styles.th1}> name</th>
                        <th className={styles.th2}>Qty</th>
                        {item.size ? <th className={styles.th2}>Size</th> : <th className={styles.th2}>Color</th>}
                        <th className={styles.th2}>price</th>
                    </tr>
                    <tr>
                        <td> <Image loader={() => item.image} src={item.image} alt='my' width={60} height={50} /></td>
                        <td>{item.name}</td>
                        <td> {item.quantity}</td>
                    {item.size ?     <td> {item.size}</td> : <td>{item.color}</td>}
                        <td> <span className={styles.naira}>N</span>{item.price}</td>
                    </tr>
                </table>)}
                <h3><span className={styles.h3}>Items</span> : {cart.cartItems.reduce((a, c) => a + c.quantity * 1, 0)} </h3>
                <h3 ><span className={styles.h3}>Amount</span> :  <span className={styles.naira}>N</span>{itemsPrice}</h3>
                <h3><span className={styles.h3}>Delivery</span> : <span className={styles.naira}>N</span>{shippingPrice}</h3>
                <h2><span className={styles.h3}>Total</span> :  <span className={styles.naira}>N</span>{totalPrice}</h2>
                {visible ? <PaystackButton
                    className={loading ? styles.load : styles.btn}
                    {...componentProps} /> : <button className={loading ? styles.load : styles.btn} onClick={checkout}>{loading ? 'Loading...' : 'Place Order'}</button>}
            </div>
        </Layouts>
    )
};

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false })