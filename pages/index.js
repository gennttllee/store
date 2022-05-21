import Image from 'next/image';
import Layouts from "../components/Layouts";
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import {  useContext } from 'react';
import { Store } from '../utils/Mystore';
import db from '../utils/db';
import Product from '../models/Product'
import { useSnackbar } from 'notistack';
import axios from 'axios';

export default function Home(props) {
  const { products } = props;
  const { dispatch, state } = useContext(Store);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();


  const addToCart = async (product) => {
    closeSnackbar()
    const existItem = state.cart.cartItems.find(x => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
        enqueueSnackbar('Product is out of stock', { variant: 'error' });
    } else {
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
    }
}

  return <Layouts>
    <div className={styles.diver}>
    </div>
    <div className={styles.div}>
      <Link href='/Bags'>
        <a>
          <div className={styles.contain}>
            Click for bags
          </div>
        </a>
      </Link>
      <Link href='/Main'>
        <a>
          <h1 className={styles.contain5}>
            View all products
          </h1>
        </a>
      </Link>
      <Link href='/Slippers'>
        <a>
          <div className={styles.contain1}>
            Click for slippers
          </div>
        </a>
      </Link>
    </div>
    <div>
    <div className={styles.mains}>
        <div className={styles.row}>
          {products.map((product) =>
            <div className={styles.contains} key={product.name}>
              <Link href={`/product/${product.slug}`} >
                <a>
                  <div className={styles.imagers}>
                    <Image loader={()=>product.image} src={product.image} alt='image' width={200} height={250}></Image>
                  </div>
                  <p className={styles.pp1}>{product.name}</p>
                  <p className={styles.pp2}>N {product.price}</p>
                </a>
              </Link>
              <button onClick={()=> addToCart(product)} className={styles.btn1}> add to cart</button>
            </div>
          )}
        </div>
      </div>
    </div>
    {  closeSnackbar()}
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