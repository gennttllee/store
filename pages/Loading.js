import Layouts from "../components/Layouts";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/loading.module.css'


export default function Loading() {
    const router = useRouter();

    useEffect(() => {
        router.push('/')
    });


    return (
        <Layouts>
            <div className={styles.div}>
                <h1>Loading...</h1>
                <div className={styles.image}>
                    <Image src='/images/ego.jpeg' alt='image' width={150} height={150} />
                </div>
            </div>
        </Layouts>
    )
}
