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
            <div className='create-diary-page'>
                <div className='mainDiv'>
                <div className='window'>
                    <div className='titleDiv'>
                        Создание дневника
                    </div>
                    <div>
                        {error && (
                            <div className="error-message">
                                <div className="message-header">
                                    <span className="message-icon">⚠️</span>
                                    <h3 className="message-title">Произошла ошибка:</h3>
                                </div>
                                <p className="message-text">{error}</p>
                            </div>
                        )}
                        
                        {success && createdDiary && (
                            <div className="success-message">
                                <div className="message-header">
                                    <span className="message-icon"></span>
                                    <h3 className="message-title">Дневник создан успешно!</h3>
                                </div>
                                <p className="message-text">
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
                                className="form-control description-textarea" 
                                placeholder="Описание" 
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                disabled={loading}
                            />
                            
                            <div className="file-type-container">
                                <div 
                                    className={`file-type-card ${fileType === 'regular' ? 'active' : ''}`}
                                    onClick={() => !loading && setFileType('regular')}
                                >
                                    <div className="file-type-content">
                                        <div>
                                            <h4 className="file-type-title">Обычный файл</h4>
                                            <p className="file-type-description">
                                                TXT, PDF, DOC, MD
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="radio"
                                        checked={fileType === 'regular'}
                                        onChange={() => setFileType('regular')}
                                        disabled={loading}
                                        className="file-type-radio"
                                    />
                                </div>
                                
                                <div 
                                    className={`file-type-card ${fileType === 'zip' ? 'active' : ''}`}
                                    onClick={() => !loading && setFileType('zip')}
                                >
                                    <div className="file-type-content">
                                        <div>
                                            <h4 className="file-type-title">ZIP архив</h4>
                                            <p className="file-type-description">
                                                Несколько файлов в архиве
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="radio"
                                        checked={fileType === 'zip'}
                                        onChange={() => setFileType('zip')}
                                        disabled={loading}
                                        className="file-type-radio"
                                    />
                                </div>
                            </div>
                            
                            <div className="file-upload-section">
                                <label className="file-upload-label">
                                    {fileType === 'zip' ? 'ZIP архив *' : 'Файл дневника *'}
                                </label>
                                
                                <div 
                                    className={`file-dropzone ${loading ? 'disabled' : ''}`}
                                    onClick={() => !loading && document.getElementById('fileInput').click()}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.add('drag-over');
                                    }}
                                    onDragLeave={(e) => {
                                        e.currentTarget.classList.remove('drag-over');
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        if (loading) return;
                                        
                                        e.currentTarget.classList.remove('drag-over');
                                        
                                        const droppedFile = e.dataTransfer.files[0];
                                        if (droppedFile) {
                                            handleFileChange({ target: { files: [droppedFile] } });
                                        }
                                    }}
                                >
                                    {file ? (
                                        <>
                                            <div className="file-icon">
                                                {fileType === 'zip' ? '' : ''}
                                            </div>
                                            <p className="file-name">
                                                {file.name}
                                            </p>
                                            <button
                                                type="button"
                                                className="file-remove-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFile(null);
                                                    document.getElementById('fileInput').value = '';
                                                }}
                                            >
                                                Удалить файл
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="upload-icon">
                                                {fileType === 'zip' ? '' : ''}
                                            </div>
                                            <p className="upload-title">
                                                Нажмите или перетащите файл
                                            </p>
                                            <p className="upload-description">
                                                {fileType === 'zip' 
                                                    ? 'Поддерживаются только ZIP архивы' 
                                                    : 'Поддерживаются: TXT, PDF, DOC, DOCX, MD'}
                                            </p>
                                            <button
                                                type="button"
                                                className="upload-button"
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
                                    className="hidden-input"
                                    disabled={loading}
                                />
                                
                                <p className="file-size-hint">
                                    Максимальный размер файла: 100MB
                                </p>
                            </div>
                            
                            <div className="form-actions">
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
                                            <div className="spinner"></div>
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
        </div>
            
        </>
    );
};

export default CreateDiaryPage;