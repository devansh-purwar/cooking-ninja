import './Recipe.css'
import { useParams } from 'react-router-dom'
// import { useFetch } from '../../hooks/useFetch'
import { useTheme } from '../../hooks/useTheme'
import { useEffect, useState } from 'react'
import { projectFirestore } from '../../firebase/config'

export default function Recipe() {


    const { id } = useParams()
    const { mode } = useTheme()
    // const { data: recipe, isPending, error } = useFetch(`http://localhost:3000/recipes/${id}`)
    const [recipe, setRecipe] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)
    useEffect(() => {
        setIsPending(true)
        const unsub = projectFirestore.collection('recipes').doc(id).onSnapshot((doc) => {
            // console.log(doc)
            if (doc.exists) {
                setIsPending(false)
                setRecipe(doc.data())
            } else {
                setIsPending(false)
                setError("Could not able to find recipe")
            }
        })

        return () => unsub()
    }, [id])

    const handleClick = () => {
        projectFirestore.collection('recipes').doc(id).update({
            title: "Something totally unique"
        })
    }
    return (
        <div className={`recipe ${mode}`}>
            {error && (<p className='error'>Could not able to fetch data</p>)}
            {isPending && (<p className='loading'>Loading ...</p>)}
            {recipe && (
                <>
                    <h2 className='page-title'>{recipe.title}</h2>
                    <p>Takes {recipe.cookingTime} to cook.</p>
                    <ul>
                        {recipe.ingredients.map(ing => <li key={ing}>ing</li>)}
                    </ul>
                    <p className="method">{recipe.method}</p>
                    <button onClick={handleClick}>Update title</button>
                </>
            )}
        </div>
    )
}
