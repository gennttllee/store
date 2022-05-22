import Card from '../components/Card';
import Layouts from "../components/Layouts";
import styles from '../styles/Home.module.css'
import db from '../utils/db';
import Product from '../models/Product'
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../utils/Mystore';
import { useSnackbar } from 'notistack';


export default function Main(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    closeSnackbar()

    const { products } = props;
    const { dispatch, state } = useContext(Store);

    const bags = products.filter(item => {
        return item.category === 'bags';
    });
    const slippers = products.filter(item => {
        return item.category === 'slippers'
    })


    const addToCart = async (product) => {
        const existItem = state.cart.cartItems.find(x => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            enqueueSnackbar('Product is out of stock', { variant: 'error' });
            closeSnackbar()
        } else {
            dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
        }
    }


    return <Layouts>
        <div>
            <h2> All Products</h2>
            <div className={styles.row}>
                {products.map((product) => <Card
                    key={product.name}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    link={`/product/${product.slug}`}
                    click={() => addToCart(product)}
                />
                )}
            </div>
            <h3>Bags</h3>
            <div className={styles.row}>
                {bags.map((product) => <Card
                    key={product.name}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    link={`/product/${product.slug}`}
                    click={() => addToCart(product)}
                />)}
            </div>
            <h3>Slippers</h3>
            <div className={styles.row}>
                {slippers.map((product) => <Card
                    key={product.name}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    link={`/product/${product.slug}`}
                    click={() => addToCart(product)}
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
