import Layouts from "../components/Layouts"
import { useState, useContext, useEffect } from 'react';
import { Store } from '../utils/Mystore';
import { useRouter } from "next/router"
import { useSnackbar } from 'notistack';
import styles from '../styles/addProduct.module.css';

export default function AddProducts() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { dispatch, state } = useContext(Store)
    const { userInfo, cart } = state;
    const router = useRouter();
    const [loading, setLoading]= useState(false)


    useEffect(() => {
        if (!userInfo) {
            router.push('/Login')
        }
        if (userInfo.isAdmin === false) {
            router.push('/')
        }
    }, [userInfo]);

    const submitMe =()=>{
        setLoading(true)
    }


    return (
        <Layouts>
            <div className={styles.div}>
                <h1 className={styles.h1}>ADD PRODUCTS</h1>
                <form  className={styles.form} method="post" action="/api/products/add" encType="multipart/form-data">.
                    <input className={styles.input} name="picture" type="file" />
                    <input className={styles.input1} type='text' placeholder="product name" name="name"></input>
                    <input className={styles.input1} type='text' placeholder="product slug" name="slug"></input>
                    <textarea className={styles.text} type='text' placeholder="product description" name="description"></textarea>
                    <input className={styles.input1} type='number' placeholder="price" name="price"></input>
                    <input className={styles.input1} type='number' placeholder="count in stock" name="count"></input>
                    <br />
                    <input className={styles.radio} type="radio" name='gender' value='male'></input>
                    <label className={styles.label}>Male</label>
                    <input className={styles.radio} type="radio" name='gender' value='female'></input>
                    <label className={styles.label}>female</label>
                    <br />
                    <select className={styles.input1} name="category">
                        <option value='bags'>bags</option>
                        <option value='shoes'>shoes</option>
                        <option value='belts'>belts</option>
                        <option value='slippers'>slippers</option>
                    </select>
                    <br />
                    <button onClick={submitMe} className={ loading ? styles.load :styles.btn} type="submit">{loading ? 'Loading...' : 'Submit'}</button>
                </form>
            </div>
        </Layouts>
    )
}
