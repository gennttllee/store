import Head from 'next/head';
import styles from '../utils/layouts.module.css'
import Link from 'next/link';
import Cookies from "js-cookie"
import dynamic from 'next/dynamic'
import { Store } from '../utils/Mystore'
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Load from '../components/Load';

function Layouts({ title, children }) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();
    const { dispatch, state } = useContext(Store)
    const { userInfo } = state;
    const [show, setShow] = useState(true)
    const [toggle, setToggle] = useState()
    const [profile, setProfile] = useState(false)
    const [load, setLoad] = useState(false)
    const [bar, setBar] = useState(false)

    useEffect(() => {
        window.addEventListener('scroll', controlNavbar)
        return () => {
            window.removeEventListener('scroll', controlNavbar)
        }
    }, [show, router.query]);

    const controlNavbar = () => {
        if (window.scrollY > 200) {
            setShow(false)
        } else {
            setShow(true)
        }
    }

    const logged = () => {
        if (!userInfo) {
            router.push('/Login')
        } else {
            setProfile(!profile);
        }
    }

    const out = () => {
        dispatch({ type: 'USER_LOGOUT' })
        Cookies.remove('userInfo')
        Cookies.remove('cartItems')
        Cookies.remove('shippingAddress')
        router.push('/Loading')
    }

    useEffect(() => {
        if (window.innerWidth > 1100) {
            setBar(false)
        }
    }, [window.innerWidth]);

    useEffect(() => {
        if (!userInfo) {
            Cookies.remove('userInfo')
        }
    }, [userInfo]);

    const toggler = (item) => {
        if (toggle === item) {
            setToggle();
        } else {
            setToggle(item)
        }
    }

    const submitForm = (e) => {
        e.preventDefault()
        enqueueSnackbar('Successful', { variant: 'success' });
        e.target.reset();
    }

    const name = state.userInfo ? state.userInfo.name.slice(0, 5) : '';

    const total = state.cart.cartItems.reduce((a, c) => {
        return a + c.quantity
    }, 0)

    return (
        <div className={styles.container}>
            <Head>
                <title>{title ? `${title}-mw-shop` : 'mw-shop'}</title>
                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'></meta>
            </Head>
            <nav className={styles.navbar}>
                <div className={styles.contain1}>
                    <div className={styles.row}>
                        <p className={styles.p}> No 1 Adedoyin street Ogba Lagos   <span className={styles.span}>08102599232 </span>  <span className={styles.span}> slidesbyego@gmail.com</span></p>
                        <p className={styles.p1}>
                            <span className={`fa-brands fa-instagram ${styles.icon3}`}></span>
                            <span className={`fa-brands fa-facebook ${styles.icon4}`}></span>
                            <span className={`fa-brands fa-twitter ${styles.icon5}`}></span>
                            <span className={`fa fa-inbox ${styles.icon3}`}></span>
                        </p>
                    </div>
                </div>
                <div className={show ? bar ? styles.bar : styles.contain : bar ? styles.bar : styles.fixed}>
                    <div className={bar ? styles.child1 : styles.child}>
                        {show && <h1 className={styles.h1}>SLIDES BY EGO</h1>}
                        <div className={bar ? styles.flex2 : styles.flex1}>
                            <button onClick={() => setBar(!bar)} className={styles.visible}>
                                {bar ? <span className={`fa-solid fa-xmark ${styles.icon9}`}></span> : <span className={`fa fa-bars ${styles.icon2}`}></span>}
                            </button>
                            <div className={styles.visible}>
                                {bar ? null : <h1 className={styles.h2}>SLIDES BY EGO</h1>}
                            </div>
                            <div className={styles.invisible}>
                                {show ? <p>Nigeria</p> : <h1 className={styles.h2}>SLIDES BY EGO</h1>}
                            </div>
                            <ul className={bar ? styles.ul1 : styles.ul}>
                                <li className={styles.li}><Link href='/Bags'>
                                    <a onClick={() => setLoad(true)}>Bags</a>
                                </Link></li>
                                <li className={styles.li}>shoes</li>
                                <li className={styles.li}>belts</li>
                                <li className={styles.li}>
                                    <Link href='/Slippers'>
                                        <a onClick={() => setLoad(true)}>Slippers</a>
                                    </Link>
                                </li>
                            </ul>
                            <p className={bar ? styles.p3 : styles.p2}>
                                {bar ? null : <Link href='/Cart'>
                                    <a className={styles.anonymous}>
                                        <span className={`fa fa-shopping-cart ${styles.icon2}`}></span>
                                        {total > 0 && <p className={styles.length}>{total}</p>}
                                    </a>
                                </Link>}
                                {bar ? <Link href={userInfo.name ? `/Profile` : `/Login`}>
                                    <a className={styles.wisher}>{userInfo.name ? userInfo.name : 'login'}</a>
                                </Link> : <button className={styles.user} onClick={logged}>
                                    <div className={styles.use}>
                                        <span className={`fa fa-user ${styles.icon1}`}></span>
                                        <p className={styles.name}>{name}</p>
                                    </div>
                                    {profile && <div className={styles.position}>
                                        <Link href='/Profile'>
                                            <a className={styles.logout}>My Profile</a>
                                        </Link>
                                        <button onClick={out} className={styles.logout}>Logout</button>
                                    </div>}
                                </button>}
                                <Link href='/Favorites'>
                                    {bar ? <a className={styles.wisher}>Wishlists</a> : <a className={styles.anonymous1}>
                                        <span className={`fa fa-heart ${styles.icon1}`}></span>
                                        {state.favorites.length > 0 && <p className={styles.length}>{state.favorites.length}</p>}
                                    </a>}
                                </Link>
                                <div className={styles.invisible}>
                                    <span className={`fa fa-circle-question ${styles.icon1}`}></span>
                                </div>
                            </p>
                        </div>
                    </div>
                </div>
            </nav>
            <main className={styles.main}>
                {load ? <Load /> : children}
            </main>
            <footer className={styles.footer}>
                <div className={styles.last}>
                    <h1 className={styles.ego}>slides by ego</h1>
                    <h2 className={styles.us}>subscribe to us</h2>
                    <form onSubmit={submitForm} className={styles.form}>
                        <input className={styles.email} type='email' placeholder='enter your email address' required />
                        <button className={styles.submit} type='submit'>Subscribe </button>
                        <br />
                        <input className={styles.check} type='checkbox' required></input>
                        <label className={styles.label}>I agree to the terms, conditions and privacy policy</label>
                    </form>
                    <div className={styles.flexed}>
                        <div>
                            <h1 className={styles.log}>slides by ego</h1>
                            <div>
                                <span className={`fa-brands fa-instagram ${styles.icon3}`}></span>
                                <span className={`fa-brands fa-facebook ${styles.icon4}`}></span>
                                <span className={`fa-brands fa-twitter ${styles.icon5}`}></span>
                                <span className={`fa-brands fa-whatsapp ${styles.icon6}`}></span>
                            </div>
                        </div>
                        <div className={styles.table}>
                            <div>
                                <div className={styles.mini}>
                                    <h4 className={styles.logs}>About Shop </h4>
                                    <button onClick={() => toggler(1)} className={styles.btn10}>
                                        <span className={`fa-solid fa-caret-down ${styles.drop}`}></span>
                                    </button>
                                </div>
                                <div className={toggle === 1 ? styles.live : styles.die}>
                                    <p>Delivery</p>
                                    <p>Legal Notice</p>
                                    <p>Stores</p>
                                    <Link href='/Profile'>
                                        <a style={{display : 'block', color : 'black', margin : '1rem 0'}}>Personal Info</a>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <div className={styles.mini}>
                                    <h4 className={styles.logs}>categories </h4>
                                    <button onClick={() => toggler(2)} className={styles.btn10}>
                                        <span className={`fa-solid fa-caret-down ${styles.drop}`}></span>
                                    </button>
                                </div>
                                <div className={toggle === 2 ? styles.live : styles.die}>
                                    <p>About us</p>
                                    <p>Contact Us</p>
                                    <Link href='/Main'>
                                        <a style={{display : 'block', color : 'black', margin : '1rem 0'}}>Catalogue Page</a>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <div className={styles.mini}>
                                    <h4 className={styles.logs}>Account </h4>
                                    <button onClick={() => toggler(3)} className={styles.btn10}>
                                        <span className={`fa-solid fa-caret-down ${styles.drop}`}></span>
                                    </button>
                                </div>
                                <div className={toggle === 3 ? styles.live : styles.die}>
                                    <Link href='/Profile'>
                                        <a style={{display : 'block', color : 'black', margin : '1rem 0'}}>Personal Info</a>
                                    </Link>
                                    <Link href='/History'>
                                        <a style={{display : 'block', color : 'black', margin : '1rem 0'}}>Orders</a>
                                    </Link>
                                    <p>Credit Slips</p>
                                    <Link href='/Profile'>
                                        <a style={{display : 'block', margin : '1rem 0', color: 'black'}}>Addresses</a>
                                    </Link>
                                    <p>Vouchers</p>
                                </div>
                            </div>
                            <div>
                                <div className={styles.mini}>
                                    <h4 className={styles.logs}>Contacts </h4>
                                    <button onClick={() => toggler(4)} className={styles.btn10}>
                                        <span className={`fa-solid fa-caret-down ${styles.drop}`}></span>
                                    </button>
                                </div>
                                <div className={toggle === 4 ? styles.live : styles.die}>
                                    <p>Shop</p>
                                    <p>Nigeria</p>
                                    <p>No 1 Adedoyin street Ogba Lagos</p>
                                    <p>08102599232</p>
                                    <p>slidesbyego@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.chance}>
                        <p>
                            <span className='fa fa-copyright'></span> 2022
                            <a className={styles.mark} target='blank' href='https://www.mwprofile.com'>e-commerce software by Mark Williams </a>
                        </p>
                        <div className={styles.images}>
                            <Image src='/images/verve.png' alt='verve' width={70} height={30} />
                            <Image src='/images/visa.jpg' alt='verve' width={70} height={30} />
                            <Image src='/images/master.png' alt='verve' width={70} height={30} />
                            <Image src='/images/pay.png' alt='verve' width={70} height={30} />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
export default dynamic(() => Promise.resolve(Layouts), { ssr: false })