import Image from 'next/image';
import Layouts from "../components/Layouts";
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import { useContext, useState } from 'react';
import { Store } from '../utils/Mystore';
import db from '../utils/db';
import Product from '../models/Product'
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router'
import Load from '../components/Load'

export default function Home(props) {
  const { products } = props;
  const { dispatch, state } = useContext(Store);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState()

  const addToCart = async (product, index) => {
    setLoader(index)
    closeSnackbar()
    const existItem = state.cart.cartItems.find(x => x._id === product._id);
    const quantity = existItem ? parseInt(existItem.quantity) + 1 : 1;
    const size = 41
    if (product.countInStock < quantity) {
      setLoader()
      enqueueSnackbar('Product is out of stock', { variant: 'error' });
    } else {
        if (product.category === 'slippers' || product.category === "shoes"){
          dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity, size } })
          setLoader()
        } else {
          dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity, size : '' } })
          setLoader()
        }
    }
  }

  const allProducts = () => {
    setLoading(true)
    router.push('/Main')
  }

  const clickMe =()=>{
    setLoading(true)
  }
  closeSnackbar();
  return <Layouts>
    {loading ? <Load /> : <div>
      <div className={styles.diver}>
      </div>
      <div className={styles.div}>
        <Link href='/Bags'>
          <a onClick={clickMe}>
            <div className={styles.contain}>
              <p className={styles.p}>Shop For Bags</p>
            </div>
          </a>
        </Link>
        <button onClick={allProducts} className={styles.contain5}>
          View all products
        </button>
        <Link href='/Slippers'>
          <a onClick={clickMe}>
            <div className={styles.contain1}>
            <p className={styles.p}>Shop For Slippers</p>
            </div>
          </a>
        </Link>
      </div>
      <div>
        <div className={styles.mains}>
          <div className={styles.row}>
            {products.map((product, index) =>
              <div className={styles.contains} key={product.name}>
                <Link  href={`/product/${product.slug}`} >
                  <a onClick={clickMe}>
                    <div className={styles.imagers}>
                      <Image loader={() => product.image} src={product.image} alt='image' width={150} height={200}></Image>
                    </div>
                    <p className={styles.pp1}>{product.name}</p>
                    <p className={styles.pp2}><span className={styles.span}>N</span> {product.price}</p>
                  </a>
                </Link>
                <button onClick={() => addToCart(product, index)} className= { loader === index ? styles.load : styles.btn1}> {loader === index ? 'Loading...' : 'add to cart'}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>}
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