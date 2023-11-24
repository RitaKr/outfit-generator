import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useRef, useEffect } from "react";
import L from "leaflet";
export default function Contacts() {
    const mapContainer = useRef(null);
    const coordinates = [50.46455619943056, 30.51938346835162];

	

    useEffect(()=>{
        const map = L.map(mapContainer.current).setView(coordinates, 16);
        console.log(mapContainer)
    
        //adding OpenStreetMap layer
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    
        //adding marker with coordinates
        L.marker(coordinates).addTo(map);
    })
    return (
        <>
        <Nav/>
        <main className="page-main">
            <h1 className="page-title">Contacts</h1>
            <h3 className="contacts">example@example.com</h3>
            <h3 className="contacts">+380123456789</h3>
            <h3 className="contacts">National University of Kyiv Mohyla Academy</h3>
            <div className="map" ref={mapContainer}></div>
        </main>
        <Footer/>
        </>
    )
}