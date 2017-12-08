import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import GameCard from './GameCard.js';


const GameGrid = props => {
  return (
    <div className="ui link cards">
      {props.games.map((game, index) => {
        return <GameCard 
          key={game.game._id}
          index={index}
          game={game}
          // style={styles.slide(event.pictureURL)}
          // onClick={() => handleEventSlideClick(event)}
        />
      })}
    </div>
  );
};

export default GameGrid;

