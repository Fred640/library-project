import React, { useState } from "react";
import classes from "./Header.module.css"
import ModalSearch from "./search/Books Search/ModaleSearch";
import Genres from "../genres/Genres";
import "./header.css"
import Btn from "../UI/button/Btn";
import Modal from "../UI/modal/Modal";

const HeaderTemplate = ({ 
    ContainerElements, 
    searchIclude, 
    modaleSearchProps, 
    genresInclude, 
    GenresProps, 
    modaleGenresProps
}) => {
    const [search, setSearch] = useState(false);
    const [genresVisible, setGenresVisible] = useState(false);

    return (
        <>
            <div className={`container ${classes.mainDiv}`}>
                {searchIclude &&
                    <button 
                        className={classes.searchButton} 
                        onClick={() => setSearch(!search)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" fill="#000000ff" viewBox="0 -960 960 960">
                            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                        </svg>
                    </button>
                }
                <div className="row" style={{width:"70%"}}>
                    {ContainerElements.map((element, index) => (
                        <div className={`${element.divClasses} ${classes.headerButton}`} key={index}>
                            {element.content}
                        </div>
                    ))}
                </div>
                {genresInclude && 
                    <Btn 
                        className={classes.genreButton} 
                        onClick={() => {
                            if (modaleGenresProps?.onOpen) {
                                modaleGenresProps.onOpen();
                            } else {
                                setGenresVisible(!genresVisible);
                            }
                        }}
                    >
                        Жанры
                    </Btn>
                }
            </div>
            {searchIclude && <ModalSearch visible={search} {...modaleSearchProps} />}
            {genresInclude && 
                <Modal 
                    visible={modaleGenresProps?.visible !== undefined ? modaleGenresProps.visible : genresVisible}
                    onClose={() => {
                        if (modaleGenresProps?.onClose) {
                            modaleGenresProps.onClose();
                        } else {
                            setGenresVisible(false);
                        }
                    }}
                >
                    <Genres {...GenresProps} />
                </Modal> 
            }
        </>
    );
}

export default HeaderTemplate