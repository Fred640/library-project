import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateDiary } from '../hooks/useCreateDiary';
import { useAuth } from "../components/context/AuthContext";

const CreateDiaryPage = () => {
    const navigate = useNavigate();
    const { createDiary, loading, error, success, createdDiary } = useCreateDiary();
    const { user, isAuthenticated } = useAuth();
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState('regular');
    

    useEffect(() => {
        console.log(' Проверка авторизации...');
        console.log(' Пользователь:', user?.username);
        console.log(' Авторизован:', isAuthenticated);
        console.log(' Токен в localStorage:', localStorage.getItem('token') ? 'Есть' : 'Нет');
        
        if (!isAuthenticated) {
            console.log(' Не авторизован, перенаправляем на логин');
            alert('Для создания дневника необходимо войти в систему');
            navigate('/reg');
        }
    }, [isAuthenticated, navigate, user]);
    
    if (!isAuthenticated) {
        return (
            <div style={{ 
                maxWidth: '600px', 
                margin: '100px auto', 
                textAlign: 'center',
                padding: '40px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px'
            }}>
                <h2 style={{ color: '#dc3545', marginBottom: '20px' }}> Доступ запрещен</h2>
                <p style={{ fontSize: '18px', marginBottom: '30px' }}>
                    Для создания дневника необходимо войти в систему
                </p>
                <button
                    onClick={() => navigate('/reg')}
                    style={{
                        padding: '12px 30px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Войти / Зарегистрироваться
                </button>
            </div>
        );
    }
    
    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
        alert('Введите название дневника');
        return;
    }
    
    if (!description.trim()) {
        alert('Введите описание дневника');
        return;
    }
    
    if (!file) {
        alert('Выберите файл для загрузки');
        return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Сессия истекла. Пожалуйста, войдите заново.');
        navigate('/reg');
        return;
    }
    
    const diaryData = {
        title: title.trim(),
        description: description.trim(),
        file: file
    };
    
    console.log(' Отправка данных дневника...', diaryData);
    const result = await createDiary(diaryData);
    
    if (result.success) {
        setTimeout(() => {
            setTitle('');
            setDescription('');
            setFile(null);
            const fileInput = document.getElementById('fileInput');
            if (fileInput) fileInput.value = '';
            
            if (result.diary?.slug) {
                setTimeout(() => {
                    if (window.confirm('Дневник успешно создан! Перейти к просмотру?')) {
                        navigate(`/diary/${result.diary.slug}`);
                    }
                }, 500);
            }
        }, 2000);
    }
};

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        

        const maxSize = 100 * 1024 * 1024;
        if (selectedFile.size > maxSize) {
            alert('Файл слишком большой. Максимальный размер: 100MB');
            e.target.value = '';
            return;
        }
        
        setFile(selectedFile);
    };

    return (
        <div style={{
            maxWidth: '800px',
            margin: '40px auto',
            padding: '40px',
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
        }}>
            <div style={{
                backgroundColor: '#e8f4ff',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '30px',
                borderLeft: '5px solid #007bff'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: '#007bff',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold'
                    }}>
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>
                            Создаете дневник как:
                        </p>
                        <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                            {user?.username}
                        </p>
                    </div>
                </div>
            </div>
            
            <h1 style={{
                fontSize: '32px',
                color: '#333',
                marginBottom: '10px',
                textAlign: 'center'
            }}>
                📓 Создать новый дневник
            </h1>
            
            <p style={{
                textAlign: 'center',
                color: '#666',
                marginBottom: '40px',
                fontSize: '16px'
            }}>
                Заполните форму ниже чтобы создать свой дневник
            </p>
            
            {error && (
                <div style={{
                    backgroundColor: '#fff5f5',
                    color: '#c53030',
                    padding: '20px',
                    marginBottom: '30px',
                    borderRadius: '10px',
                    border: '1px solid #feb2b2'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '20px' }}></span>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>Произошла ошибка:</h3>
                    </div>
                    <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{error}</p>
                </div>
            )}
            
            {success && createdDiary && (
                <div style={{
                    backgroundColor: '#f0fff4',
                    color: '#276749',
                    padding: '20px',
                    marginBottom: '30px',
                    borderRadius: '10px',
                    border: '1px solid #9ae6b4'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '20px' }}></span>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>Дневник создан успешно!</h3>
                    </div>
                    <p style={{ margin: 0 }}>
                        Дневник "<strong>{createdDiary.title}</strong>" был успешно создан.
                    </p>
                    {createdDiary.slug && (
                        <button
                            onClick={() => navigate(`/diary/${createdDiary.slug}`)}
                            style={{
                                marginTop: '15px',
                                padding: '8px 20px',
                                backgroundColor: '#38a169',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Перейти к дневнику →
                        </button>
                    )}
                </div>
            )}
            
            <form onSubmit={handleSubmit} style={{ marginBottom: '40px' }}>
                <div style={{ marginBottom: '25px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '10px',
                        fontWeight: '600',
                        color: '#333',
                        fontSize: '16px'
                    }}>
                        Название дневника *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '15px',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '16px',
                            transition: 'border-color 0.3s'
                        }}
                        placeholder="Например: Мой путешествие в Японию"
                        disabled={loading}
                        required
                        onFocus={(e) => e.target.style.borderColor = '#007bff'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                    <p style={{ marginTop: '5px', fontSize: '14px', color: '#718096' }}>
                        Придумайте понятное название для вашего дневника
                    </p>
                </div>
                
                <div style={{ marginBottom: '25px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '10px',
                        fontWeight: '600',
                        color: '#333',
                        fontSize: '16px'
                    }}>
                        Описание *
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '15px',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '16px',
                            minHeight: '150px',
                            resize: 'vertical',
                            transition: 'border-color 0.3s'
                        }}
                        placeholder="Опишите что содержится в дневнике, о чем он, какие воспоминания..."
                        disabled={loading}
                        required
                        onFocus={(e) => e.target.style.borderColor = '#007bff'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                    <p style={{ marginTop: '5px', fontSize: '14px', color: '#718096' }}>
                        Подробное описание поможет другим понять содержание дневника
                    </p>
                </div>
                
                <div style={{ marginBottom: '25px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '10px',
                        fontWeight: '600',
                        color: '#333',
                        fontSize: '16px'
                    }}>
                        Тип загружаемого файла
                    </label>
                    <div style={{ 
                        display: 'flex', 
                        gap: '20px',
                        flexWrap: 'wrap'
                    }}>
                        <div 
                            style={{
                                flex: 1,
                                minWidth: '200px',
                                padding: '20px',
                                border: `2px solid ${fileType === 'regular' ? '#007bff' : '#e2e8f0'}`,
                                borderRadius: '10px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                backgroundColor: fileType === 'regular' ? '#f0f8ff' : 'white',
                                transition: 'all 0.3s'
                            }}
                            onClick={() => !loading && setFileType('regular')}
                        >
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '15px',
                                marginBottom: '10px'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: fileType === 'regular' ? '#007bff' : '#e2e8f0',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: fileType === 'regular' ? 'white' : '#666'
                                }}>
                                
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '16px' }}>Обычный файл</h4>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                                        TXT, PDF, DOC, MD
                                    </p>
                                </div>
                            </div>
                            <input
                                type="radio"
                                checked={fileType === 'regular'}
                                onChange={() => setFileType('regular')}
                                disabled={loading}
                                style={{ display: 'none' }}
                            />
                        </div>
                        
                        <div 
                            style={{
                                flex: 1,
                                minWidth: '200px',
                                padding: '20px',
                                border: `2px solid ${fileType === 'zip' ? '#007bff' : '#e2e8f0'}`,
                                borderRadius: '10px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                backgroundColor: fileType === 'zip' ? '#f0f8ff' : 'white',
                                transition: 'all 0.3s'
                            }}
                            onClick={() => !loading && setFileType('zip')}
                        >
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '15px',
                                marginBottom: '10px'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: fileType === 'zip' ? '#007bff' : '#e2e8f0',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: fileType === 'zip' ? 'white' : '#666'
                                }}>
                                    
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '16px' }}>ZIP архив</h4>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                                        Несколько файлов в архиве
                                    </p>
                                </div>
                            </div>
                            <input
                                type="radio"
                                checked={fileType === 'zip'}
                                onChange={() => setFileType('zip')}
                                disabled={loading}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>
                </div>
                
                <div style={{ marginBottom: '40px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '10px',
                        fontWeight: '600',
                        color: '#333',
                        fontSize: '16px'
                    }}>
                        {fileType === 'zip' ? 'ZIP архив *' : 'Файл дневника *'}
                    </label>
                    
                    <div 
                        style={{
                            border: '2px dashed #cbd5e0',
                            borderRadius: '10px',
                            padding: '40px 20px',
                            textAlign: 'center',
                            backgroundColor: '#f8fafc',
                            transition: 'all 0.3s',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => !loading && document.getElementById('fileInput').click()}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.style.borderColor = '#007bff';
                            e.currentTarget.style.backgroundColor = '#f0f8ff';
                        }}
                        onDragLeave={(e) => {
                            e.currentTarget.style.borderColor = '#cbd5e0';
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            if (loading) return;
                            
                            e.currentTarget.style.borderColor = '#cbd5e0';
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                            
                            const droppedFile = e.dataTransfer.files[0];
                            if (droppedFile) {
                                handleFileChange({ target: { files: [droppedFile] } });
                            }
                        }}
                    >
                        {file ? (
                            <>
                                <div style={{ fontSize: '50px', marginBottom: '15px' }}></div>
                                <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                                    {file.name}
                                </p>
                                <p style={{ color: '#666', marginBottom: '15px' }}>
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFile(null);
                                        document.getElementById('fileInput').value = '';
                                    }}
                                    style={{
                                        padding: '8px 20px',
                                        backgroundColor: '#e53e3e',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Удалить файл
                                </button>
                            </>
                        ) : (
                            <>
                                <div style={{ fontSize: '50px', marginBottom: '15px' }}></div>
                                <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                                    Нажмите или перетащите файл
                                </p>
                                <p style={{ color: '#666', marginBottom: '20px' }}>
                                    {fileType === 'zip' 
                                        ? 'Поддерживаются только ZIP архивы' 
                                        : 'Поддерживаются: TXT, PDF, DOC, DOCX, MD'}
                                </p>
                                <button
                                    type="button"
                                    style={{
                                        padding: '10px 25px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Выбрать файл
                                </button>
                            </>
                        )}
                    </div>
                    
                    <input
                        id="fileInput"
                        type="file"
                        accept={fileType === 'zip' ? '.zip' : '.txt,.pdf,.doc,.docx,.md'}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        disabled={loading}
                    />
                    
                    <p style={{ marginTop: '10px', fontSize: '14px', color: '#718096' }}>
                        Максимальный размер файла: 100MB
                    </p>
                </div>
                
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    justifyContent: 'center',
                    marginTop: '40px'
                }}>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={{
                            padding: '15px 30px',
                            backgroundColor: '#718096',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            flex: 1,
                            maxWidth: '200px',
                            opacity: loading ? 0.6 : 1
                        }}
                        disabled={loading}
                    >
                        ← Назад
                    </button>
                    
                    <button
                        type="submit"
                        style={{
                            padding: '15px 30px',
                            backgroundColor: loading ? '#718096' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                            flex: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        disabled={loading || !title || !description || !file}
                    >
                        {loading ? (
                            <>
                                <span>Создание...</span>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '3px solid rgba(255,255,255,0.3)',
                                    borderTopColor: 'white',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                            </>
                        ) : (
                            ' Создать дневник'
                        )}
                    </button>
                </div>
            </form>
            
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
            
            <div style={{
                marginTop: '50px',
                padding: '25px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                borderLeft: '5px solid #38a169'
            }}>
                <h3 style={{ marginTop: 0, color: '#333', marginBottom: '15px' }}>
                     Как создать дневник:
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
                        <div style={{ fontSize: '24px', marginBottom: '10px' }}></div>
                        <h4 style={{ margin: 0, marginBottom: '10px' }}>Придумайте название</h4>
                        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                            Название должно отражать содержание дневника
                        </p>
                    </div>
                    <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
                        <div style={{ fontSize: '24px', marginBottom: '10px' }}></div>
                        <h4 style={{ margin: 0, marginBottom: '10px' }}>Опишите содержание</h4>
                        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                            Расскажите о чем ваш дневник
                        </p>
                    </div>
                    <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
                        <div style={{ fontSize: '24px', marginBottom: '10px' }}></div>
                        <h4 style={{ margin: 0, marginBottom: '10px' }}>Загрузите файл</h4>
                        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                            Выберите файл или ZIP архив
                        </p>
                    </div>
                    <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
                        <div style={{ fontSize: '24px', marginBottom: '10px' }}></div>
                        <h4 style={{ margin: 0, marginBottom: '10px' }}>Нажмите создать</h4>
                        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                            Дневник будет доступен после обработки
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateDiaryPage;