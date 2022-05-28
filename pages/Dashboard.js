import Layouts from "../components/Layouts";
import { useContext, useLayoutEffect, useState } from 'react';
import { Store } from '../utils/Mystore';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
import db from '../utils/db';
import Product from '../models/Product'
import styles from '../styles/dashboard.module.css'
import { useSnackbar } from 'notistack';
import Load from '../components/Load';

export default function Dashboard(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { products } = props;
    const router = useRouter();
    const { state, dispatch } = useContext(Store)
    const { userInfo } = state;
    const [loading, setLoading] = useState(false)
    useLayoutEffect(() => {
        if (!userInfo) {
            router.push('/Login')
        } else if (state.userInfo.isAdmin === false) {
            router.push('/History')
        }
    })

    const handleDelete = async (product) => {
        setLoading(true)
        try {
            closeSnackbar();
            await axios.post('/api/products/remover', { product })
            setLoading(false)
            enqueueSnackbar('successful', { variant: 'success' });
            router.push('/Dashboard')
        } catch (err) {
            setLoading(false)
            enqueueSnackbar(err, { variant: 'error' });
        }
    }

    const producer = () => {
        router.push('/AddProducts')
    }

    return (
        <Layouts>
            {loading ? <Load /> : <div>
                <h1 className={styles.h1}>Dashboard</h1>
                <button className={styles.btn} onClick={producer}>add products</button>
                {products.map((product) => <ul className={styles.table} key={product._id}>
                    <table>
                        <tr>
                            <th className={styles.th1}>image</th>
                            <th className={styles.th2}> name</th>
                            <th className={styles.th3}> slug</th>
                            <th className={styles.th4}>qty</th>
                            <th className={styles.th5}>price</th>
                        </tr>
                        <tr>
                            <td>
                                <Image src={product.image} alt='image' width={47} height={40} />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.slug}</td>
                            <td>{product.countInStock}</td>
                            <td><span className={styles.naira}>N</span>{product.price}</td>
                        </tr>
                    </table>
                        <button className={styles.btn1} onClick={() => handleDelete(product)}>delete product</button>
                </ul>)}
            </div>}
        </Layouts>
    )
}

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