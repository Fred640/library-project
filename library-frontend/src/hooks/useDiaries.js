import { useState, useEffect } from "react";
import apiService from "../services/api";
export const useDiaries = () => {
    const [diaries, setDiaries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiService.getDiaries()
                setDiaries([...response.data])
                setLoading(false)
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])
    return {diaries, loading, error}
}