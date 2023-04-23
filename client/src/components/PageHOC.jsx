import React from 'react'
import { useNavigate } from 'react-router-dom' //hook used to renabvigate somewhere
import {logo, heroImg} from '../assets'
import styles from '../styles'
import { useGlobalContext } from '../context'
import Alert from './Alert';

//PageHOC is a higher order component(HOC) which is used for code reusability 
//Higher order component can wrap another component
//difference between a higher order component and regular component is that as a first parameter it's going to accept a new
// component
//that component acts as a wrapper for that smaller component

//due to the way we'll be calling our higher order component we'll have to add function into function
const PageHOC = (Component, title, description ) => () => {
  const {showAlert} = useGlobalContext()
  const navigate = useNavigate()
  return (
    <div className={styles.hocContainer}>
        {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message} />}
        <div className={styles.hocContentBox}>
            <img src={logo} alt="logo" className={styles.hocLogo} onClick={()=> navigate("/")} />

            <div className={styles.hocBodyWrapper}>
                <div className="flex flex-row w-full">
                    <h1 className={`flex ${styles.headText} head-text`}>{title}</h1>
                </div>

                <p className={`${styles.normalText} my-10`}>{description}</p>

                <Component />
            </div>
            <p className={styles.footerText}>Made with 💜 by Arpit</p>
        </div>
        <div className="flex flex-1">
           <img src={heroImg} alt="Hero-Img" className="xl:h-full object-cover" />
        </div>
    </div>
  )
}

export default PageHOC
