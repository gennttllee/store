import Card from '../components/Card';
import Layouts from "../components/Layouts";
import styles from '../styles/main.module.css'
import { database, convertDocToObj } from '../utils/db';
import Product from '../models/Product'
import { useContext, useState } from 'react';
import { Store } from '../utils/Mystore';
import { useSnackbar } from 'notistack';
import Link from 'next/link';
import Load from '../components/Load';
import { useRouter } from 'next/router';

export default function Slippers(props) {
    const router = useRouter();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const { products } = props;
    const { dispatch, state } = useContext(Store);
    const [load, setLoad] = useState()

    const slippers = products.filter(item => {
        return item.category === 'slippers'
    })

    const addToCart = async (product, index) => {
        setLoading(index)
        const existItem = state.cart.cartItems.find(x => x._id === product._id);
        const quantity = existItem ? parseInt(existItem.quantity) + 1 : 1;
        const size = 41
        if (product.countInStock < quantity) {
            enqueueSnackbar('Product is out of stock', { variant: 'error' });
            closeSnackbar()
        } else {
            if (product.category === 'slippers' || product.category === "shoes") {
                dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity, size } })
            } else {
                dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity, size: '' } })
            }
        }
    }

    const finder = (product) => {
        const req = state.cart.cartItems.find(item => {
            return item._id === product._id
        })

        if (req) {
            return req.quantity
        } else {
            return 0;
        }
    }

    const favorites = (product) => {
        dispatch({ type: 'ADD_FAVORITES', payload: product })
    }

    const pained = (product, index) => {
        setLoad(index)
        router.push(`/product/${product.slug}`)
    }


    return <Layouts title='Slippers'>
        <div className={styles.home}>
            <div className={styles.child}>
                <Link href='/Loading'>
                    <a>Home</a>
                </Link>
                <p>Slippers</p>
            </div>
        </div>
        <section className={styles.container1}>
            <div className={styles.float}>
                {slippers.map((product, index) => load === index ? <Load key={index} /> : <Card
                    key={product._id}
                    index={index}
                    icon={`fa fa-heart ${Object.values(state.favorites).includes(product) ? styles.hate : styles.heart}`}
                    link={`/product/${product.slug}`}
                    image={product.image}
                    name={product.name}
                    clickedMe={() => favorites(product)}
                    shadow={() => pained(product, index)}
                    pain={finder(product)}
                    price={product.price}
                    size={product.size}
                    click={() => addToCart(product, index)}
                />)}
            </div>
        </section>
    </Layouts>
};

export async function getServerSideProps() {
    await database();
    const products = await Product.find({}).lean();
    return {
        props: {
            products: products.map(convertDocToObj),
        },
    };
}
