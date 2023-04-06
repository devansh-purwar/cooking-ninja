import './Search.css'
import { useLocation } from 'react-router-dom'
// import { useFetch } from '../../hooks/useFetch'
import { projectFirestore } from '../../firebase/config'
import RecipeList from '../../components/RecipeList'
import { useEffect, useState } from 'react'

export default function Search() {

    const [data, setData] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)

    const queryString = useLocation().search
    const queryParams = new URLSearchParams(queryString)
    const query = queryParams.get('q')
    // const url = `http://localhost:3000/recipes?q=` + query
    // const { data, error, isPending } = useFetch(url)
    // console.log(data, error, isPending, url, queryString, queryParams)

    useEffect(() => {
        const unsub = projectFirestore.collection('recipes').onSnapshot((snapshot) => {
            setIsPending(true)
            if (snapshot.empty) {
                setError('No recipes to load')
                setIsPending(false)
            } else {
                let results = []
                snapshot.docs.forEach(doc => {
                    results.push({ id: doc.id, ...doc.data() })
                })
                results = results.filter((recipe) => {
                    return recipe.title === query
                })
                setData(results)
                setIsPending(false)
            }
        }, (err) => {
            setError(err.message)
            setIsPending(false)
        })

        return () => unsub()
    }, [query])

    return (
        <div>
            <h2 className="page-title">Recipes including "{query}"</h2>
            {error && <p className='error'>{error}</p>}
            {isPending && <p className='loading'>Loading...</p>}
            {data && <RecipeList recipes={data} />}
        </div>
    )
}
