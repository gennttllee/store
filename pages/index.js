import Image from 'next/image';
import Layouts from "../components/Layouts";
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import { useContext, useState} from 'react';
import { Store } from '../utils/Mystore';
import {database, convertDocToObj} from '../utils/db';
import Product from '../models/Product'
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import Card from '../components/Card';
import Load from '../components/Load';

export default function Home(props) {
  const { products } = props;
  const { dispatch, state } = useContext(Store);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter()
  const [shade, setShade] = useState()
  const [load, setLoad] = useState(false)

  const addToCart = async (product, index) => {
    closeSnackbar()
    const existItem = state.cart.cartItems.find(x => x._id === product._id);
    const quantity = existItem ? parseInt(existItem.quantity) + 1 : 1;
    const size = 41
    if (product.countInStock < quantity) {
      enqueueSnackbar('Product is out of stock', { variant: 'error' });
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

  const pained = (pains) => {
    setShade(pains)
  }

  const favorites = (product) => {
    dispatch({ type: 'ADD_FAVORITES', payload: product })
  }

  return <Layouts>
    {shade ? <div onMouseLeave={() => setShade()} className={shade ? styles.shade : styles.dies}>
      <div className={styles.center}>
        <Image src={shade.image} width={500} height={600} alt='image' />
      </div>
      <div className={styles.column}>
        <div>
          <h1>{shade.name}</h1>
          <p>{shade.description}</p>
          <p> <span className={styles.naira}>N</span>{shade.price}</p>
          <p> Color : {shade.color}</p>
          <p>Category : {shade.category}</p>
          <p>hurry up only {shade.countInStock} items left in stock</p>
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
            {shade.size && <select className={styles.select}>
              {shade.size.map((item, index) => <option className={styles.options} key={index}>{item}</option>)}
            </select>}
          </div>
          <div className={styles.dam}>
            <p className={styles.ola}>{finder(shade)}</p>
            <button className={styles.btn9} onClick={() => addToCart(shade)}>add to cart</button>
          </div>
        </div>
      </div>
    </div> : <div></div>}
    {load ? <Load /> : <div>
      <section className={styles.container}>
        <div className={styles.div}>
          <div>
            <p className={styles.features}>FEATURES</p>
            <h1 className={styles.h1}>Trendy Bags</h1>
            <h1 className={styles.h1i}>And Footwears</h1>
            <Link href='/Main'>
              <a onClick={()=> setLoad(true)} className={styles.link}>
                SHOP NOW
              </a>
            </Link>
          </div>
        </div>
        <Link href='/Bags'>
          <a onClick={()=> setLoad(true)} className={styles.div1}>
            <h1 className={styles.bags}>premium adult bags</h1>
          </a>
        </Link>
        <Link href='/Slippers'>
          <a onClick={()=> setLoad(true)} className={styles.div2}>
            <h1 className={styles.bags}>best trend slippers</h1>
          </a>
        </Link>
        <div className={styles.div3}>
          <h1 className={styles.bags}>Coming soon </h1>
        </div>
        <div className={styles.div4}>
          <h1 className={styles.bags}>Coming soon </h1>
        </div>
      </section>

      <section className={styles.container1}>
        <p className={styles.p}>New arrivals</p>
        <h1 className={styles.trendy}>Trendy bags</h1>
        <div className={styles.float}>
          {products.map((product, index) => <Card
            key={product._id}
            index={index}
            icon={`fa fa-heart ${Object.values(state.favorites).includes(product) ? styles.hate : styles.heart}`}
            link={`/product/${product.slug}`}
            image={product.image}
            name={product.name}
            clickedMe={() => favorites(product)}
            shadow={() => pained(product)}
            pain={finder(product)}
            price={product.price}
            size={product.size}
            click={() => addToCart(product, index)}
          />)}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container3}>
          <h1 className={styles.foot}>unique footwears</h1>
          <h2 className={styles.fancy}>Be trendy and fancy with slides by ego</h2>
          <Link href='/Main'>
            <a onClick={()=> setLoad(true)} className={styles.link1}>shop now</a>
          </Link>
        </div>
        <div className={styles.container4}>
          <h1 className={styles.foot}>unique footwears</h1>
          <h2 className={styles.fancy1}>Be trendy and fancy with slides by ego</h2>
          <Link href='/Main'>
            <a onClick={()=>setLoad(true)} className={styles.link1}>shop now</a>
          </Link>
        </div>
        <div className={styles.container5}>
          <h1 className={styles.foot}>unique footwears</h1>
          <h2 className={styles.fancy1}>Be trendy and fancy with slides by ego</h2>
          <Link href='/Main'>
            <a onClick={()=> setLoad(true)} className={styles.link1}>shop now</a>
          </Link>
        </div>
      </section>
    </div>}
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