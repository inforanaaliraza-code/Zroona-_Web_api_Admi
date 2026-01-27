import { useTranslation } from "react-i18next";

const EventForm = () => {
	const { t } = useTranslation();

	const handleChange = (e) => {
		// Handle form change
	};

	return (
		<div className="mb-4">
			<label
				htmlFor="event_date"
				className="block mb-2 text-sm font-medium text-gray-700"
			>
				{t("add.eventDate")}
			</label>
			<input
				type="date"
				id="event_date"
				name="event_date"
				value={formData.event_date}
				onChange={handleChange}
				className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#a797cc]"
				data-calendar="gregorian"
			/>
		</div>
	);
};

export default EventForm;
