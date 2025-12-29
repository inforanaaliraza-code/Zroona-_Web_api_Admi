import { formatDate } from "@/utils/dateUtils";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

export default function EventCard({ event }) {
	const { t, i18n } = useTranslation();
	const currentLocale = i18n.language;

	return (
		<div className="event-card">
			{/* ...other card content... */}
			<div className="flex items-center mb-2 text-sm text-gray-600">
				<Icon icon="lucide:calendar" className="w-4 h-4 mr-1" />
				<p>
					{formatDate(event.event_date, "MMM d, yyyy", currentLocale)}
				</p>
			</div>
			{/* ...other card content... */}
		</div>
	);
}
