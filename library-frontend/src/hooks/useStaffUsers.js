import { useState, useEffect } from "react";
import apiService from "../services/api";
export const useStaffUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                const response = await apiService.getStaffUsers();
                setUsers(response.data)
                setError(null)
            } catch (error) {
                setLoading(false)
                setError(error.text)
            } finally {
                setLoading(false)
            }
        }
        loadUsers()
    }, []);
    return {users, loading, error}
}
