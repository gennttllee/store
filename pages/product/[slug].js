import Layouts from '../../components/Layouts';
import Image from 'next/image';
import styles from '../../styles/slug.module.css';
import Link from 'next/link';
import db from '../../utils/db';
import Product from '../../models/Product';
import { Store } from '../../utils/Mystore';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';


export default function ProductScreen(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    let router = useRouter();
    const { dispatch, state } = useContext(Store);
    const { product } = props;
    const [loader, setLoader] = useState()
    const [loading, setLoading] = useState()
    const [show, setShow] = useState(false)
    const [size, setSize] = useState()
    let stock = '';


    if (!product) {
        return <div>Product not found</div>
    } if (product.countInStock > 0) {
        stock = 'In-stock'
    } else {
        stock = 'out-of-stock'
        enqueueSnackbar(' Out of stock', { variant: 'error' });
    }

    const addToCart = async (product) => {
        setLoading(true)
        const existItem = state.cart.cartItems.find(x => x._id === product._id);
        const quantity = existItem ? parseInt(existItem.quantity) + 1 : 1;
        if (product.countInStock < quantity) {
            setLoading(false)
            enqueueSnackbar(' Out of stock', { variant: 'error' });
        } else {
            if (product.category === 'slippers' || product.category === "shoes") {
                dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity, size } })
                setLoading(false)
            } else {
                dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity, size: '' } })
                setLoading(false)
            }
        }
    }

    const clickMe = () => {
        setLoad(true)
    }

    const mySize = (e) => {
        setSize(e.target.value)
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


    return (
        <Layouts title={product.name}>
            <div className={styles.home}>
                <div className={styles.child}>
                    <Link href='/Loading'>
                        <a>Home</a>
                    </Link>
                    <p>{product.name}</p>
                </div>
            </div>
            <div className={styles.shade}>
                <div className={styles.center}>
                    <Image src={product.image} width={500} height={600} alt='image' />
                </div>
                <div className={styles.column}>
                    <div>
                        <h1 className={styles.h1}>{product.name}</h1>
                        <p>{product.description}</p>
                        <p> <span className={styles.naira}>N</span>{product.price}</p>
                        <p> Color : {product.color}</p>
                        <p>Category : {product.category}</p>
                        <p>hurry up only {product.countInStock} items left in stock</p>
                        <div>
                            <span className={`fa-brands fa-instagram ${styles.icon3}`}></span>
                            <span className={`fa-brands fa-facebook ${styles.icon4}`}></span>
                            <span className={`fa-brands fa-twitter ${styles.icon5}`}></span>
                            <span className={`fa-brands fa-whatsapp ${styles.icon6}`}></span>
                        </div>

                    </div>
                    <div>
                        <div className={styles.flex}>
                            <p>Size :</p>
                            {product.size && <select className={styles.select}>
                                {product.size.map((item, index) => <option className={styles.options} key={index}>{item}</option>)}
                            </select>}
                        </div>
                        <div className={styles.dam}>
                            <p className={styles.ola}>{finder(product)}</p>
                            <button className={styles.btn9} onClick={() => addToCart(product)}>add to cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layouts>
    )
}

export async function getServerSideProps(context) {
    const { params } = context;
    const { slug } = params;
    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect();
    return {
        props: {
            product: db.convertDocToObj(product),
        },
    };
}
