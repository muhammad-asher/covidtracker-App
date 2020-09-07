import React, { useState, useEffect } from "react";
import {
	MenuItem,
	FormControl,
	Select,
	Card,
	CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import "./App.css";

function App() {
	const [countries, setcountries] = useState([]);
	const [country, setcountry] = useState("worldwide");
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);

	useEffect(() => {
		fetch("https://disease.sh/v3/covid-19/all")
			.then((response) => response.json())
			.then((data) => {
				setCountryInfo(data);
			});
	}, []);

	useEffect(() => {
		const getcountriesdata = async () => {
			await fetch("https://disease.sh/v3/covid-19/countries")
				.then((response) => response.json())
				.then((data) => {
					const countries = data.map((country) => ({
						name: country.country,
						value: country.countryInfo.iso2,
					}));
					setTableData(data);
					setcountries(countries);
				});
		};
		getcountriesdata();
	}, []);

	const onCountryChange = async (e) => {
		const countrycode = e.target.value;
		setcountry(countrycode);

		const url =
			countrycode === "worldwide"
				? "https://disease.sh/v3/covid-19/all"
				: `https://disease.sh/v3/covid-19/countries/${countrycode}`;
		await fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setcountry(countrycode);
				setCountryInfo(data);
			});
	};
	return (
		<div className="app">
			<div className="app-left">
				<div className="app-header">
					<h1>COVID-19 TRACKER</h1>
					<FormControl className="app-dropdown">
						<Select
							variant="outlined"
							onChange={onCountryChange}
							value={country}
						>
							<MenuItem variant="outlined" value="worldwide">
								Worldwide
							</MenuItem>
							{countries.map((country) => (
								<MenuItem value={country.value}>{country.name}</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>

				<div className="covid-stats">
					<InfoBox
						title="CoronaVirus Cases"
						cases={countryInfo.todayCases}
						total={countryInfo.cases}
					/>
					<InfoBox
						title="Recovered"
						cases={countryInfo.todayRecovered}
						total={countryInfo.recovered}
					/>
					<InfoBox
						title="Deaths"
						cases={countryInfo.todayDeaths}
						total={countryInfo.deaths}
						Total
					/>
				</div>
				<Map />
			</div>
			<Card className="app-right">
				<CardContent>
					<h3>Live Cases By Country</h3>
					<Table countries={tableData} />
					<h3>WorldWide New Cases</h3>
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
