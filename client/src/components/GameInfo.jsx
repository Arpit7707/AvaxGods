import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import CustomButton from './CustomButton';
import { alertIcon, gameRules } from '../assets'
import styles from '../styles'
import { useGlobalContext } from '../context'

const GameInfo = () => {
  const {contract, gameData, setshowAlert, setErrorMessage} = useGlobalContext()
  const [toggleSidebar, settoggleSidebar] = useState(false)
  const navigate = useNavigate()

  const handleBattleExit = async ()=>{
    const battleName = gameData.activeBattle.name

    try {
      await contract.quitBattle(battleName, { gasLimit: 200000 })
      setshowAlert({status : true, type : 'info', message : `You're quitting the ${battleName}`})
    } catch ({error}) {
      setErrorMessage(error.message)
    }
  }

  return (
    <>
      <div className={styles.gameInfoIconBox}>
         <div className={`${styles.gameInfoIcon} ${styles.flexCenter}`} onClick={()=> settoggleSidebar(true)}>
            <img src={alertIcon} alt="Info" className={styles.gameInfoIconImg} />
         </div>
      </div>

      <div className={`${styles.gameInfoSidebar} ${toggleSidebar? 'translate-x-0' : 'translate-x-full'}
       ${styles.glassEffect} ${styles.flexBetween} backdrop-blur-3xl`}>
         <div className="flex flex-col">
            <div className={styles.gameInfoSidebarCloseBox}>
               <div className={`${styles.flexCenter} ${styles.gameInfoSidebarClose}`} onClick={()=> settoggleSidebar(false)}>
                  X 
               </div>
            </div>

            <h3 className={styles.gameInfoHeading}>Game Rules:</h3>

            <div className="mt-3">
              {gameRules.map((rule, index)=>(
                <p key={`game-rule-${index}`} className={styles.gameInfoText}>
                  <span className="font-bold">{index+1}</span>.{rule}
                </p>
              ))}
            </div>
         </div>

         <div className={`${styles.flexBetween} mt-10 gap-4 w-full`}>
           <CustomButton title="Change Battleground" handleClick={()=>navigate('/battleground')} />
           <CustomButton title="Exit Battle" handleClick={handleBattleExit} />
         </div>
      </div>
    </>
  )
}

export default GameInfo
