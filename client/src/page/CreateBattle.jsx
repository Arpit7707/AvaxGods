import React, {useState, useEffect} from 'react';
import { PageHOC, CustomButton, CustomInput, GameLoad } from '../components'; 
import { useNavigate } from 'react-router-dom';
import styles from '../styles';
import { useGlobalContext } from '../context';


const CreateBattle = () => {
  const {contract, battleName, setbattleName, gameData, setErrorMessage} = useGlobalContext()
  //waitBattle is used in wait screen coz player won't be able to jump in battle until another player joins
  //so until the another player joins, we will show waiting screen
  const [waitBattle, setwaitBattle] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if(gameData?.activeBattle?.battleStatus === 1){
      //if you had already created the battle and when you rejoin 
      //you'// be redirected to battle page automatically
      navigate(`/battle/${gameData.activeBattle.name}`)
    } else if(gameData?.activeBattle?.battleStatus === 0){
      setwaitBattle(true)
    }
  }, [gameData])
  

  const handleClick = async ()=>{
    if(!battleName || !battleName.trim()) return null

    setwaitBattle(true)
    
    try {
      await contract.createBattle(battleName, { gasLimit: 200000 })
    } catch (error) {
      setErrorMessage(error.message)
    }
  }
  
  return (
    <>
      {waitBattle && <GameLoad />}
      <div className="flex flex-col mb-5">
        <CustomInput 
          label="Battle"
          placeholder="Enter Battle Name"
          value={battleName}
          handleValueChange={setbattleName}
        />  
        <CustomButton
          title="Create Battle"
          handleClick={handleClick}
          restStyles="mt-6"
        />  
      </div>

      <p className={styles.infoText} onClick={()=> navigate('/join-battle')}>Or join already existing Battles</p>
    </>
  )
};

export default PageHOC(CreateBattle,
 <>Create <br /> a new battle</>,
 <>Create Your own battle and wait for oher olayers to join you</>
 );