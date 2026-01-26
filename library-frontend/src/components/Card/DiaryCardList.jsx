import React from "react";
import DiaryCard from "./DiaryCard";

const DiaryCardList = ({ diaries }) => {  // Деструктурируем пропс правильно
    const sliceFunc = (array, size) => {
        const rows = [];
        for (let i = 0; i < array.length; i += size) {
            rows.push(array.slice(i, i + size));
        }
        return rows;
    };
    
    if (!diaries || diaries.length === 0) {
        return <div className="container">Нет дневников</div>;
    }
    
    const rows = sliceFunc(diaries, 6);
    
    return (
        <div className="container">
            {rows.map((row, rowIndex) => (
                <div 
                    className="justify-content-center" 
                    style={{ marginBottom: "7px", marginTop: "7px" }} 
                    key={`row-${rowIndex}`}
                >
                    {row.map((diary) => (
                        <div 
                            className="col-lg-2 col-sm-4 col-md-2 col-4" 
                            style={{ padding: 5 }}
                            key={`diary-${diary.id}`}
                        >
                            <DiaryCard diary={diary} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default DiaryCardList;