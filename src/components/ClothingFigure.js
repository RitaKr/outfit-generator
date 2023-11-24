import { useState } from "react";
import {
	removeClothing,
	updateClothing,
	weatherConditions,
} from "../assets/DBManipulations";

export default function ClothingFigure({ data, handleDialogOpen }) {
	const [inLaundry, setInLaundry] = useState(data.inLaundry);
	function updateInLaundry(e) {
		setInLaundry(!inLaundry);
		data.inLaundry = !inLaundry;
		console.log("new inLaundry: " + data.inLaundry);
		updateClothing(data);
	}
	function handleDelete(e) {
		if (window.confirm("Are you sure you want to delete " + data.name + "? All your outfits that contained this item will be deleted as well")) {
			removeClothing(data.id, data.imageName);
		}
	}
	function handleEdit(e) {
		handleDialogOpen();
	}
	
	return (
		<figure className={"clothing-card " + (inLaundry && " inLaundry")}>
			{handleDialogOpen && (
				<>
					<button
						className="icon-btn clothing-card-btn edit-btn"
						onClick={handleEdit}
					></button>
					<button
						className="icon-btn clothing-card-btn delete-btn"
						onClick={handleDelete}
					></button>
				</>
			)}

			<img
				src={data.imageUrl}
				className="clothing-card-image"
				alt={data.imageName}
			/>
			<figcaption className="clothing-card-info">
				<h2 className="card-title">{data.name}</h2>
				<h3 className="card-sub-title">{data.type}</h3>

				<h3>Temperature tags:</h3>
				<div className="tags-container">
					{data.temperatures.map((temp) => (
						<span key={temp} className="temperature-tag">
							{temp} C°
						</span>
					))}
				</div>
			</figcaption>

			<div className="laundry-check-container checkbox-container">
				{handleDialogOpen ? <>
				<input
					type="checkbox"
					name="inLaundry"
					checked={inLaundry}
					className="check-input"
					onChange={updateInLaundry}
				/>
				<label>is in laundry</label>
				</>
				:
				<label>{data.inLaundry ? "In laundry":"Not in laundry"}</label>}
			</div>
		</figure>
	);
}
