import React, {useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context'
import { CustomButton, PageHOC } from '../components'
import styles from '../styles'

const JoinBattle = () => {
    const {contract, gameData, setshowAlert, setbattleName, walletAddress, setErrorMessage} = useGlobalContext()
    const navigate = useNavigate()

    const handleClick = async (battleName)=>{
      //when you click join button for joining battle it'll call eventListener which will redirect to Battle.jsx
        setbattleName(battleName)
        try {
            await contract.joinBattle(battleName, { gasLimit: 3000000 })
            setshowAlert({status: true, type : "success" , message : `Joining ${battleName}`})
        } catch (error) {
            setErrorMessage(error.message)
        }
    }

    useEffect(()=>{
      //when user is at joinBattle page and is already in any battle 
      //then it should not be allowed to join another battle
      if(gameData?.activeBattle?.battleStatus === 1) navigate(`/battle/${gameData.activeBattle.name}`)
    },[gameData])

  return (
    <div>
      <h2 className={styles.joinHeadText}>Available Battles</h2>

      <div className={styles.joinContainer}>
        {gameData.pendingBattles.length 
        ?  
        //filtering out the battles that current players have created (battles created by current player won't be visible)
        //if it shows then he would be playing with himself
        gameData.pendingBattles.filter((battle)=> !battle.players.includes(walletAddress))
        .map((battle,index)=>(
            //use parantheses instead of curly braces coz we want to return a div
            <div key={battle.name + index} className={styles.flexBetween}>
              <p className={styles.joinBattleTitle}>{index + 1}. {battle.name}</p>
              <CustomButton title="Join" handleClick={()=>handleClick(battle.name)} />
            </div>
        ))
        :
        <p className={styles.joinLoading}>Reload the page to see new Battles</p>}
      </div>

      <p className={styles.infoText} onClick={()=>navigate('/create-battle')}>Or Create a new Battle</p>
    </div>
  )
}

export default PageHOC(
    JoinBattle,
    <>Join <br /> a Battle</>,
    <>Join already existing battles</>
)
