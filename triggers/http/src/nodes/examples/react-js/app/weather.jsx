// public/app.js
const { useState } = React;
const ReactMarkdown = window.ReactMarkdown;

const countries = ["United States", "Canada"];

const citiesByCountry = {
	"United States": [
		"New York - New York",
		"Los Angeles - California",
		"Chicago - Illinois",
		"Houston - Texas",
		"Phoenix - Arizona",
		"Philadelphia - Pennsylvania",
		"San Antonio - Texas",
		"San Diego - California",
		"Dallas - Texas",
		"San Jose - California",
	],
	Canada: [
		"Toronto - Ontario",
		"Montreal - Quebec",
		"Vancouver - British Columbia",
		"Calgary - Alberta",
		"Edmonton - Alberta",
		"Ottawa - Ontario",
		"Winnipeg - Manitoba",
		"Quebec City - Quebec",
		"Hamilton - Ontario",
		"Halifax - Nova Scotia",
	],
};

function WeatherApp() {
	const [selectedCountry, setSelectedCountry] = useState("");
	const [selectedCity, setSelectedCity] = useState("");
	const [weatherData, setWeatherData] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		// Fetch weather data using POST method to the same endpoint
		// with the selected city as the payload
		const response = await fetch("/weather", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ city: selectedCity.split("-")[0].trim(), country: selectedCountry }),
		});

		if (!response.ok) {
			const message = `An error occurred: ${response.status}`;
			setWeatherData(message);
			return;
		}

		const data = await response.json();
		setWeatherData(data.text);
		setLoading(false);
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-6 w-96">
			<h1 className="text-2xl font-bold mb-4 text-center">Weather App</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="country" className="block mb-1">
						Select Country:
					</label>
					<select
						id="country"
						value={selectedCountry}
						onChange={(e) => {
							setSelectedCountry(e.target.value);
							setSelectedCity("");
						}}
						className="w-full p-2 border rounded"
					>
						<option value="">Select a country</option>
						{countries.map((country) => (
							<option key={country} value={country}>
								{country}
							</option>
						))}
					</select>
				</div>
				{selectedCountry && (
					<div>
						<label htmlFor="city" className="block mb-1">
							Select City:
						</label>
						<select
							id="city"
							value={selectedCity}
							onChange={(e) => setSelectedCity(e.target.value)}
							className="w-full p-2 border rounded"
						>
							<option value="">Select a city</option>
							{citiesByCountry[selectedCountry].map((city) => (
								<option key={city} value={city}>
									{city}
								</option>
							))}
						</select>
					</div>
				)}
				<button
					type="submit"
					disabled={!selectedCity}
					className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
				>
					Get Weather
				</button>
			</form>
			{loading && <p className="text-center mt-4">Loading...</p>}
			{weatherData && (
				<div className="mt-4 p-4 bg-gray-100 rounded">
					<SimpleMarkdown content={weatherData} />
				</div>
			)}
		</div>
	);
}

function SimpleMarkdown({ content }) {
	let lines = content.split("\n");
	lines = lines.map((line, index) => {
		return { text: line.trim(), id: index };
	});
	return (
		<div>
			{lines.map((line, index) => {
				if (line.text.startsWith("- **")) {
					const [title, value] = line.text.substring(3).split(":** ");
					return (
						<p key={line.id} className="mb-2">
							<strong>{title}:</strong> {value}
						</p>
					);
				}
				if (line.text.trim() !== "") {
					return (
						<p key={line.id} className="mb-2">
							{line.text}
						</p>
					);
				}
				return null;
			})}
		</div>
	);
}

ReactDOM.render(<WeatherApp />, document.getElementById("root"));
