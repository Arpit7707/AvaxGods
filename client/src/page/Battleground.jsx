import React from 'react'
import { useNavigate } from 'react-router-dom';
import styles from '../styles';
import { Alert } from '../components';
import { battlegrounds } from '../assets';
import { useGlobalContext } from '../context';

//user will be able to navigate to this page by clicking button "Change Battleground" button from GameInfo 
//component in Battle.jsx

const Battleground = () => {
    const {showAlert, setshowAlert, setbattleground} = useGlobalContext()
    const navigate = useNavigate()

    const handleBattlegroundChoice = (ground)=>{
      setbattleground(ground.id)

      localStorage.setItem('battleground', ground.id)
      setshowAlert({status: true, type : "info", message : `${ground.name} is battle ready`})
      setTimeout(()=>{
        //navigate(-1) is used to navigate us to back where we came from
        //after 1 second you'll be navigated back and then the background will be changed
        navigate(-1)
      }, 1000)
    }

  return (
    <div className={`${styles.flexCenter} ${styles.battlegroundContainer}`}>
        {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message} />}
        
        <h1 className={`${styles.headText} text-center`}>
            Choose your
            <span className="text-siteViolet"> Battle </span>
            Ground
        </h1>

        <div className={`${styles.flexCenter} ${styles.battleGroundsWrapper}`}>
           {battlegrounds.map((ground)=>(
            <div key={ground.id} 
            className={`${styles.flexBetween} ${styles.battleGroundCard}`} onClick={()=>handleBattlegroundChoice(ground)}>
              <img src={ground.image} alt="ground" className={styles.battleGroundCardImg} />
              <div className="info absolute">
                <p className={styles.battleGroundCardText}>{ground.name}</p>
              </div>
            </div>
           ))}
        </div>
    </div>
  )
}

export default Battleground
