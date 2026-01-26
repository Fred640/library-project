import { useState, useEffect } from "react";
import apiService from "../services/api";
export const useDiary = (diary_slug) => {
    const [diary, setDiary] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiService.getDiaryBySlug(diary_slug)
                const data = response.data
                setDiary(data)
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [diary_slug])
    return {diary, loading, error}
}