import { useState, useEffect } from 'react';
import { parseFB2Clean } from '../utils/fb2Parser';

export const useBookContent = (downloadURL) => {
    const [content, setContent] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true)
                const fb2 = await fetch(downloadURL)
                const fb2text = await fb2.text()
                const text = await parseFB2Clean(fb2text)
                const result = text.text
                setContent(result)
                setLoading(false)
            } catch (error) {
                setError(error.Message)
            } finally {
                setLoading(false)
            }
        }
        fetchBook()
    }, [downloadURL])
    return {content, loading, error}
}