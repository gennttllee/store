import Layouts from "../components/Layouts"
import Card from '../components/Card';
import styles from '../styles/main.module.css'
import { useContext, useState, useEffect } from 'react';
import { Store } from '../utils/Mystore';
import { useSnackbar } from 'notistack';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Load from '../components/Load';
import dynamic from 'next/dynamic';

export function Favorites() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [load, setLoad] = useState()
    const { dispatch, state } = useContext(Store);
    const router = useRouter();

    const addToCart = async (product) => {
        const size = 41
        const existItem = state.cart.cartItems.find(x => x._id === product._id);
        const quantity = existItem ? parseInt(existItem.quantity) + 1 : 1;
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

    return (
        <Layouts>
            <div className={styles.home}>
                <div className={styles.child}>
                    <Link href='/Loading'>
                        <a>Home</a>
                    </Link>
                    <p>Wish Lists</p>
                </div>
            </div>
            <section className={styles.container1}>
                {state.favorites.length > 0 ? <div className={styles.float}>
                    {state.favorites.map((product, index) => load === index ? <Load key={index} /> : <Card
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
                </div> : <div className={styles.div1}>
                    <div>
                        <span className={`fa fa-heart ${styles.biggy}`}> </span>
                        <h3> Wishlist is empty please go shopping :<Link href='/Loading'>
                            <a className={styles.anchor}>click here</a>
                        </Link></h3>
                    </div>
                </div>}
            </section>
        </Layouts>
    )
}

export default dynamic(() => Promise.resolve(Favorites), { ssr: false })