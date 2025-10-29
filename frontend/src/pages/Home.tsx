import React from "react";
import Hero from "../common/componets/Hero";

const Home: React.FC = () => {
    return (
        <div>
            <Hero />
        </div>
    )
}

export default React.memo(Home);