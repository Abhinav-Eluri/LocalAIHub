import React from 'react';
import ImageSlider from "../../components/badminton/image-slider.jsx";
import AvailableSlots from "../../components/badminton/available-slots.jsx";

function Home(props) {
    return (
        <>
            <ImageSlider/>
            <AvailableSlots />
        </>)
}

export default Home;