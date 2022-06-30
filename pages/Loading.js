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
                <h3>Loading...</h3>
                <div className={styles.image}>
                </div>
            </div>
        </Layouts>
    )
}
