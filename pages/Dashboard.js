import Layouts from "../components/Layouts";
import { useContext, useLayoutEffect } from 'react';
import { Store } from '../utils/Mystore';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
import db from '../utils/db';
import Product from '../models/Product'
import styles from '../styles/dashboard.module.css'
import { useSnackbar } from 'notistack';


export default function Dashboard(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { products } = props;
    const router = useRouter();
    const { state, dispatch } = useContext(Store)
    const {userInfo} = state;
    useLayoutEffect(() => {
        if (!userInfo) {
            router.push('/Login')
        } else if (state.userInfo.isAdmin === false) {
            router.push('/History')
        }
    },)

    const handleDelete = async (product) => {
        try {
            closeSnackbar();
            await axios.post('/api/products/remover', { product })
            window.location.reload(false);
            enqueueSnackbar('successful', { variant: 'error' });
        } catch (err) {
            enqueueSnackbar(err, { variant: 'error' });
        }
    }

    const producer =()=>{
        router.push('/AddProducts')
    }

    return (
        <Layouts>
            <div>
                <h1 className={styles.h1}>Dashboard</h1>
                <button className={styles.btn} onClick={producer}>add products</button>
                {products.map((product) => <table className={styles.table} key={product._id}>
                    <tr>
                        <th className={styles.th1}>image</th>
                        <th className={styles.th2}> name</th>
                        <th className={styles.th3}> slug</th>
                        <th className={styles.th4}>qty</th>
                        <th className={styles.th4}>price</th>
                        <th className={styles.td}>action</th>
                    </tr>
                    <tr>
                        <td>
                            <Image src={product.image} alt='image' width={60} height={50} />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.slug}</td>
                        <td>{product.countInStock}</td>
                        <td>{product.price}</td>
                        <td><button className={styles.btn1} onClick={() => handleDelete(product)}>x</button></td>
                    </tr>
                </table>)}
            </div>
        </Layouts>
    )
}

export async function getServerSideProps() {
    db.connect();
    const products = await Product.find({}).lean();
    db.disconnect();
    return {
        props: {
            products: products.map(db.convertDocToObj),
        },
    };
}