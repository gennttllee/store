import Layouts from "../../../components/Layouts";
import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
import { database, convertDocToObj } from '../../../utils/db';
import Product from '../../../models/Product'
import styles from '../../../styles/dashboard.module.css'
import { useSnackbar } from 'notistack';
import Load from '../../../components/Load';
import User from "../../../models/User";

export default function Dashboard({ products }) {
    const [allProducts, setAllProducts] = useState(products)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    const handleDelete = async (id) => {
        setLoading(true)
        try {
            closeSnackbar();
            const { data } = await axios.delete(`/api/products/${id}`)
            setLoading(false)
            let minor = [...allProducts]
            minor = minor.filter(items => items._id !== data);
            setAllProducts(minor);
            enqueueSnackbar('successful', { variant: 'success' });
        } catch (error) {
            setLoading(false)
            enqueueSnackbar(error.response.data, { variant: 'error' });
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
                {allProducts.map((product) => <ul className={styles.table} key={product._id}>
                    <table>
                        <thead>
                            <tr>
                                <th className={styles.th1}>image</th>
                                <th className={styles.th2}> name</th>
                                <th className={styles.th5}>Color</th>
                                <th className={styles.th4}>qty</th>
                                <th className={styles.th5}>price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <Image src={product.image} alt='image' width={47} height={40} />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.color}</td>
                                <td>{product.countInStock}</td>
                                <td><span className={styles.naira}>N</span>{product.price}</td>
                            </tr>
                        </tbody>
                    </table>
                    <button className={styles.btn1} onClick={() => handleDelete(product._id)}>delete product</button>
                </ul>)}
            </div>}
        </Layouts>
    )
}

export async function getServerSideProps({params}) {
    await database();
    const { id } = params;
    const user = await User.findById(id)
    if (!user.isAdmin) {
        return {
            notFound: true
        };
    } else {
        const products = await Product.find({}).lean();
        return {
            props: {
                products: products.map(convertDocToObj),
            },
        };
    }
}