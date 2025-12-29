"use client";

import React, { useState } from "react";

export function Tooltip({ children, content }) {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<div className="relative inline-block">
			<div
				onMouseEnter={() => setIsVisible(true)}
				onMouseLeave={() => setIsVisible(false)}
				onFocus={() => setIsVisible(true)}
				onBlur={() => setIsVisible(false)}
			>
				{children}
			</div>
			{isVisible && (
				<div className="absolute z-50 px-2 py-1 mb-1 text-xs font-medium text-white transform -translate-x-1/2 bg-gray-800 rounded bottom-full left-1/2">
					{content}
					<div className="absolute w-2 h-2 -ml-1 transform rotate-45 bg-gray-800 -bottom-1 left-1/2"></div>
				</div>
			)}
		</div>
	);
}
