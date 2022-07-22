import React, { ReactElement, useEffect } from 'react'
import { useGetPokemonByNameQuery } from './pokemon.api'
import axios from 'axios'

const useAxiosRequestDemo = () => {
  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/todos/1', {
        headers: {
          'Content-Security-Policy': '*',
        },
      })
      .then(console.log)
      .catch(console.error)
  }, [])
}

export const PokemonView = (): ReactElement => {
  const { data, error, isLoading } = useGetPokemonByNameQuery('bulbasaur')

  useAxiosRequestDemo()

  return (
    <div className="App">
      {error ? (
        <>Oh no, there was an error</>
      ) : isLoading ? (
        <>Loading...</>
      ) : data ? (
        <>
          <h3>{data.species.name}</h3>
          <img src={data.sprites.front_shiny} alt={data.species.name} />
        </>
      ) : null}
    </div>
  )
}
