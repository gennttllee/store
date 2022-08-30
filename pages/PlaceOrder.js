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
import Link from 'next/link';


function PlaceOrder() {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const { cart, userInfo } = state;
    const { cartItems, shippingAddress, paymentMethod } = cart;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const emailId = process.env.NEXT_PUBLIC_EMAIL_ID
    const templateId = process.env.NEXT_PUBLIC_TEMPLATE_ID
    const emailKey = process.env.NEXT_PUBLIC_EMAIL_KEY
    const egoId = process.env.NEXT_PUBLIC_EGO_ID
    const egoTemplate = process.env.NEXT_PUBLIC_EGO_TEMPLATE
    const egoService = process.env.NEXT_PUBLIC_EGO_SERVICE
    const paystack = process.env.NEXT_PUBLIC_PAYSTACK

    useEffect(() => {
        if (cart.paymentMethod == 'debit' || cart.paymentMethod == 'bank') {
            setVisible(true)
        } else {
            setVisible(false)
        }
    }, [cart.paymentMethod]);


    let orderId;
    const checkout = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post('/api/orders', {
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
            orderId = data._id
            customerReceipt(orderId);
            adminReceipt();
            enqueueSnackbar('order successful', { variant: 'success' });
            dispatch({ type: 'CART_CLEAR' });
            Cookies.remove('cartItems');
            setLoading(false)
            router.push('/Loading')
        } catch (error) {
            setLoading(false)
            enqueueSnackbar(error.response.data, { variant: 'error' });
        }
    }

    useEffect(() => {
        if (!userInfo) {
            router.push('/Loading')
        }
    }, [router, userInfo]);

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

        emailjs.send(egoId, egoTemplate, templateParam, egoService)
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
        emailjs.send(emailId, templateId, templateParams, emailKey)
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
        publicKey: paystack,
    };

    const handlePaystackSuccessAction = (reference) => {
        checkout();
    };

    const handlePaystackCloseAction = () => {
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
            <div className={styles.home}>
                <div className={styles.child}>
                    <Link href='/Loading'>
                        <a>Home</a>
                    </Link>
                    <p>Order Summary</p>
                </div>
            </div>
            <div className={styles.div}>
                <h1 className={styles.h1}>Order summary</h1>
                <h3 className={styles.h2}>Customer Info</h3>
                <table className={styles.table} >
                    <thead>
                        <tr className={styles.tr}>
                            <th className={styles.th9}> full name</th>
                            <th className={styles.th2}> Telephone</th>
                            <th className={styles.th1}>address</th>
                            <th className={styles.th2}>city</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td> {cart.shippingAddress.full}</td>
                            <td>{cart.shippingAddress.number}</td>
                            <td> {cart.shippingAddress.address}</td>
                            <td>{cart.shippingAddress.city}</td>
                        </tr>
                    </tbody>
                </table>

                <h3 className={styles.h2}>Payment Info</h3>
                <table className={styles.table} >
                    <thead>
                        <tr>
                            <th className={styles.th2}>Payment Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{cart.paymentMethod}</td>
                        </tr>
                    </tbody>
                </table>
                <h3 className={styles.h2}>Order info</h3>
                {cart.cartItems.map((item) => <table className={styles.table} key={item._id}>
                    <thead>
                        <tr className={styles.tr}>
                            <th className={styles.th}> image</th>
                            <th className={styles.th1}> name</th>
                            <th className={styles.th2}>Qty</th>
                            {item.size ? <th className={styles.th2}>Size</th> : <th className={styles.th2}>Color</th>}
                            <th className={styles.th2}>price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td> <Image src={item.image} alt='my' width={60} height={50} /></td>
                            <td>{item.name}</td>
                            <td> {item.quantity}</td>
                            {item.size ? <td> {item.size}</td> : <td>{item.color}</td>}
                            <td> <span className={styles.naira}>N</span>{item.price}</td>
                        </tr>
                    </tbody>
                </table>)}
                <h3 className={styles.h3}> Items : {cart.cartItems.reduce((a, c) => a + c.quantity * 1, 0)} </h3>
                <h3 className={styles.h3}>Amount :  <span className={styles.naira}>N</span>{itemsPrice}</h3>
                <h3 className={styles.h3}> Delivery : <span className={styles.naira}>N</span>{shippingPrice}</h3>
                <h2 className={styles.h3}> Total :  <span className={styles.naira}>N</span>{totalPrice}</h2>
                {visible ? <PaystackButton
                    className={loading ? styles.load : styles.btn}
                    {...componentProps} /> : <button className={loading ? styles.load : styles.btn} onClick={checkout}>{loading ? 'Loading...' : 'Place Order'}</button>}
            </div>
        </Layouts>
    )
};

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false })