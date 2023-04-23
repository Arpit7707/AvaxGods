import React, {useState, useEffect} from 'react';
import { CustomButton, CustomInput, PageHOC } from '../components';
import { useGlobalContext } from '../context';
import { useNavigate } from 'react-router-dom';
import { ADDRESS } from '../contract'


const Home = () => {
  //values of variables declared in "value" field is stored globally
  //we can access it (state/ value) by importing useGlobalContext() and calling it
  //so useGlobalContext() returns the value of that state variable declared in "value" in context/index.jsx 
  const {contract, walletAddress, showAlert, setshowAlert, setErrorMessage, gameData, provider} = useGlobalContext()
  const [playerName, setplayerName] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    //if you have already registered then this useEffect will automatically redirect you to create-battle page when 
    //connect the wallet
    //if you have not registered then you will stay in home page
    const checkForPlayerToken = async ()=>{
      const playerExists = await contract.isPlayer(walletAddress)
      const playerTokenExists = await contract.isPlayerToken(walletAddress)
      console.log({playerTokenExists})

      if(playerExists && playerTokenExists){
        navigate('/create-battle')
      }
    }
    if(contract) checkForPlayerToken()
  }, [contract])

  const handleClick = async ()=>{
     try {
      console.log({walletAddress})
      console.log({contract})

      //if player with "walletAddress" has created account in game
      const playerExists = await contract.isPlayer(walletAddress)
      console.log({playerExists})
      console.log(playerName)
      if(!playerExists){
        await contract.registerPlayer(playerName, playerName, { gasLimit: 3000000 })
        setshowAlert({
          status : true, type :'info', message :`${playerName} is being summoned`
        })
        setTimeout(() => navigate('/create-battle'), 8000);

      }
     } catch (error) {
      setErrorMessage(error.message)
     }
  }


  
  useEffect(()=>{
   //if player has game token and was already in battle then when it joins directly redirect it to battle page
   if(gameData.activeBattle){
    navigate(`/battle/${gameData.activeBattle.name}`)
   }
  }, [gameData])

  return (
    <div className="flex flex-col">
      <CustomInput 
        label="Name"
        placeholder="Enter your player name"
        value={playerName}
        handleValueChange={setplayerName}
      />

      <CustomButton title="Register" handleClick={handleClick} restStyles="mt-6" />

    </div>
  )
};

export default PageHOC(Home,
 <>Welcome to Avax Gods <br /> a Web3 NFT Card Game </>,
 <>Connect your wallet to start playing <br /> the ultimate Web3 Battle Card Game</>
 );