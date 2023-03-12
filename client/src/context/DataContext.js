import React, {createContext} from "react";
import { useState } from "react";

export const DataContext = createContext();

export const DataContextProvider = ({children}) => {
    const [isEditClicked, setIsEditClicked] = useState(false)
    const [isDeleteClicked, setIsDeleteClicked] = useState(false)

    return (
        <DataContext.Provider value={{isEditClicked, setIsEditClicked, isDeleteClicked, setIsDeleteClicked}}>
            {children}
        </DataContext.Provider>
    );
}