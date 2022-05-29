import Card from '../components/Card';
import Layouts from "../components/Layouts";
import styles from '../styles/main.module.css'
import db from '../utils/db';
import Product from '../models/Product'
import { useContext, useState } from 'react';
import { Store } from '../utils/Mystore';
import { useSnackbar } from 'notistack';


export default function Bags(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    closeSnackbar()
    const { products } = props;
    const { dispatch, state } = useContext(Store);
    const [loading, setLoading] = useState()

    const bags = products.filter(item => {
        return item.category === 'bags';
    });

    const addToCart = async (product, index) => {
        setLoading(index)
        const existItem = state.cart.cartItems.find(x => x._id === product._id);
        const quantity = existItem ? parseInt(existItem.quantity) + 1 : 1;
        const size = 41
        if (product.countInStock < quantity) {
            enqueueSnackbar('Product is out of stock', { variant: 'error' });
            closeSnackbar()
            setLoading()
        } else {
            if (product.category === 'slippers' || product.category === "shoes") {
                dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity, size } })
                setLoading()
            } else {
                dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity, size: '' } })
                setLoading()
            }
        }
    }


    return <Layouts>
        <div>
            <h3 className={styles.h2}>Bags</h3>
            <div className={styles.main}>
                {bags.map((product, index) => <Card
                    key={product.name}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    link={`/product/${product.slug}`}
                    click={() => addToCart(product, index)}
                    btn={loading === index ? styles.load : styles.btn}
                    btnName={loading === index ? 'Loading...' : 'add to cart'}
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
