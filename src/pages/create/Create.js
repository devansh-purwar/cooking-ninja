import './Create.css'
import { useState, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { projectFirestore } from '../../firebase/config'
// import { useFetch } from '../../hooks/useFetch'
export default function Create() {
    const [method, setMethod] = useState('')
    const [title, setTitle] = useState('')
    const [cookingTime, setCookingTime] = useState('')
    const [newIngredient, setNewIngredient] = useState('')
    const [ingredients, setIngredients] = useState([])
    const ingredientInput = useRef(null)
    const history = useHistory()
    const handleSubmit = async (e) => {
        e.preventDefault()
        // postData({ title, ingredients, method, cookingTime: cookingTime + " minutes" })
        const doc = { title, ingredients, method, cookingTime: cookingTime + " minutes" }
        try {
            await projectFirestore.collection('recipes').add(doc)
            history.push('/')
        } catch (err) {
            console.log(err)
        }
    }

    // const { postData, data, error } = useFetch("http://localhost:3000/recipes", "POST")


    // useEffect(() => {
    //     if (data) {
    //         history.push("/")
    //     }
    // }, [data, history])


    const handleAdd = (e) => {
        e.preventDefault()
        const ing = newIngredient.trim()

        if (ing && !ingredients.includes(ing)) {
            setIngredients(prev => [...ingredients, ing])
        }
        setNewIngredient('')
        ingredientInput.current.focus()
    }
    return (
        <div className='create'>
            <h2 className='page-title'> Add a New Recipe</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Recipe title:</span>
                    <input
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        required
                    />
                </label>

                {/* recipe ingredients here */}

                <label >
                    <span>
                        Recipe Ingredient:
                    </span>
                    <div className="ingredients">
                        <input
                            type="text"
                            value={newIngredient}
                            onChange={(e) => setNewIngredient(e.target.value)}
                            ref={ingredientInput}
                        />
                        <button
                            className='btn'
                            onClick={handleAdd}
                        >Add
                        </button>
                    </div>
                </label>
                <p>Current Ingredients: {ingredients.map(ing => <em key={ing}>{ing},</em>)}</p>

                <label>
                    <span>Recipe Method:</span>
                    <textarea
                        onChange={(e) => setMethod(e.target.value)}
                        value={method}
                        required
                    />
                </label>
                <label>
                    <span>Recipe Cooking time (minutes):</span>
                    <input
                        type="number"
                        onChange={(e) => setCookingTime(e.target.value)}
                        value={cookingTime}
                        required
                    />
                </label>
                <button className='btn'> Submit </button>
            </form>
        </div>
    )
}
