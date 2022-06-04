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
import Load from '../../components/Load';


export default function ProductScreen(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    let router = useRouter();
    const { dispatch, state } = useContext(Store);
    const { product, products } = props;
    const [loader, setLoader] = useState()
    const [loading, setLoading] = useState()
    const [load, setLoad] = useState(false)
    const [show, setShow] = useState(false)
    const [size, setSize] = useState()
    let stock = '';

    useEffect(() => {
        if (load === true) {
            setLoad(false)
        }
    }, [router.query]);

    if (!product) {
        return <div>Product not found</div>
    } if (product.countInStock > 0) {
        stock = 'In-stock'
    } else {
        stock = 'out-of-stock'
        window.alert('out of stock')
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

    const toCart = async (product, index) => {
        setLoader(index)
        closeSnackbar()
        const size =41
        const existItem = state.cart.cartItems.find(x => x._id === product._id);
        const quantity = existItem ? parseInt(existItem.quantity) + 1 : 1;
        if (product.countInStock < quantity) {
            setLoader()
            enqueueSnackbar('Product is out of stock', { variant: 'error' });
        } else {
            if (product.category === 'slippers' || product.category === "shoes") {
                dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity, size } })
                setLoader()
            } else {
                dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity, size: '' } })
                setLoader()
            }
        }
    }

    const clickMe = () => {
        setLoad(true)
    }

    const mySize = (e) => {
        setSize(e.target.value)
    }
    

    return (
        <Layouts title={product.name}>
            {show ? <div className={styles.show}>
                <button className={styles.back} onClick={() => setShow(false)}>back</button>
                <Image loader={() => product.image} src={product.image} alt='image' width={500} height={600}></Image>
            </div> : <div>
                <h1 className={styles.product}>PRODUCT INFO</h1>
                <div className={styles.container}>
                    <div onClick={() => setShow(true)} className={styles.img}>
                        <Image loader={() => product.image} src={product.image} alt='image' width={200} height={250}></Image>
                    </div>
                    <div className={styles.floater}>
                        <table className={styles.table}>
                            <tr className={styles.tr}>
                                <th className={styles.th}>NAME</th>
                                <td className={styles.td}>{product.name}</td>
                            </tr>
                            <tr>
                                <th className={styles.th}>PRICE</th>
                                <td className={styles.td}><span className={styles.span}>N</span>{product.price}</td>
                            </tr>
                            <tr>
                                <th className={styles.th}>COLOR</th>
                                <td className={styles.td}>{product.color}</td>
                            </tr>
                            <tr>
                                <th className={styles.th}>DESCRIPTION</th>
                                <td className={styles.td}>{product.description}</td>
                            </tr>
                            <tr>
                                <th className={styles.th}>SEX</th>
                                <td className={styles.td}>{product.gender}</td>
                            </tr>
                            {product.size.length > 1  &&  <tr>
                                <th className={styles.th}>SIZE</th>
                                {product.size.length > 1 && <td className={styles.td}>
                                    <select className={styles.select} onChange={mySize}>
                                        {product.size.map(item => <option key={item.index}>{item}</option>)}
                                    </select>
                                </td>}
                            </tr>}
                            <tr>
                                <th className={styles.th}>CATEGORY</th>
                                <td className={styles.td}>{product.category}</td>
                            </tr>
                            <tr>
                                <th className={styles.th}>STATUS</th>
                                <td className={styles.td}>{stock}</td>
                            </tr>
                        </table>
                        <button onClick={() => addToCart(product)} className={loading ? styles.loading : styles.btn}>{loading ? 'Loading...' : 'add to cart'}</button>
                    </div>
                </div>
                <div className={styles.main}>
                    <h2 className={styles.h2}>You may also like :</h2>
                    {load ? <Load /> : <div className={styles.row}>
                        {products.map((product, index) =>
                            <div className={styles.contain} key={product.name}>
                                <Link href={`/product/${product.slug}`} >
                                    <a onClick={clickMe}>
                                        <div className={styles.image}>
                                            <Image loader={() => product.image} src={product.image} alt='image' width={200} height={250}></Image>
                                        </div>
                                        <p className={styles.p1}>{product.name}</p>
                                        <p className={styles.p2}> <span className={styles.span}>N</span> {product.price}</p>
                                    </a>
                                </Link>
                                <button onClick={() => toCart(product, index)} className={loader === index ? styles.load : styles.btn1}> {loader === index ? 'Loading...' : 'add to cart'}</button>
                            </div>
                        )}
                    </div>}
                </div>
            </div>}
        </Layouts>
    )
}

export async function getServerSideProps(context) {
    const { params } = context;
    const { slug } = params;
    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    const products = await Product.find({}).lean();
    await db.disconnect();
    return {
        props: {
            product: db.convertDocToObj(product),
            products: products.map(db.convertDocToObj),
        },
    };
}
