import type { PageServerLoad } from './$types';
import { PRIVATE_API_KEY } from '$env/static/private';

type WeatherInfo = {
	name: string;
	main: {
		temp: number;
		temp_min: number;
		temp_max: number;
		humidity: number;
		feels_like: number;
	};
	wind: {
		speed: number;
	};
	weather: {
		main: string;
		description: string;
		icon: string;
	}[];
	sys: {
		sunrise: number;
		sunset: number;
	};
};

export const load: PageServerLoad = (async ({ fetch, url }) => {
	const city = url.searchParams.get('city') || 'stockholm';

	if (!city || city.trim().length === 0) {
		return {
			weather: null,
			errorMessage: 'Please input a city'
		};
	}

	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${PRIVATE_API_KEY}&units=metric`
		);

		if (!response.ok) {
			return {
				weather: null,
				errorMessage: `Could not find any weather data for: ${city}`
			};
		}

		const data = await response.json();
		const weather = data as WeatherInfo;

		return {
			weather,
			errorMessage: null
		};
	} catch (err) {
		console.error('Weather API error:', err);
		return {
			weather: null,
			errorMessage: 'An internal server error occurred. Please try again later.'
		};
	}
}) satisfies PageServerLoad;
