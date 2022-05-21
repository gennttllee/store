import Layouts from '../../components/Layouts';
import Image from 'next/image';
import styles from '../../styles/slug.module.css';
import Link from 'next/link';
import db from '../../utils/db';
import Product from '../../models/Product';
import { Store } from '../../utils/Mystore';
import {useContext} from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';


export default function ProductScreen(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let router = useRouter();;
    const {dispatch, state} = useContext(Store);
    const {product, products} = props;
    let stock = '';

    if (!product) {
        return <div>Product not found</div>
    } if (product.countInStock > 0) {
        stock = 'In-stock'
    } else {
        stock = 'out-of-stock'
        window.alert('out of stock')
    }

    const addToCart = async ()=>{
        const {data} = await axios.get(`/api/products/${product._id}`);
        const existItem = state.cart.cartItems.find(x => x._id === product._id);
        const quantity = existItem ?  existItem.quantity + 1 : 1;
        if (data.countInStock < quantity) {
            enqueueSnackbar(' Out of stock', {variant: 'error'} );
        } else {
            dispatch({type : 'CART_ADD_ITEM', payload : {...product, quantity}})
            router.push('/Cart')
        }
    }

    console.log(product.image)
    return (
        <Layouts title={product.name}>
        <h1 className={styles.product}>PRODUCT INFO</h1>
            <div className={styles.container}>
                <div className={styles.img}>
                    <Image loader={()=>product.image} src={product.image} alt='image' width={200} height={250}></Image>
                </div>
                <div className={styles.floater}>
                    <h3 className={styles.h3}>{product.name}</h3>
                    <p> PRICE :  N{product.price}</p>
                    <p> DESCRIPTION : {product.description}</p>
                    <p> SEX : {product.gender}</p>
                    <p> CATEGORY : {product.category}</p>
                    <p>STATUS : {stock}</p>
                    <p> RATINGS : {product.ratings} <span>REVIEWS : {product.numOfReviews}</span></p>
                    <button onClick={addToCart}  className={styles.btn}>add to cart</button>
                </div>
            </div>
            <div className={styles.main}>
                <h2 className={styles.h2}>You may also like :</h2>
                <div className={styles.row}>
                    {products.map((product) =>
                        <div className={styles.contain} key={product.name}>
                            <Link href={`/product/${product.slug}`} >
                                <a>
                                    <div className={styles.image}>
                                        <Image loader={()=>product.image} src={product.image} alt='image' width={200} height={250}></Image>
                                    </div>
                                    <p className={styles.p1}>{product.name}</p>
                                    <p className={styles.p2}>N {product.price}</p>
                                </a>
                            </Link>
                            <button onClick={addToCart} className={styles.btn1}> add to cart</button>
                        </div>
                    )}
                </div>
            </div>
        </Layouts>
    )
}

export async function getServerSideProps(context) {
    const {params} = context;
    const {slug} = params;
    db.connect();
    const product = await Product.findOne({slug}).lean();
    const products = await Product.find({}).lean();
    db.disconnect();
    return {
        props: {
            product: db.convertDocToObj(product),
            products: products.map(db.convertDocToObj),
        },
    };
}
