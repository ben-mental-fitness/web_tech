# https://ourworldindata.org/coronavirus-source-data

import csv
import datetime

## CLASSES ##

# Create data entry for each country for each day
class Data_entry :
    def __init__(self, country_id = -1, date = datetime.datetime(2000, 1, 1), \
            cases = -1, deaths = -1, recoveries = -1, tests = -1, tests_units = "", \
            death_rate = -1.1, handwashing_facilities = -1.1, \
            hospital_beds_per_100k = -1.1, source_id = -1):

        if (cases == ""):
            cases = -1

        if (deaths == ""):
            deaths = -1

        if (recoveries == ""):
            recoveries = -1

        if (tests == ""):
            tests = -1

        if (death_rate == ""):
            death_rate = -1.1

        if (handwashing_facilities == ""):
            handwashing_facilities = -1.1

        if (hospital_beds_per_100k == ""):
            hospital_beds_per_100k = -1.1

        self.country_id = country_id
        self.date = date
        self.cases = cases
        self.deaths = deaths
        self.recoveries = recoveries
        self.tests = tests
        self.tests_units = tests_units
        self.death_rate = death_rate
        self.handwashing_facilities = handwashing_facilities
        self.hospital_beds_per_100k = hospital_beds_per_100k
        self.source_id = source_id

    def update_country_id(self, id):
        self.country_id = id

    def list(self):
        return [self.country_id, self.date, self.cases, self.deaths, self.recoveries, \
            self.tests, self.tests_units, self.death_rate, self.handwashing_facilities, \
            self.hospital_beds_per_100k, self.source_id]

# Create list of all countries and associated ID
class Country :
    def __init__(self, country_id = -1, name = "", population = -1, \
            population_density = -1.1, median_age = -1.1, aged_65_older = -1, \
            gdp_per_capita = -1.1, extreme_poverty = -1.1):

        if (population == ""):
            population = -1

        if (population_density == ""):
            population_density = -1.1

        if (median_age == ""):
            median_age = -1.1

        if (aged_65_older == ""):
            aged_65_older = -1

        if (gdp_per_capita == ""):
            gdp_per_capita = -1.1

        if (extreme_poverty == ""):
            extreme_poverty = -1.1

        self.country_id = country_id
        self.name = name
        self.population = population
        self.population_density = population_density
        self.median_age = median_age
        self.aged_65_older = aged_65_older
        self.gdp_per_capita = gdp_per_capita
        self.extreme_poverty = extreme_poverty

    def update_bio(self, population, population_density, median_age, aged_65_older, \
                gdp_per_capita, extreme_poverty):
        self.population = population
        self.population_density = population_density
        self.median_age = median_age
        self.aged_65_older = aged_65_older
        self.gdp_per_capita = gdp_per_capita
        self.extreme_poverty = extreme_poverty

    def list(self):
        return [self.country_id, self.name, self.population, self.population_density, \
            self.median_age, self.aged_65_older, self.gdp_per_capita, self.extreme_poverty]


## FUNCTIONS ##

# Write output to .csv files
def write_to_csv(countries, datas):

    # Output countries
    with open('./database_data/countries_database.csv', 'w') as f:
        csv_writer = csv.writer(f)

        csv_writer.writerow(["country_id", "name", "population", "population_density", \
                        "median_age", "aged_65_older", "gdp_per_capita", "extreme_poverty"])

        for country in countries:
            csv_writer.writerow(country.list())

    # Output cases
    with open('./database_data/cases_database.csv', 'w') as f:
        csv_writer = csv.writer(f)

        csv_writer.writerow(["country_id", "date", "cases", "deaths", "recoveries", \
                "tests", "tests_units", "death_rate", "handwashing_facilities", \
                "hospital_beds_per_100k", "source_id"])

        for data in datas:
            csv_writer.writerow(data.list())


    return

# Convert dataset countries to internal data countries
def merge_countries(countries_format, countries_data, datas_data):

    for cd in countries_data:
        for cf in countries_format:

            # Update cf and dd if match is found
            if (cd.name == cf.name):
                cf.update_bio(cd.population, cd.population_density, \
                        cd.median_age, cd.aged_65_older, cd.gdp_per_capita, \
                        cd.extreme_poverty)

                # Update datas
                for dd in datas:
                    if (cd.country_id == dd.country_id):
                        dd.update_country_id(cf.country_id)

                break # Go to next cd if cf match found

    return countries_format, datas_data

# CSV to data structs
def collect_from_file(filename):
    datas = []
    countries = []
    all_data = {}

    # Put data into column-wise dict
    with open(filename) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        columns = next(csv_reader, None)

        for c in columns:
            all_data[c] = []

        for row in csv_reader:
            for h, v in zip(columns, row):
                all_data[h].append(v)

    # Convert to database structs
    last_country = ""
    country_id = -1
    for x in range(0, len(all_data.get("date"))):
        if (last_country != all_data["location"][x]):
            last_country = all_data["location"][x]
            country_id = country_id + 1
            c = Country(country_id, all_data["location"][x], all_data["population"][x], \
                    all_data["population_density"][x], all_data["median_age"][x], \
                    all_data["aged_65_older"][x], all_data["gdp_per_capita"][x], \
                    all_data["extreme_poverty"][x])

            countries.append(c)

        d = Data_entry(country_id, all_data["date"][x], all_data["total_cases"][x], \
                    all_data["total_deaths"][x], -1, all_data["total_tests"][x], \
                    all_data["tests_units"][x], all_data["cvd_death_rate"][x], \
                    all_data["handwashing_facilities"][x], all_data["hospital_beds_per_100k"][x], 0)

        datas.append(d)

    return datas, countries

# Read list of countries from .csv file
def read_countries(filename):
    countries = []

    with open(filename) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            countries.append(Country(row[0], row[1]))

    return countries

# Main
if __name__ == "__main__":

    # INIT
    countries = read_countries("countries.csv")

    # DATA COLLECTION & FORMATTING
    datas, countries_new = collect_from_file("./case_data.csv")
    countries, datas = merge_countries(countries, countries_new, datas)

    # OUTPUT
    write_to_csv(countries, datas)
