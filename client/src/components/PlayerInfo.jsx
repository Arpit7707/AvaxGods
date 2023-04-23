import ReactTooltip from 'react-tooltip';
import styles from '../styles';

const healthPoints = 25;

const healthLevel = (points) => (points >= 12 ? 'bg-green-500' : points >= 6 ? 'bg-orange-500' : 'bg-red-500');
const marginIndexing = (index) => (index !== healthPoints - 1 ? 'mr-1' : 'mr-0');

const PlayerInfo = ({ player, playerIcon, mt }) => (
  <div className={`${styles.flexCenter} flex-row  ${mt ? 'mt-4' : 'mb-4'}`}>
    <img data-for={`Player-${mt ? '1' : '2'}`} data-tip src={playerIcon} alt="player02" className="w-14 h-14 object-contain rounded-full" />

    <div
      data-for={`Health-${mt ? '1' : '2'}`}
      data-tip={`Health: ${player.health}`}
      className={styles.playerHealth}
    >
      {[...Array(player.health).keys()].map((item, index) => (
        <div
          key={`player-item-${item}`}
          className={`${styles.playerHealthBar} ${healthLevel(player.health)} ${marginIndexing(index)}`}
        />
      ))}
    </div>

    <div
      data-for={`Mana-${mt ? '1' : '2'}`}
      data-tip="Mana"
      className={`${styles.flexCenter} ${styles.glassEffect} ${styles.playerMana}`}
    >
      {player.mana || 0}
    </div>

    <ReactTooltip id={`Player-${mt ? '1' : '2'}`} effect="solid" backgroundColor="#7f46f0">
      <p className={styles.playerInfo}>
        <span className={styles.playerInfoSpan}>Name:</span> {player?.playerName}
      </p>
      <p className={styles.playerInfo}>
        <span className={styles.playerInfoSpan}>Address:</span> {player?.playerAddress?.slice(0, 10)}
      </p>
    </ReactTooltip>
    <ReactTooltip id={`Health-${mt ? '1' : '2'}`} effect="solid" backgroundColor="#7f46f0" />
    <ReactTooltip id={`Mana-${mt ? '1' : '2'}`} effect="solid" backgroundColor="#7f46f0" />
  </div>
);

export default PlayerInfo;

// import ReactTooltip from 'react-tooltip';
// import styles from '../styles';

// const healthPoints = 25;

// const healthLevel = (points) => (points >= 12 ? 'bg-green-500' : points >= 6 ? 'bg-orange-500' : 'bg-red-500');
// const marginIndexing = (index) => (index !== healthPoints - 1 ? 'mr-1' : 'mr-0');

// const PlayerInfo = ({ player, playerIcon, mt }) => (
//   <div className={`${styles.flexCenter} `}>
//     <img data-for={`Player-${mt ? '1' : '2'}`} data-tip src={playerIcon} alt="player02" className="w-14 h-14 object-contain rounded-full" />

//     <div
//       data-for={`Health-${mt ? '1' : '2'}`}
//       data-tip={`Health: ${player.health}`}
//       className={styles.playerHealth}
//     >
//       {[...Array(player.health).keys()].map((item, index) => (
//         <div
//           key={`player-item-${item}`}
//           className={`${styles.playerHealthBar} ${healthLevel(player.health)} ${marginIndexing(index)}`}
//         />
//       ))}
//     </div>

//     <div
//       data-for={`Mana-${mt ? '1' : '2'}`}
//       data-tip="Mana"
//       className={`${styles.flexCenter} ${styles.glassEffect} ${styles.playerMana}`}
//     >
//       {player.mana || 0}
//     </div>

//     <ReactTooltip id={`Player-${mt ? '1' : '2'}`} effect="solid" backgroundColor="#7f46f0">
//       <p className={styles.playerInfo}>
//         <span className={styles.playerInfoSpan}>Name:</span> {player?.playerName}
//       </p>
//       <p className={styles.playerInfo}>
//         <span className={styles.playerInfoSpan}>Address:</span> {player?.playerAddress?.slice(0, 10)}
//       </p>
//     </ReactTooltip>
//     <ReactTooltip id={`Health-${mt ? '1' : '2'}`} effect="solid" backgroundColor="#7f46f0" />
//     <ReactTooltip id={`Mana-${mt ? '1' : '2'}`} effect="solid" backgroundColor="#7f46f0" />
//   </div>
// );

// export default PlayerInfo;

// //.map() function applies callback function for every elememt in array
// //this call back function will show squares in healthbar according to health
// //if health is 23 it'll show 23 green squares anf if it's 11 then it'll show 11 yellow squares
// //anf if it's 5 then it'll show 6 red squares 
// //background of that square will be decided by healhLevel function
// //number of squares in healthbar will be equal to value of player.health