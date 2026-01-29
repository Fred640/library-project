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
            console.log(' Начинаем создание дневника...', diaryData);
            
            const token = localStorage.getItem('token');
            console.log(' Токен:', token ? 'Есть' : 'Нет');
            
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
            console.log(' Добавлен файл в поле "file":', fileToUpload.name);
            
            console.log(' Содержимое FormData:');
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`  ${key}: ${value.name} (${value.size} байт, type: ${value.type})`);
                } else {
                    console.log(`  ${key}: ${value}`);
                }
            }
            
            console.log(' Отправляем запрос на сервер...');
            
            const response = await fetch('http://localhost:8000/api/diaries/create/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData
            });
            
            console.log(' Статус ответа:', response.status);
            console.log(' Заголовки ответа:', Object.fromEntries(response.headers.entries()));
            
            if (!response.ok) {
                let errorText = await response.text();
                console.error('❌ Ошибка сервера:', errorText);
                
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch {
                    errorData = { detail: errorText || `Ошибка ${response.status}` };
                }
                
                console.log(' Данные ошибки:', errorData);
                
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
            console.log(' Дневник создан успешно!', data);
            
            setCreatedDiary(data);
            setSuccess(true);
            
            return {
                success: true,
                diary: data
            };
            
        } catch (err) {
            console.error(' Ошибка создания дневника:', err);
            
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