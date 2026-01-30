import { useState } from "react";

export const useCreateDiary = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [createdDiary, setCreatedDiary] = useState(null);

    const createDiary = async (diaryData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        setCreatedDiary(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Токен не найден. Войдите в систему.');
            }
            
            const fileToUpload = diaryData.file || diaryData.zip_file;
            if (!fileToUpload) {
                throw new Error('Выберите файл для загрузки');
            }
            
            const formData = new FormData();
            formData.append('title', diaryData.title.trim());
            formData.append('description', diaryData.description.trim());
            
            formData.append('file', fileToUpload);

            
            const response = await fetch('http://localhost:8000/api/diaries/create/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData
            });
            
            
            if (!response.ok) {
                let errorText = await response.text();
                
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch {
                    errorData = { detail: errorText || `Ошибка ${response.status}` };
                }
                
                
                if (response.status === 401) {
                    throw new Error('Неавторизован. Токен недействителен. Пожалуйста, войдите заново.');
                } else if (response.status === 400) {
                    let errorMessage = 'Ошибка валидации: ';
                    if (errorData) {
                        if (typeof errorData === 'object') {
                            const errors = [];
                            for (const [key, value] of Object.entries(errorData)) {
                                if (Array.isArray(value)) {
                                    errors.push(`${key}: ${value.join(', ')}`);
                                } else {
                                    errors.push(`${key}: ${value}`);
                                }
                            }
                            errorMessage += errors.join('\n');
                        } else {
                            errorMessage += errorData;
                        }
                    }
                    throw new Error(errorMessage);
                } else if (errorData?.detail) {
                    throw new Error(errorData.detail);
                } else {
                    throw new Error(`Ошибка ${response.status}`);
                }
            }
            
            const data = await response.json();
            
            setCreatedDiary(data);
            setSuccess(true);
            
            return {
                success: true,
                diary: data
            };
            
        } catch (err) {
            
            let errorMessage = err.message || 'Ошибка при создании дневника';
            setError(errorMessage);
            
            return {
                success: false,
                error: errorMessage
            };
            
        } finally {
            setLoading(false);
        }
    };

    return {
        createDiary,
        loading,
        error,
        success,
        createdDiary
    };
};