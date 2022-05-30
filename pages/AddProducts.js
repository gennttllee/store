import Layouts from "../components/Layouts"
import { useState, useContext, useEffect } from 'react';
import { Store } from '../utils/Mystore';
import { useRouter } from "next/router"
import { useSnackbar } from 'notistack';
import styles from '../styles/addProduct.module.css';
import Image from 'next/image';
import axios from 'axios';

export default function AddProducts() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { dispatch, state } = useContext(Store)
    const { userInfo, cart } = state;
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState()
    const [slug, setSlug] = useState()
    const [price, setPrice] = useState()
    const [gender, setGender] = useState()
    const [color, setColor] = useState()
    const [description, setDescription] = useState()
    const [countInStock, setCountInStock] = useState()
    const [category, setCategory] = useState()
    const [image, setImage] = useState()
    const [upload, setUpload] = useState(false)
    const [size, setSize] = useState([])

    const sizes = [37, 38, 39, 40, 41, 41, 42, 43, 44, 45, 46, 47]

    const mySize = (e) => {
        if (e.target.checked) {
            setSize([...size, parseInt(e.target.value)])
        } else {
            const newSize = size.filter(item => {
                return item !== parseInt(e.target.value)
            })
            setSize(newSize)
        }
    }

    useEffect(() => {
        if (!userInfo) {
            router.push('/Login')
        }
        if (userInfo.isAdmin === false) {
            router.push('/')
        }
    }, [userInfo]);

    const uploadImage = async (e) => {
        e.preventDefault()
        setLoading(true)
        const form = e.currentTarget
        const fileInput = Array.from(form.elements).find(({ name }) => name === 'file')
        const formData = new FormData();
        for (const file of fileInput.files) {
            formData.append('file', file)
        }
        formData.append('upload_preset', 'my-uploads')
        const data = await fetch('https://api.cloudinary.com/v1_1/gennttllee/image/upload', {
            method: 'POST',
            body: formData
        }).then(r => r.json());
        const imageUrl = data.secure_url;
        setImage(image = imageUrl)
        setUpload(true)
        setLoading(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await axios.post('/api/products/add', {
                name,
                slug,
                image,
                color,
                description,
                category,
                gender,
                size,
                countInStock,
                price,
            });
            enqueueSnackbar('uploaded successfully', { variant: 'success' })
            setLoading(false)
            setUpload(false)
        } catch (err) {
            enqueueSnackbar(err.message, { variant: 'error' })
            setLoading(false)
            setUpload(false)
        }
    }

    return (
        <Layouts>
            <div className={styles.div}>
                <h1 className={styles.h1}>ADD PRODUCTS</h1>
                <form className={styles.form} onSubmit={uploadImage}>
                    <input className={styles.input} name="file" type="file" />
                    <button className={loading ? styles.load1 : styles.btn1} type="submit">{loading ? 'Loading...' : 'Upload'}</button>
                </form>
                {upload ? <Image src={image} alt='image' width={200} height={200} /> : ''}
                <form onSubmit={handleSubmit} className={styles.form} >
                    <label className={styles.label1}>Product name</label>
                    <input onChange={(e) => setName(e.target.value)} className={styles.input1} type='text' placeholder="product name" name="name"></input>
                    <label className={styles.label1}>Slug</label>
                    <input onChange={(e) => setSlug(e.target.value)} className={styles.input1} type='text' placeholder="product slug" name="slug"></input>
                    <label className={styles.label1}>Color</label>
                    <input onChange={(e) => setColor(e.target.value)} className={styles.input1} type='text' placeholder="color" name="color"></input>
                    <label className={styles.label1}>Description</label>
                    <textarea onChange={(e) => setDescription(e.target.value)} className={styles.text} type='text' placeholder="product description" name="description"></textarea>
                    <label className={styles.label1}>Price</label>
                    <input onChange={(e) => setPrice(e.target.value)} className={styles.input1} type='number' placeholder="price" name="price"></input>
                    <label className={styles.label1}>Quantity</label>
                    <input onChange={(e) => setCountInStock(e.target.value)} className={styles.input1} type='number' placeholder="count in stock" name="count"></input>
                    <br />
                    <input onChange={(e) => setGender(e.target.value)} className={styles.radio} type="radio" name='gender' value='male'></input>
                    <label className={styles.label}>Male</label>
                    <input onChange={(e) => setGender(e.target.value)} className={styles.radio} type="radio" name='gender' value='female'></input>
                    <label className={styles.label}>female</label>
                    <input onChange={(e) => setGender(e.target.value)} className={styles.radio} type="radio" name='gender' value='unisex'></input>
                    <label className={styles.label}>Unisex</label>
                    <br />
                    <label className={styles.label1}>select sizes</label>
                    <div className={styles.diver}>
                        {sizes.map(item => <span key={item.index}>
                            <input className={styles.box} onChange={mySize} type='checkbox' name="size" value={item}></input>
                            <label className={styles.lab}>{item}</label>
                        </span>)}
                    </div>
                    <label className={styles.label1}>Category</label>
                    <select onChange={(e) => setCategory(e.target.value)} className={styles.input1} name="category">
                        <option value='bags'>bags</option>
                        <option value='shoes'>shoes</option>
                        <option value='belts'>belts</option>
                        <option value='slippers'>slippers</option>
                    </select>
                    <br />
                    <button className={loading ? styles.load : styles.btn} type="submit">{loading ? 'Loading...' : 'Submit'}</button>
                </form>
            </div>
        </Layouts>
    )
}
