import './Home.css'
// import { useFetch } from '../../hooks/useFetch'
import RecipeList from '../../components/RecipeList'

import { projectFirestore } from '../../firebase/config'
import { useEffect, useState } from 'react'
export default function Home() {
    const [data, setData] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)

    // const { data, isPending, error } = useFetch("http://localhost:3000/recipes")
    useEffect(() => {
        const unsub = projectFirestore.collection('recipes').onSnapshot((snapshot) => {
            setIsPending(true)
            if (snapshot.empty) {
                setError('No recipes to load')
                setIsPending(false)
            } else {
                const results = []
                snapshot.docs.forEach(doc => {
                    results.push({ id: doc.id, ...doc.data() })
                })
                setData(results)
                setIsPending(false)
            }
        }, (err) => {
            setError(err.message)
            setIsPending(false)
        })

        return () => unsub()
    }, [])
    return (
        <div className='home'>
            {error && (<p>Could not able to fetch data</p>)}
            {isPending && (<p>Loading ... </p>)}
            {data && <RecipeList recipes={data} />}
        </div>
    )
}
