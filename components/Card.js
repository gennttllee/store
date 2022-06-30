import Image from 'next/image';
import styles from '../styles/card.module.css'
import NextLink from 'next/link';
import Load from '../components/Load';
import { useState } from 'react';

export default function Card(props) {
    const [loading, setLoading] = useState(false)

    const clickUs = () => {
        setLoading(true)
    }

    return (
        <div className={styles.card}>
            {loading ? <Load /> : <div className={styles.div}>
                <NextLink href={props.link} alt='mama'>
                    <a className={styles.link} onClick={clickUs}>
                        <div className={styles.imagers}>
                            <Image loader={() => props.image} src={props.image} alt='fashion' width={300} height={250}></Image>
                        </div>
                        <p className={styles.name}>{props.name}</p>
                        <p className={styles.price}><span className={styles.naira}>N</span>{props.price}</p>
                    </a>
                </NextLink>
                <button onClick={props.click} className={styles.mark}>
                <span className='fas fa-shopping-cart'></span>
                </button>
            </div>}
        </div>
    )
}
