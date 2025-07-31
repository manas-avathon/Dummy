import React from "react";

const Home: React.FC = () => {
    return(
        <div className="p-8">
            <h1 className="text-center text-5xl p-8 font-bold uppercase">   
                Welcome to Home Page
            </h1>
            <p className="text-center text-2xl p-8">
                Click on the GridPage to see the table of countries with their common and official names
            </p>
        </div> 
    );
};

export default Home;