import sqlite3
import csv

conn = sqlite3.connect('CoVision.db')
c = conn.cursor()

# Create table - SOURCES
c.execute('''CREATE TABLE SOURCES
            ([source_id] INTEGER PRIMARY KEY, [published] date, [accessed] date, [reference_link] text, [author] text, [headline] text, [snippet] text)''')

# Create table - COUNTRIES
c.execute('''CREATE TABLE COUNTRIES
            ([country_id] INTEGER PRIMARY KEY, [name] text, [population] integer, [population_density] float, [median_age] float, [aged_65_older] float, [gdp_per_capita] float, [extreme_poverty] float)''')

# Create table - RESPONSES
c.execute('''CREATE TABLE RESPONSES
            ([source_id] INTEGER PRIMARY KEY, [country_id] integer, [date_of_event] date, FOREIGN KEY(source_id) REFERENCES SOURCES(source_id), FOREIGN KEY(country_id) REFERENCES COUNTRIES(country_id))''')

# Create table - WHO_ADVICE
c.execute('''CREATE TABLE WHO_ADVICE
            ([source_id] INTEGER PRIMARY KEY, [date_of_event] date, FOREIGN KEY(source_id) REFERENCES SOURCES(source_id))''')


# Add sources to SOURCES
all_data = []
with open("database_data/sources.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        all_data.append(row)

all_data = all_data[1:]

for d in all_data:
    sql = "INSERT INTO SOURCES VALUES (?, ?, ?, ?, ?, ?, ?)"
    val = (d[0], d[1], d[2], d[3], d[4], d[5], d[6])
    c.execute(sql, val)

# Add countries to COUNTRIES
all_data = []
with open("database_data/countries.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        all_data.append(row)

all_data = all_data[1:]

for d in all_data:
    if d == []:
        continue

    sql = "INSERT INTO COUNTRIES VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    val = (d[0], d[1], d[2], d[3], d[4], d[5], d[6], d[7])
    c.execute(sql, val)

# Add responses to RESPONSES
all_data = []
with open("database_data/responses.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        all_data.append(row)

all_data = all_data[1:]

for d in all_data:
    sql = "INSERT INTO RESPONSES VALUES (?, ?, ?)"
    val = (d[0], d[1], d[2])
    c.execute(sql, val)

# Add who_advice to WHO_ADVICE
all_data = []
with open("database_data/who_advice.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        all_data.append(row)

all_data = all_data[1:]

for d in all_data:
    sql = "INSERT INTO WHO_ADVICE VALUES (?, ?)"
    val = (d[0], d[1])
    c.execute(sql, val)

# TODO Loop of countries in cases
all_data = []
with open("database_data/cases_all.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        all_data.append(row)

all_data = all_data[1:]

existing_country_ids = []
for d in all_data:
    if (d == []):
        continue

    # Create table - CASES_COUNTRY_[ID] for each country
    if (d[0] not in existing_country_ids):
        sql = "CREATE TABLE CASES_COUNTRY_%s ([date_of_event] DATE PRIMARY KEY, [cases] integer, [deaths] integer, [recoveries] integer, [tests] integer, [tests_units] text, [handwashing_facilities] float, [hospital_beds_per_100k] float, [source_id] integer, FOREIGN KEY(source_id) REFERENCES SOURCES(source_id))" % (d[0])
        c.execute(sql)
        existing_country_ids.append(d[0])

    # Aadd cases to CASES
    sql = "INSERT INTO CASES_COUNTRY_%s VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)" % (d[0])
    val = (d[1], d[2], d[3], d[4], d[5], d[6], d[7], d[8], d[9])
    c.execute(sql, val)

conn.commit()
conn.close()
