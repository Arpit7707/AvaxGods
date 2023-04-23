import { Contract, ethers } from "ethers";
import { ABI } from "../contract";
import { playAudio, sparcle } from "../utils/animation.js";
import { defenseSound } from "../assets";

const AddNewEvent = (eventFilter, provider, cb) => {
  //cb ==callback
  provider.removeListener(eventFilter); //not have multiple listeners for the same event
  provider.on(eventFilter, (logs) => {
    //logs like emitted event logs will be parsed to store in variable
    const parsedLog = new ethers.utils.Interface(ABI).parseLog(logs);
    cb(parsedLog);
  });
};

const getCoords = (cardref) => {
  //getting current coordinates of card from cardref
  //this coordinates will be used to show animation at position of card

  //getBoundingClientRect() returns left, top, width, height properties of div
  const { left, top, width, height } = cardref.current.getBoundingClientRect();

  return {
    //this values shows the animation right the top of the card
    pageX: left + width / 2,
    pageY: top + height / 2.25,
  };
};

const emptyAccount = "0x0000000000000000000000000000000000000000";

export const createEventListeners = ({
  navigate,
  contract,
  provider,
  walletAddress,
  setshowAlert,
  setupdateGameData,
  player1Ref,
  player2Ref,
}) => {
  //NewPlayer is event emitted in smart contract
  const NewPlayerEventFilter = contract.filters.NewPlayer();
  AddNewEvent(NewPlayerEventFilter, provider, ({ args }) => {
    console.log("New Player Created!", args);
    if (walletAddress === args.owner) {
      setshowAlert({
        status: true,
        type: "success",
        message: "Player has been successfully registered",
      });
    }
  });

  const NewGameTokenEventFilter = contract.filters.NewGameToken();
  AddNewEvent(NewGameTokenEventFilter, provider, ({ args }) => {
    console.log("New Game Token Created", args.owner);

    if (walletAddress.toLowerCase() === args.owner.toLowerCase()) {
      //we created token for account we're currently connected to
      setshowAlert({
        status: true,
        type: "success",
        message: "Player Game Token has been successfully created",
      });

      navigate("/create-battle");
    }
  });

  //NewBattle is event emitted in smart contract
  const NewBattleEventFilter = contract.filters.NewBattle();
  AddNewEvent(NewBattleEventFilter, provider, ({ args }) => {
    console.log("New battle started!", args, walletAddress);
    if (
      walletAddress.toLowerCase() === args.player1.toLowerCase() ||
      walletAddress.toLowerCase() === args.player2.toLowerCase()
    ) {
      //this line will naviate to Battle.jsx page
      //battleName is URL parameter which can be accessed by useParameter() hook
      navigate(`/battle/${args.battleName}`);
    }

    setupdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });

  //BattleMove is event emitted in smart contract
  const BattleMoveEventFilter = contract.filters.BattleMove();
  AddNewEvent(BattleMoveEventFilter, provider, ({ args }) => {
    console.log("Battle move initiated!", args);
  });

  const roundEndedEventFilter = contract.filters.RoundEnded();
  AddNewEvent(roundEndedEventFilter, provider, ({ args }) => {
    console.log("Round Ended!", args, walletAddress);
    //explosion sound is played through sparcle
    for (let i = 0; i < args.damagedPlayers.length; i += 1) {
      if (args.damagedPlayers[i] !== emptyAccount) {
        if (args.damagedPlayers[i] === walletAddress) {
          sparcle(getCoords(player1Ref));
        } else if (args.damagedPlayers[i] !== walletAddress) {
          sparcle(getCoords(player2Ref));
        }
      } else {
        //nobody got damage and defended
        playAudio(defenseSound);
      }
    }
    setupdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });

  //emittied when health bar reaches to 0
  const BattleEndedEventFilter = contract.filters.BattleEnded();
  AddNewEvent(BattleEndedEventFilter, provider, ({ args }) => {
    console.log("Battle Ended!", args, walletAddress);
    if (walletAddress.toLowerCase() === args.winner.toLowerCase()) {
      setshowAlert({ status: true, type: "success", message: "You Won!" });
    } else if (walletAddress.toLowerCase() === args.loser.toLowerCase()) {
      setshowAlert({ status: true, type: "failure", message: "You Lost!" });
    }
    navigate("/create-battle");
  });
};
