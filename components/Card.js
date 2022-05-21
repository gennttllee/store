import Image from 'next/image';
import styles from '../styles/card.module.css'
import NextLink from 'next/link';

export default function Card(props) {
    return (
        <div className={styles.card}>
            <NextLink href={props.link} alt='mama'>
                <a>
                    <div>
                        <Image loader={()=>props.image} src={props.image} alt='fashion' width={150} height={150}></Image>
                    </div>
                    <p>{props.name}</p>
                    <p><span>N</span> {props.price}</p>
                </a>
            </NextLink>
            <button onClick={props.click} className={styles.btn}>add to cart</button>
        </div>
    )
}
