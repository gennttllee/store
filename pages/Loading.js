import Layouts from "../components/Layouts";
import { useRouter } from 'next/router';
import styles from '../styles/loading.module.css'
import dynamic from "next/dynamic";

function Loading() {
    const router = useRouter();

    router.push('/')

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

export default dynamic(() => Promise.resolve(Loading), { ssr: false })