import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateDiary } from '../hooks/useCreateDiary';
import { useAuth } from "../components/context/AuthContext";
import '../styles/pages/CreateDiaryPage.css'
import Inp from '../components/UI/input/Inp';

const CreateDiaryPage = () => {
    const navigate = useNavigate();
    const { createDiary, loading, error, success, createdDiary } = useCreateDiary();
    const { user, isAuthenticated } = useAuth();
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState('regular');
    
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/reg');
        }
    }, [isAuthenticated, navigate, user]);
    
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
        
        const result = await createDiary(diaryData);
        
        if (result.success) {
            setTimeout(() => {
                setTitle('');
                setDescription('');
                setFile(null);
                const fileInput = document.getElementById('fileInput');
                if (fileInput) fileInput.value = '';
                
                if (result.diary?.slug) {
                    console.log('qwerty');
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
        <>
            <div className='mainDiv'>
                <div className='window'>
                    <div className='titleDiv'>
                        Создание дневника
                    </div>
                    <div>
                        {/* Отображение ошибок */}
                        {error && (
                            <div className="error-message" style={{
                                backgroundColor: '#fff5f5',
                                color: '#c53030',
                                padding: '15px',
                                margin: '0 20px 20px 20px',
                                borderRadius: '10px',
                                border: '1px solid #feb2b2'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '20px' }}>⚠️</span>
                                    <h3 style={{ margin: 0, fontSize: '16px' }}>Произошла ошибка:</h3>
                                </div>
                                <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{error}</p>
                            </div>
                        )}
                        
                        {success && createdDiary && (
                            <div className="success-message" style={{
                                backgroundColor: '#f0fff4',
                                color: '#276749',
                                padding: '15px',
                                margin: '0 20px 20px 20px',
                                borderRadius: '10px',
                                border: '1px solid #9ae6b4'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '20px' }}></span>
                                    <h3 style={{ margin: 0, fontSize: '16px' }}>Дневник создан успешно!</h3>
                                </div>
                                <p style={{ margin: 0 }}>
                                    Дневник "<strong>{createdDiary.title}</strong>" был успешно создан.
                                </p>
                            </div>
                        )}
                        
                        <form className='container' noValidate onSubmit={handleSubmit}>
                            <Inp
                                label="Название" 
                                id="title" 
                                name="title"
                                type="text"
                                required
                                disabled={loading}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <textarea 
                                className="form-control" 
                                placeholder="Описание" 
                                id="description"
                                style={{height:"100px", width:"500px", marginBottom:"20px"}}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <div style={{ 
                                display: 'flex', 
                                gap: '20px',
                                flexWrap: 'wrap',
                                marginBottom: '20px'
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
                                            <div style={{ fontSize: '50px', marginBottom: '15px' }}>
                                                {fileType === 'zip' ? '' : ''}
                                            </div>
                                            <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                                                {file.name}
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
                                            <div style={{ fontSize: '50px', marginBottom: '15px' }}>
                                                {fileType === 'zip' ? '' : ''}
                                            </div>
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
                                marginTop: '20px'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className='submitButton'
                                    disabled={loading}
                                >
                                    ← Назад
                                </button>
                                
                                <button
                                    type="submit"
                                    className='submitButton'
                                    disabled={loading || !title || !description || !file}
                                    
                                >
                                    {loading ? (
                                        <>
                                            <span>Создание...</span>
                                            <div style={{
                                                width: '16px',
                                                height: '16px',
                                                border: '2px solid rgba(255,255,255,0.3)',
                                                borderTopColor: 'white',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite'
                                            }}></div>
                                        </>
                                    ) : (
                                        'Создать дневник'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateDiaryPage;