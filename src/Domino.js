import './Domino.css'
import React, { useState, useEffect,useRef } from 'react';
const { v4: uuidv4 } = require('uuid');

const getDominoes = () => {
  const dominoes = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      const id = uuidv4();
      dominoes.push({id, top: i, bottom: j });
    }
  }
  return dominoes;
};

const shuffleDominoes = (dominoes) => {
  return dominoes.sort(() => Math.random() - 0.5);
};

const DominoGame = () => {
  const isInitialRender = useRef(true);
  const [playerDominoes, setPlayerDominoes] = useState([]);
  const [computerDominoes, setComputerDominoes] = useState([]);
  const [tableDominoes, setTableDominoes] = useState([]);
  const [remainingDominoes, setRemainingDominoes] = useState([]);
  const [message, setMessage] = useState('');
  const [winnerMessage, setWinnerMessage] = useState('');
  

  useEffect(() => {
    const dominoes = shuffleDominoes(getDominoes());
    const playerHand = dominoes.slice(0, 6);
    const computerHand = dominoes.slice(6, 12);
    const remaining = dominoes.slice(12);

    setPlayerDominoes(playerHand);
    setComputerDominoes(computerHand);
    setRemainingDominoes(remaining);

    const playerMaxPair = Math.max(...playerHand.map(domino => domino.top + domino.bottom));
    const computerMaxPair = Math.max(...computerHand.map(domino => domino.top + domino.bottom));

    if (playerMaxPair > computerMaxPair) {
      setMessage("Player starts");
    } else {
      setMessage("Computer starts");
    }
  }, []);

  useEffect(() => {
    if (message === "Computer starts") {
      handleComputerFirstMove();
    }
  }, [message]);

  const checkForUserMove = (matchingDomino) => {
    const userCheckDomino = playerDominoes.find(
      (domino) => domino.top === matchingDomino.bottom
    );
    if(!userCheckDomino){
      console.log("Not found at hand")
      const userDeckCheckDomino = remainingDominoes.find(
        (domino) => domino.top === matchingDomino.bottom
      )
      if(!userDeckCheckDomino){
         console.log("can not find for user")
      }
    }
  }

  const checkForComputerMove = (matchingDomino) => {
    const computerCheckDomino = computerDominoes.find(
      (domino) => domino.top === matchingDomino.bottom
    );
    if(!computerCheckDomino){
      
      const computerDeckCheckDomino = remainingDominoes.find(
        (domino) => domino.top === matchingDomino.bottom
      );
      if(!computerDeckCheckDomino){
        console.log("can not find for computer")
      }
    }
  }

  const handleComputerFirstMove = () => {
    const randomIndex = Math.floor(Math.random() * computerDominoes.length);
    const computerFirstMove = computerDominoes[randomIndex];
    setComputerDominoes((prev) => prev.filter((domino) => domino.id !== computerFirstMove.id));
    setTableDominoes((prev) => [...prev, computerFirstMove]);
    checkForUserMove(computerFirstMove)

  };

  const handlePlayerMove = (selectedDomino) => {
    setPlayerDominoes((prev) => prev.filter((domino) => domino.id !== selectedDomino.id));
    setTableDominoes((prev) => [...prev, selectedDomino]);
    setRemainingDominoes((prev) => prev.filter((domino) => domino.id !== selectedDomino.id));
    checkForComputerMove(selectedDomino);
    handleComputerMove(selectedDomino);

  };

  
  
  const handleComputerMove = (lastPlayerMove) => {
    const matchingDomino = computerDominoes.find(
      (domino) => domino.top === lastPlayerMove.bottom
    );
    if (matchingDomino) {
      setComputerDominoes((prev) => prev.filter((domino) => domino.id !== matchingDomino.id));
      setTableDominoes((prev) => [...prev, matchingDomino]);
      checkForUserMove(matchingDomino);
    } else {
      const matchingDomino = remainingDominoes.find(
        (domino) => domino.top === lastPlayerMove.bottom
      );
      if(matchingDomino){
        setRemainingDominoes((prev) => prev.filter((domino) => domino.id !== matchingDomino.id));
        setTableDominoes((prev) => [...prev, matchingDomino]);
        checkForUserMove(matchingDomino);
      }
    }
  };

  const checkGameOver = () => {
    if (playerDominoes.length < computerDominoes.length) {
      setWinnerMessage('Player wins!');
    } else if (playerDominoes.length > computerDominoes.length) {
      setWinnerMessage('Computer wins!');
    } else if (playerDominoes.length===computerDominoes.length) {
      setWinnerMessage('It\'s a tie!');
    }
  };

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
  
    const lastTableDomino = tableDominoes[tableDominoes.length - 1];
    if (!lastTableDomino) {
      return;
    }
  
    const playerCards = playerDominoes.find((domino) => domino.top === lastTableDomino.bottom);
    const compCards = computerDominoes.find((domino) => domino.top === lastTableDomino.bottom);
    const remain = remainingDominoes.find((domino) => domino.top === lastTableDomino.bottom);
  
    if (!playerCards && !compCards && !remain) {
      checkGameOver();
    }
  }, [tableDominoes, playerDominoes, computerDominoes, remainingDominoes]);

  return (
    <div>
      <h1>Domino Game</h1>
      <p class="message">{message}</p>
      {winnerMessage && <p class="winner-message">{winnerMessage}</p>}
      <div className='parent-container'>
      <div className='player-section'>
        <div>
        <h2>Player Hand</h2>
        {playerDominoes.map((domino) => (
          <div key={domino.id}>
            <button onClick={() => handlePlayerMove(domino)} >Move to Table</button>
            {domino && `${domino.top || 0}/${domino.bottom || 0}`}
          </div>
        ))}
        </div>
      </div>
      <div className='computer-section'>
      <div className='computer-hand'>
        <h2>Computer Hand</h2>
        {computerDominoes.map((domino) => (
          <div key={domino.id}>
            {domino && `${domino.top || 0}/${domino.bottom || 0}`}
          </div>
        ))}
        </div>
        <div className='table-section'>
        <h2>Table</h2>
        {tableDominoes.map((domino) => (
          <div key={domino.id}>
            {domino && `${domino.top || 0}/${domino.bottom || 0}`}
          </div>
        ))}
      </div>
      </div>
      <div className='remaining-section'>
      <div>
        <h2>Remaining</h2>
        {remainingDominoes.map((domino) => (
          <div key={domino.id}>
            <button onClick={() => handlePlayerMove(domino)}>Move to Table</button>
            {domino && `${domino.top || 0}/${domino.bottom || 0}`}
          </div>
        ))}
        </div>
      </div>
      </div>
      
    </div>
  );
};

export default DominoGame;

