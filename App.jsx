import React, { useState } from "react";
import clsx from "clsx";
import { languages } from "./languages";
import getFarewellText,{  getRandomWord}  from "./utils";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function AssemblyEndgame(){
    const { width, height } = useWindowSize();
     
     const[currentWord,setCurrentWord]=useState(()=>getRandomWord())
     const [guessedLetters,setGuessedLetters]=useState([])

    const wrongGuessCount=
    guessedLetters.filter(letter => !currentWord.includes(letter)).length
    const isGamewon=
    currentWord.split("").every(letter=>guessedLetters.includes(letter))
    const isGameLost=
    wrongGuessCount>=languages.length-1
    const isGameOver=isGamewon || isGameLost
    const alphabet="abcdefghijklmnopqrstuvwxyz"
     const lastGuessedLetter=guessedLetters[guessedLetters.length-1]
           const isLastGuessedIncorrect=lastGuessedLetter&&!currentWord.includes(lastGuessedLetter)
    
    console.log(guessedLetters)
    function addGuessedLetter(letter){
        setGuessedLetters(prevLetters=>
            prevLetters.includes(letter)?
            prevLetters:

            [...prevLetters,letter])
    }
    function startNewGame(){
      setCurrentWord(getRandomWord())
      setGuessedLetters([])
       
   }

    const languageElement=languages.map((lang,index)=>{
        const isLanguageLost=index<wrongGuessCount
    const styles={
        backgroundColor:lang.backgroundColor,
        color:lang.color
    }
    const className=clsx("chip",isLanguageLost&&"lost")
                 return(
        <span 
        className={className}
         style={styles}>
          {lang.name}</span>
        )
    })
    const letterWord=currentWord.split("").map((letter,index)=>{
        const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
        const letterClassName= clsx(
            isGameLost && !guessedLetters.includes(letter)&&"missed-letter"
        )
        return(

      <span key={index}className={letterClassName}>
        {shouldRevealLetter?letter.toUpperCase():""}</span>
          )
          
    })
    const keyboardElement=alphabet.split("").map(letter=> {
           const isGuessed=guessedLetters.includes(letter)
           const iscorrect=isGuessed && currentWord.includes(letter)
           const iswrong=isGuessed && !currentWord.includes(letter)
          
           
           const className=clsx({
             correct:iscorrect,
             wrong:iswrong
        })
        console.log(className)

        return(
        <button
        className={className} 
        key={letter}
        disabled={isGameOver} 
        aria-disabled={isGameOver}
        onClick={()=>addGuessedLetter(letter)}>
            {letter.toUpperCase()}
            </button>
    )
})
const gameStatusClass=clsx("game-status",{
    won:isGamewon ,
    lost:isGameLost,
     farewell: !isGameOver && isLastGuessedIncorrect
   
})
 
    
  
function renderGameStatus(){
    if(!isGameOver && isLastGuessedIncorrect ){
        return (
            <>
        <p className="farewell-message">
            {getFarewellText(languages[wrongGuessCount-1]?.name)}</p>
            </>
   ) }
  if(isGamewon  ){
        return(
               <>
              <Confetti width={width} height={height} />
               <h2>you Win!</h2>
               <p>Well Done</p>
                </>

        )
    }
    if(isGameLost){
        return(
           <>
              <h2>Game Over!</h2>
                <p>You Lose!Better Start Learning Assembly</p>
              </>
        )
    }

  
}
    return(
        <main>
               <header>
                <h1>Assembly : Endgame</h1>
                <p>Guess the word within 8 attempts to keep programming world safe from Assembly!</p>
                </header>
                <section 
                aria-live="polite"
                role="status"
                className={gameStatusClass}>
                    {renderGameStatus()}
                     </section>
           
                <section className="language-chips">
                    {languageElement}
                    </section> 
                    <section className="word">
                        {letterWord}
                        </section> 

                    
                    <section className="keyboard">
                        {keyboardElement}
                        </section>

                       {isGameOver && 
                       <button className="newgame" onClick={startNewGame}>
                            New Game</button>  }      
        </main>
    )
}
