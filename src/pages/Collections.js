import Nav from "../components/Nav";
import Footer from "../components/Footer";
import {  useEffect, useState } from "react";
import { getOutfits, database } from "../assets/DBManipulations";
import { updateUser} from "../assets/AuthManipulations";
import { onChildRemoved, ref } from "firebase/database";
import Loader from "../components/Loader";
import OutfitFigure from "../components/OutfitFigure";
export default function Collections({ name }) {
	const [user, setUser] = useState(null);
	const [outfits, setOutfits] = useState(null);
	useEffect(() => {
		updateUser(setUser);
	}, []);

	useEffect(() => {
		if (user) {
			//setUser(auth.currentUser);
			//getClothes(setClothes);
			getOutfits(name).then((data) => {
				console.log("outfits fetched", data);
				setOutfits(data);
			});
            onChildRemoved(ref(database, `outfits/${user.uid}/${name}`), (data) => {
                getOutfits(name).then((data) => {
                    console.log("outfits after deleting", data);
                    setOutfits(data);
                });
            });
		}
	}, [user, name]);


	return (
		<>
			<Nav />
			<main className="page-main">
				<h1 className="page-title">{name} Collection</h1>

				{outfits ? (
					<div className="outfits-container">
						{outfits.length > 0 ? (
							outfits.map((outfit) => (
								<OutfitFigure clothes={outfit.clothes} id={outfit.id} collection={name} key={outfit.id} />
							))
						) : (
							<p>No outfits in this collection yet</p>
						)}
					</div>
				) : (
					<Loader />
				)}
			</main>
			<Footer />
		</>
	);
}
