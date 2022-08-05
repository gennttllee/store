import Image from 'next/image';
import styles from '../styles/card.module.css'
import NextLink from 'next/link';
import Load from '../components/Load';
import { useState, useContext } from 'react';
import { Store } from '../utils/Mystore'
import { useRouter } from 'next/router';

export default function Card(props) {
    const { dispatch, state } = useContext(Store)
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState()

    const clickUs = () => {
        setLoading(true)
    }

    const passed = (item) => {
        if (window.innerWidth > 600) {
            setShow(item)
        }
    }

    const passedOut = () => {
        setShow();
    }

    return (
        <div onMouseLeave={passedOut} onMouseEnter={() => passed(props.index)} className={styles.card}>
            {loading ? <Load /> : <div className={styles.div}>
                <p className={styles.p}>new product</p>
                <NextLink href={props.link}>
                    <a className={styles.link} onClick={clickUs}>
                        <div className={styles.imagers}>
                            <Image src={props.image} alt='fashion' width={450} height={400}></Image>
                        </div>
                    </a>
                </NextLink>
                <div className={styles.span}>
                    <p className={styles.name}>{props.name}</p>
                    <button className={styles.fave} onClick={props.clickedMe}>
                        <span className={props.icon}></span>
                    </button>
                </div>
                <p className={styles.price}><span className={styles.naira}>N</span>{`${props.price}.00`}</p>
                <div className={show === props.index ? styles.dilly : styles.dilly1}>
                    <button onClick={props.shadow} className={styles.eye}>
                       <span className='fa fa-eye'></span>
                    </button>
                    <div className={styles.wrapper}>
                        <div className={styles.flex}>
                            <p className={styles.size}>Size :</p>
                            {props.size && <select className={styles.select}>
                                {props.size.map((item, index) => <option className={styles.options} key={index}>{item}</option>)}
                            </select>}
                        </div>
                        <div className={styles.dam}>
                            <p className={styles.ola}>{props.pain}</p>
                            <button className={styles.btn9} onClick={props.click}>add to cart</button>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}
