<script lang="ts">
	import { goto } from '$app/navigation';

	let { data } = $props();
	let city = $state('');

	let weatherInfo = $derived(data.weather);
	let errorMessage = $derived(data.errorMessage);
	let icon = $derived(
		weatherInfo ? `https://openweathermap.org/img/wn/${weatherInfo.weather[0]?.icon}@2x.png` : ''
	);
	let sunrise = $derived(weatherInfo ? formatUnixTime(weatherInfo.sys.sunrise) : '');
	let sunset = $derived(weatherInfo ? formatUnixTime(weatherInfo.sys.sunset) : '');

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		if (city.trim().length === 0) {
			return;
		}
		goto(`/?city=${city}`);
		city = '';
	};

	const currentDate = new Date();
	const formattedDate = currentDate.toLocaleDateString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric'
	});

	function formatUnixTime(unixTime: number) {
		const date = new Date(unixTime * 1000);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}
</script>

<main class="container">
	<header class="header">
		<form class="search-form" method="GET" onsubmit={handleSubmit}>
			<label for="search" class="sr-only">Search field</label>
			<input
				type="text"
				id="search"
				name="city"
				placeholder="Search location..."
				bind:value={city}
			/>
			<button aria-label="Search"
				><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i></button
			>
		</form>
	</header>

	{#if errorMessage}
		<p class="error-message">{errorMessage}</p>
		<p class="error-smiley">&#129488</p>
	{:else if weatherInfo}
		<article class="weather">
			<h1>{weatherInfo.name}</h1>
			<p>{formattedDate}</p>
			<img src={icon} alt="icon weather" title={weatherInfo.weather[0].description} />
			<p class="weather-type">{weatherInfo.weather[0].main}</p>
			<p class="temperature">{Math.floor(weatherInfo.main.temp)}°</p>

			<div class="min-max">
				<p>Min: {Math.floor(weatherInfo.main.temp_min)}°</p>
				<p>Max: {Math.floor(weatherInfo.main.temp_max)}°</p>
				<p>
					<i class="fa-solid fa-temperature-half"></i> Feels like: {Math.floor(
						weatherInfo.main.feels_like
					)}°
				</p>
			</div>
		</article>

		<section class="weather-info">
			<article class="card">
				<i class="fa-solid fa-droplet"></i>
				<div>
					<p>Humidity</p>
					<p>{weatherInfo.main.humidity}%</p>
				</div>
			</article>

			<article class="card">
				<i class="fa-solid fa-wind"></i>
				<div>
					<p>Wind</p>
					<p>{weatherInfo.wind.speed} m/s</p>
				</div>
			</article>

			<article class="card">
				<i class="fa-solid fa-sun"></i>
				<div>
					<p>Sunrise</p>
					<p>{sunrise}</p>
				</div>
			</article>

			<article class="card">
				<i class="fa-solid fa-moon"></i>
				<div>
					<p>Sunset</p>
					<p>{sunset}</p>
				</div>
			</article>
		</section>
	{/if}
</main>

<style>
	.container {
		width: 40%;
		margin: 0 auto;
		padding: 2rem;
		background: #272727;
		border-radius: 10px;
	}
	.header {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	input {
		flex: 1;
		background: #1e1e1e;
		color: #fff;
		border: none;
		outline: none;
		padding: 0.6rem;
		border-radius: 0.5rem;
		line-height: 1.5rem;
	}
	input::placeholder {
		color: #fff;
		letter-spacing: 0.1rem;
	}
	.search-form {
		position: relative;
		display: flex;
		width: 100%;
	}
	.search-form button {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		color: #fff;
		cursor: pointer;
	}
	.weather {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 0.1rem;
		margin-top: 3rem;
	}
	.weather h1 {
		font-size: 2rem;
		letter-spacing: 0.3rem;
	}
	.weather i.fa-temperature-half {
		color: #ff6347;
	}
	.weather-info {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-gap: 1rem;
		margin-top: 3rem;
	}
	.weather-info .card {
		display: flex;
		background: #1e1e1e;
		padding: 1rem;
		border-radius: 0.1rem;
	}
	.weather-info .card i {
		font-size: 1.5rem;
		margin-right: 1rem;
	}
	.weather-info .card i.fa-droplet {
		color: #1e90ff;
	}
	.weather-info .card i.fa-wind {
		color: #00ced1;
	}
	.weather-info .card i.fa-sun {
		color: #ffd700;
	}
	.weather-info .card i.fa-moon {
		color: #ffa500;
	}
	.weather-info .card p {
		font: 2rem;
	}
	.weather-type {
		background: #1e1e1e;
		display: inline-block;
		padding: 0.5rem 1rem;
		border-radius: 0.3rem;
	}
	.temperature {
		font-size: 4rem;
	}
	.min-max {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}
	.min-max p {
		font-size: 1rem;
		margin: 0.5rem;
	}
	.error-message {
		font-size: 1rem;
		margin-top: 2rem;
		text-align: center;
	}
	.error-smiley {
		font-size: 5rem;
		text-align: center;
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}
	@media (max-width: 900px) {
		.container {
			width: 90%;
			margin: 0 auto;
			padding: 1rem;
		}
		.header {
			flex-direction: column;
		}
	}
	@media (max-width: 500px) {
		.weather-info {
			grid-template-columns: none;
		}
		.error-smiley {
			font-size: 3rem;
		}
	}
</style>
