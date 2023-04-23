import React, {createContext, useState, useEffect, useRef, useContext} from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { useNavigate } from 'react-router-dom'
import { ABI, ADDRESS } from '../contract'
import { createEventListeners } from './CreateEventListeners'
import { GetParams } from '../utils/onboard'

//globally storing the state variable so that we can acces on any page and any component

const GlobalContext = createContext()

export const GlobalContextProvider = ({children})=>{
    //interact and connect with our smart contract

    const [walletAddress, setWalletAddress] = useState('')
    const [provider, setprovider] = useState('')
    const [contract, setcontract] = useState(null)
    const [showAlert, setshowAlert] = useState({status: false, type: 'info', message: ''})
    const [battleName, setbattleName] = useState('')
    const [gameData, setgameData] = useState({
      players : [], pendingBattles: [], activeBattle: null
    })
    const [updateGameData, setupdateGameData] = useState(0)
    //astral is battleGroung background can be accessed from assets/backgroung folder
    const [battleground, setbattleground] = useState('bg-astral')
    const [step, setstep] = useState(1)
    const [errorMessage, setErrorMessage] = useState('')

    const web3Modal = useRef()

    const player1Ref = useRef()
    const player2Ref = useRef()

    const navigate = useNavigate()



    
    useEffect(() => {
      //set the smart contract and provider to the state
      const setsmartContractAndProvider = async ()=>{
      //connecting to wallet
      web3Modal.current = new Web3Modal()
      const connection = await web3Modal.current.connect()
      const newProvider = new ethers.providers.Web3Provider(connection)
      const signer = newProvider.getSigner()
      //getting instance of smart contract
      console.log("Hello from setsmartContractAndProvider")
      console.log({signer})
      const newContract = new ethers.Contract(ADDRESS, ABI, signer)
      setprovider(newProvider)
      setcontract(newContract)
     }       
    setsmartContractAndProvider()
    }, [])

          //window.ethereum object injects web3 functionality in browser
  //getting all account addresses
  //* Set the wallet address to the state
  const updateCurrentWalletAddress = async () => {
    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log("Hello from updateCurrentWalletAddress")
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts) setWalletAddress(accounts[0]);
  };

  useEffect(() => {
    updateCurrentWalletAddress();

    window.ethereum.on('accountsChanged', updateCurrentWalletAddress);
  }, []);

    useEffect(()=>{
      //by this useEffect, if you reload the page then also the background of set battleground won't change
      const battlegroungFromocalStorage = localStorage.getItem('battleground')
      if(battlegroungFromocalStorage){
        setbattleground(battlegroungFromocalStorage)
      } else{
        localStorage.setItem('battleground', battleground)
      }
    }, [])

    useEffect(()=>{
      //for resetting web3 onboarding modal params
      const resetParams = async ()=>{
        const currentStep = GetParams()
        setstep(currentStep.step)
      }
      resetParams()
      window?.ethereum?.on('chainChanged', () => resetParams());
      window?.ethereum?.on('accountsChanged', () => resetParams());
    }, [])


    
    useEffect(() => {
     if(step !== -1 &&contract){
      createEventListeners({
        navigate, contract, provider, walletAddress, setshowAlert, setupdateGameData, player1Ref, player2Ref
      })
     }
    }, [contract, step])
    
    
    useEffect(() => {
      if(showAlert?.status){
        const timer = setTimeout(()=>{
          setshowAlert ({status: false, type: 'info', message: ''})
        }, [5000])
        //always good to clear timers when setting them in useEffect
        return ()=> clearTimeout(timer)
      }
    }, [showAlert])

    useEffect(() => {
      //handle error messages
      if(errorMessage){
        //cutting off "execution reverted :" part of message and rest will be displayed
        const parsedErrorMessage = 
        errorMessage?.reason?.slice('execution reverted :'.length).slice(0, -1)
        
        if(parsedErrorMessage){
          setshowAlert({status : true, type: 'failure', message: parsedErrorMessage})
        }
      }
    }, [errorMessage])
    
    
    useEffect(() => {
      //set the game data to the state
      const fetchGameData = async ()=>{
        const fetchBattles = await contract.getAllBattles()
        const pendingBattles = fetchBattles.filter((battle)=> battle.battleStatus === 0)
        let activeBattle = null

        fetchBattles.forEach((battle)=>{
          if(battle.players.find((player)=> player.toLowerCase() === walletAddress.toLowerCase())){
            //checks if player has the same address as the addres of wallet in the brower
            if(battle.winner.startsWith('0x00')){
              //we don't have the winner and the battle is still active
              activeBattle = battle
            }
          }
        })
        //pendingBattles.slice(1) coz frist element will be 0 address
        setgameData({pendingBattles : pendingBattles.slice(1), activeBattle})
        console.log(fetchBattles)
      }
      
      if(contract) fetchGameData()
    }, [contract, updateGameData])
    

    //values of variables declared in "value" field is stored globally
    //we can access it by importing useGlobalContext()
    return(
      <GlobalContext.Provider value={{
        contract, walletAddress, showAlert, setshowAlert, battleName, setbattleName, gameData,provider,
        battleground, setbattleground, errorMessage, setErrorMessage, player1Ref, player2Ref, updateCurrentWalletAddress
      }}>
        {/*children are <Home />, <CreateBattle /> etc  */}
        {children}
      </GlobalContext.Provider>
    )
}

//useContext hook is used to manage state globally
export const useGlobalContext = ()=> useContext(GlobalContext)