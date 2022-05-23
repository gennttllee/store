import Card from '../components/Card';
import Layouts from "../components/Layouts";
import styles from '../styles/main.module.css'
import db from '../utils/db';
import Product from '../models/Product'
import axios from 'axios';
import { useContext, useState } from 'react';
import { Store } from '../utils/Mystore';
import { useSnackbar } from 'notistack';


export default function Main(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    closeSnackbar()
    const [loading, setLoading]=useState()
    const { products } = props;
    const { dispatch, state } = useContext(Store);

    const bags = products.filter(item => {
        return item.category === 'bags';
    });
    const slippers = products.filter(item => {
        return item.category === 'slippers'
    })

    const addToCart = async (product, index) => {
        setLoading(index)
        const existItem = state.cart.cartItems.find(x => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            enqueueSnackbar('Product is out of stock', { variant: 'error' });
            closeSnackbar()
            setLoading()
        } else {
            dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
            setLoading()
        }
    }

    const addToCart1 = async (product, i) => {
        setLoading(i)
        const existItem = state.cart.cartItems.find(x => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            enqueueSnackbar('Product is out of stock', { variant: 'error' });
            closeSnackbar()
            setLoading()
        } else {
            dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
            setLoading()
        }
    }

    const addToCart2 = async (product) => {
        setLoading(product)
        const existItem = state.cart.cartItems.find(x => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            enqueueSnackbar('Product is out of stock', { variant: 'error' });
            closeSnackbar()
            setLoading()
        } else {
            dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
            setLoading()
        }
    }


    return <Layouts>
        <div>
            <h2 className={styles.h2}> All Products</h2>
            <div className={styles.main}>
                {products.map((product, index) => <Card
                    key={product.name}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    link={`/product/${product.slug}`}
                    click={() => addToCart(product, index)}
                    btn = {loading === index ? styles.load : styles.btn}
                    btnName = {loading === index ? 'Loading...' : 'add to cart'}
                />
                )}
            </div>
            <h3 className={styles.h2}>Bags</h3>
            <div className={styles.main}>
                {bags.map((product, i) => <Card
                    key={product.name}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    link={`/product/${product.slug}`}
                    click={() => addToCart1(product, i)}
                    btn = {loading === i ? styles.load : styles.btn}
                    btnName = {loading === i ? 'Loading...' : 'add to cart'}
                />)}
            </div>
            <h3 className={styles.h2}>Slippers</h3>
            <div className={styles.main}>
                {slippers.map((product) => <Card
                    key={product.name}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    link={`/product/${product.slug}`}
                    click={() => addToCart2(product)}
                    btn = {loading === product ? styles.load : styles.btn}
                    btnName = {loading === product ? 'Loading...' : 'add to cart'}
                />)}
            </div>
        </div>
    </Layouts>
};

export async function getServerSideProps() {
    await db.connect();
    const products = await Product.find({}).lean();
    await db.disconnect();
    return {
        props: {
            products: products.map(db.convertDocToObj),
        },
    };
}
