import { useState, useEffect } from "react"
import apiService from "../services/api"

export const useUser = (username) => {
    const [user, setUser] = useState({})
    const [diaries, setDiaries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiService.getUser(username)
                const data = response.data
                setUser(
                    {id: data.id,
                    username: data.username,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    }
                )
                setDiaries([...data.diaries])
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [username]);
    return {user, diaries, loading, error}
}