import DialogWindow from "./Dialog";
import { useState, useEffect, useRef } from "react";

import {
	writeClothing,
	emptyForm,
	temperatureRanges,
} from "../assets/DBManipulations";
import { uploadToStorageAndDB } from "../assets/StorageManipulations";
import InvalidFeedback from "./InvalidFeedback";
import SuccessAlert from "./SuccessAlert";
import ErrorAlert from "./ErrorAlert";
import InfoAlert from "./InfoAlert";

const Required = () => {
	return <span className="red">*</span>;
};
export default function AddClothingDialog({
	data,
	dialogOpen,
	handleDialogClose,
}) {
	const [clothing, setClothing] = useState(data.clothing);
	const [imageBlob, setImageBlob] = useState(null);
	const [formSubmitted, setFormSubmitted] = useState(false);
	const [uploadingProgress, setUploadingProgress] = useState(null);
	const [error, setError] = useState(null);
	const [bgRemoveStatus, setBgRemoveStatus] = useState(null);
	const imageInput = useRef(null);

	function isTemperaturesValid() {
		return clothing.temperatures.length > 0;
	}
	function isTypeValid() {
		return clothing.type !== "none";
	}
	function validateImage() {
		return (
			imageBlob != null ||
			clothing.imageUrl.startsWith(
				"https://firebasestorage.googleapis.com/v0/b/outfit-generator-fa21a.appspot.com"
			)
		);
	}
	function dataIsValid() {
		return isTemperaturesValid() && isTypeValid() && validateImage();
	}
	async function handleSubmit(e) {
		e.preventDefault();
		if (dataIsValid()) {
			console.log(clothing.id);
			console.log(imageBlob);

			console.log(clothing);
			if (imageBlob)
				await uploadToStorageAndDB(
					imageBlob,
					clothing,
					setClothing,
					setUploadingProgress,
					setError
				);
			else {
				writeClothing(clothing);
				setUploadingProgress(100);
			}
			setFormSubmitted(true);

			if (!data.editingMode) {
				setClothing(emptyForm);
				resetCheckboxes();
				setImageBlob(null);
				setBgRemoveStatus(null);
				imageInput.current.value = null;
			}
		} else if (!validateImage()) {
			setError("You have to upload an image!");
		}
	}
	function resetCheckboxes() {
		const checkboxes = document.querySelectorAll('input[type="checkbox"]');
		checkboxes.forEach((checkbox) => {
			checkbox.checked = false;
		});
		//setClothing({ ...clothing, temperatures: [] });
	}

	useEffect(() => {
		if (!data.clothing.conditions)
			setClothing({ ...data.clothing, conditions: [] });
		else setClothing(data.clothing);
		//console.log(clothing)
		//setImageBlob(data.imageUrl);
	}, [data]);
	useEffect(() => {
		if (!dialogOpen && formSubmitted) {
			setFormSubmitted(false);
		}
	}, [data, dialogOpen, formSubmitted]);

	const handleFileInputChange = (event) => {
		const file = event.target.files[0];
		setImageBlob(file);
		setClothing({
			...clothing,
			imageUrl: URL.createObjectURL(file),
			imageName: file.lastModified + file.name,
		});
		//setImageBlob(file);
		console.log(file);
		setFormSubmitted(false);
		//uploadImage(file);
		//await uploadImageToStorage(file);
	};

	const uploadImageToApi = async (file) => {
		//const axios = require("axios");
		console.log("click");
		setBgRemoveStatus("uploading");
		// API endpoint
		const form = new FormData();
		const fileName = file.lastModified + file.name;

		form.append("image_file", file);

		fetch("https://clipdrop-api.co/remove-background/v1", {
			method: "POST",
			headers: {
				"x-api-key":
					"07e8092a550f2e373d618b31ff3edac605fb6db885cde258a84c5e6db5580d18d4dc797b1c206d33459e7498f84bb52e",
			},
			body: form,
		})
			.then((response) => {
				console.log(response);
				if (!response.ok) {
				console.error("bg remove fetch error:");
					setBgRemoveStatus("error");
					return null;
				} else {
					return response.arrayBuffer();
				}
			})

			.then((buffer) => {
				// buffer here is a binary representation of the returned image
				console.log(buffer);
				if (buffer){
				const blob = new Blob([buffer], {
					type: "image/png",
					modifiedName: fileName,
				});
				console.log(blob);
				setImageBlob(blob);
				setClothing({
					...clothing,
					imageUrl: URL.createObjectURL(blob),
					imageName: fileName,
				});
				setBgRemoveStatus("done");
			}
			});
	};

	function capitalize(str) {
		if (str.length >= 1) return str[0].toUpperCase() + str.slice(1, str.length);
		else return str;
	}
	const handleCheckboxChange = (e) => {
		console.log(e.target);
		const value = e.target.value;
		let updatedValues = e.target.name.startsWith("temperature")
			? [...clothing.temperatures]
			: [...clothing.conditions];

		if (e.target.checked) {
			updatedValues.push(value);
		} else {
			updatedValues = updatedValues.filter((val) => val !== value);
		}

		setClothing(
			e.target.name.startsWith("temperature")
				? { ...clothing, temperatures: updatedValues }
				: { ...clothing, conditions: updatedValues }
		);
		//console.log(clothing.conditions)
		setFormSubmitted(false);
	};

	return (
		<DialogWindow
			title={data.editingMode ? "Edit clothing item" : "Add a clothing item"}
			open={dialogOpen}
			handleClose={handleDialogClose}
		>
			<div className="dialog-content">
				<form className="dialog-form" onSubmit={handleSubmit}>
					<div className="row">
						<div className="col-12">
							<label htmlFor="name" className="form-label">
								Give this clothing a name <Required />
							</label>
							<input
								className={`form-control  form-input ${
									clothing.isNameTouched
										? clothing.name
											? "is-valid"
											: "is-invalid"
										: ""
								}`}
								type="text"
								name="name"
								id="name"
								placeholder="Enter a name for this specific item"
								required
								value={clothing.name}
								onChange={(e) => {
									setFormSubmitted(false);
									setClothing({
										...clothing,
										isNameTouched: true,
										name: capitalize(e.target.value),
									});
								}}
							/>
							<InvalidFeedback>Name can't be empty</InvalidFeedback>
						</div>
					</div>

					<div className="row">
						<div className="col-12 justify-content-center">
							<label htmlFor="imageInput" className="form-label">
								Upload photo of your clothing <Required />
							</label>
							<p>(you can also remove background if you want to)</p>
							<div
								className={
									clothing.imageUrl ? "image-container" : "image-preview"
								}
							>
								{clothing.imageUrl ? (
									<img src={clothing.imageUrl} alt="your clothing" />
								) : (
									<p>Here will be your image preview</p>
								)}
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-12 file-input-section">
							<input
								id="imageInput"
								type="file"
								accept="image/*"
								onChange={handleFileInputChange}
								ref={imageInput}
								//required
							/>
							<button
								className="button"
								onClick={() => uploadImageToApi(imageBlob)}
								disabled={(imageBlob == null || bgRemoveStatus === "uploading")}
							>
								Remove Background
							</button>
						</div>
						{bgRemoveStatus === "uploading" ? (
							<InfoAlert>Please wait, background is removing...</InfoAlert>
						) : bgRemoveStatus === "done" ? (
							<SuccessAlert>Background removed successfully</SuccessAlert>
						) : (
							(bgRemoveStatus === "error" && (
								<ErrorAlert>Api error occurred. Background wasn't removed</ErrorAlert>
							))
						)}
					</div>

					<div className="row">
						<div className="col-12">
							<label htmlFor="type" className="form-label">
								Choose clothing category: <Required />
							</label>
							<select
								className={`form-control  form-input ${
									isTypeValid() ? "is-valid" : ""
								}`}
								id="type"
								value={clothing.type}
								onChange={(e) => {
									setClothing({ ...clothing, type: e.target.value });
								}}
								required
							>
								<option disabled value="none">
									Choose category...
								</option>
								<option value="Headwear">Headwear</option>
								<option value="Scarf">Scarf</option>
								<option value="Coat/jacket">Coat/jacket</option>
								<option value="Hoodie/sweatshirt or sweater">
									Hoodie/sweatshirt or sweater
								</option>
								<option value="T-shirt/shirt">T-shirt/shirt</option>
								<option value="Dress">Dress</option>
								<option value="Pants/skirt">Pants/skirt</option>
								<option value="Underpants">Underpants</option>
								<option value="Socks">Socks</option>
								<option value="Shoes">Shoes</option>
								<option value="Other">Other</option>
							</select>
						</div>
					</div>

					<div className="row">
						<div className="col-12">
							<label className="form-label">
								Choose temperature ranges that you wear this in (at least one){" "}
								<Required />
							</label>
							<div className="temperatures-container">
								{temperatureRanges.map((range, index) => (
									<div key={index} className="checkbox-container">
										<input
											type="checkbox"
											id={`temperature-${index}`}
											name={`temperature-${index}`}
											value={range}
											checked={clothing.temperatures.includes(range)}
											className="check-input temperature-check"
											onChange={handleCheckboxChange}
										/>
										<label htmlFor={`temperature-${index}`}>{range} C°</label>
									</div>
								))}
							</div>
							{clothing.temperatures.length === 0 && (
								<p className="invalid-feedback">
									Choose at least one temperature range
								</p>
							)}
						</div>
					</div>

					{formSubmitted &&
						parseInt(uploadingProgress) >= 0 &&
						parseInt(uploadingProgress) < 100 && (
							<InfoAlert>
								Please wait, the photo is uploading to storage...{" "}
								{uploadingProgress.toFixed(2)}%
							</InfoAlert>
						)}
					{error && <ErrorAlert>{error}</ErrorAlert>}
					{formSubmitted && parseInt(uploadingProgress) === 100 && (
						<SuccessAlert>
							{data.editingMode
								? "Clothing item was successfully updated"
								: "Clothing item was successfully added to closet"}
						</SuccessAlert>
					)}
					<div className="row">
						<div className="col-12">
							<button
								type="submit"
								className="button"
								disabled={!dataIsValid()}
							>
								{data.editingMode ? "Update clothing" : "Upload clothing"}
							</button>
						</div>
					</div>
				</form>
			</div>
		</DialogWindow>
	);
}
