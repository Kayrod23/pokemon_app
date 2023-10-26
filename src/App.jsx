import { useRef, useState } from 'react'
import './App.css'

function App() {
  const [team, setTeam] = useState([]);
  const [nickName, setNickName] = useState("")
  const formRef = useRef();
  const inputRef = useRef();

  async function addPokemonToTeam (e) {
    e.preventDefault()
    const req = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputRef.current.value}`);
    const res = await req.json()
    if(req.ok ) {
      if (team.length < 6) {
        const existingPokemonNames = team.map(pk => pk.name.toLowerCase());
        if (!existingPokemonNames.includes(inputRef.current.value)) {
          console.log('res', res);
          setTeam([...team, {name: res.name, img: res.sprites.front_shiny, nickName: "", moves: res.moves.slice(0,4)}]) 
        } else {
          alert('You have all ready added this pokemon')
        }
      } else {
        alert(`No more room on your team`)
      }
    }
  }

  function rename (e, name) {
    e.preventDefault();
    let editTeam = [...team];
    let pokemon = {};
    for (let i=0; i<editTeam.length; i++) {
      if (name === editTeam[i].name) {
        pokemon = {...team[i]};
        pokemon.nickName = nickName;
        editTeam[i] = pokemon;
      }
    }
    setTeam(editTeam);
    setNickName("")
    }

    function deleteNickName (name) {
      let editTeam = [...team];
      let pokemon = {};
      for (let i=0; i<editTeam.length; i++) {
        if (name === editTeam[i].name) {
          pokemon = {...team[i]};
          pokemon.nickName = "";
          editTeam[i] = pokemon;
        }
      }
      setTeam(editTeam);
      setNickName("")
      }

  return (
    <div>
      <h2>Create a Pokemon Team</h2>
      <div style={{display: 'flex', gap: 4}}>
        {team ? 
        team.map((pokemon, index) => {
          return <div key={index} style={{border: '1px solid #3f3f3f'}}>
            <img alt={index} src={pokemon.img} style={{width: 150, height: 150}}/>
            <h3>{pokemon.nickName ? 
            <div >
              <h4>
              {pokemon.nickName}
              <button onClick={()=>deleteNickName(pokemon.name)}>x</button>
              </h4>
            </div>
         : pokemon.name}</h3>
            {pokemon.moves.map((move, index) => {
             return <p key={index}>{move.move.name}</p>
            })}
            <form onSubmit={(e)=>rename(e, pokemon.name)}>
              <input type="text" maxLength={36} onChange={(e) => setNickName(e.target.value)}/><br/>
              <button type='submit'>Rename</button>
            </form>
          </div>
        }) 
        : null}
      </div><br/>
      <form onSubmit={addPokemonToTeam} ref={formRef}>
        <input ref={inputRef} type='text' placeholder='Enter pokemon name'/><br/>
        <button type='submit'>Add Pokemon</button>
      </form>
    </div>
  )
}

export default App
