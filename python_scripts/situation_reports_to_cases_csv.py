import re
import csv
import sys
import getopt
import datetime
import requests
from os import remove

from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfdocument import PDFDocument
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfparser import PDFParser
from io import BytesIO

## CLASSES ##

# Create data entry for each country for each day
class Data_entry :
     def __init__(self, country_id = -1, country = "", cases = -1, deaths = -1, \
                    recoveries = -1, source_id = -1):
        self.country_id = country_id
        self.country = country
        self.cases = cases
        self.deaths = deaths
        self.recoveries = recoveries
        self.source_id = source_id

# Create individual source for each report
class Source_entry :
     def __init__(self, source_id = -1, published = datetime.datetime(2100,1,1), \
                    accessed = datetime.datetime(2100,1,1), reference_link = "", \
                    author = "", headline = "", snippet = ""):
        self.source_id = source_id
        self.published = published
        self.accessed = accessed
        self.reference_link = reference_link
        self.author = author
        self.headline = headline
        self.snippet = snippet

# Create list of all countries and associated ID
class Country :
    def __init__(self, country_id = -1, name = ""):
        self.country_id = country_id
        self.name = name

## FUNCTIONS ##

# Pdf text to data structs
def parse_pdf_data(datas, sources, text):
    lines = text.split("\n")
    in_table = False
    columns = ["country"]
    possible_columns = [
        "new cases",
        "new deaths",
        "reported case",
        "deaths",
        "cases"
    ]

    for line in lines:

        # FIND START OF DATA
        if (("Country" in line) and (len(line) < 50)):
            in_table = True
            continue
        elif not in_table:
            continue

        # COLUMNS
        for pc in possible_columns:
            if (pc in line.lower() and pc not in columns):
                columns.append(pc)
                break

        # Country first
        # Confirmed cases -> cases, Deaths -> deaths,
        # new deaths -> X, confirmed new cases -> x, days since last reported case -> x

        # DATA
        # First country name
        # If list[] in name

    print(columns)
    return datas, sources

# Txt files to data structs
def collect_from_files():
    datas = []
    sources = []

    for x in range(1, 131):
        with open('./sit_reps/%i.txt' % (x), 'r', errors = 'ignore') as file:
            text = file.read()

        print(x, end =": ")
        datas, sources = parse_pdf_data(datas, sources, text)

    return datas, sources

# Convert pdf to text
def get_pdf_data(pdf_bytes, day):

    # Write to temp file
    f = open('./pdf_bytes', 'wb')
    f.write(pdf_bytes)
    f.close()

    # PDF MINER
    manager = PDFResourceManager()
    retstr = BytesIO()
    layout = LAParams(all_texts=True)
    device = TextConverter(manager, retstr, laparams=layout)
    filepath = open('./pdf_bytes', 'rb')
    interpreter = PDFPageInterpreter(manager, device)

    for page in PDFPage.get_pages(filepath, check_extractable=True):
        interpreter.process_page(page)

    text = retstr.getvalue()
    filepath.close()
    device.close()
    retstr.close()


    # Delete file & convert to string
    remove('./pdf_bytes')
    text = text.decode()

    return text

# Collect situation reports data from WHO
def collect_data(base_source_id, date, first_report_date):

    datas = []
    sources = []
    day_max = (datetime.datetime.now() - first_report_date).days + 1
    day_one = (date - first_report_date).days + 1
    url_formats = [
        "https://www.who.int/docs/default-source/coronaviruse/situation-reports/YYYYMMDD-sitrep-N-2019-ncov.pdf", # 1
        "https://www.who.int/docs/default-source/coronaviruse/situation-reports/YYYYMMDD-sitrep-N-2019--ncov.pdf", # 6
        "https://www.who.int/docs/default-source/coronaviruse/situation-reports/YYYYMMDD-sitrep-N-ncov-cleared.pdf", # 8
        "https://www.who.int/docs/default-source/coronaviruse/situation-reports/YYYYMMDD-sitrep-N-ncov-v2.pdf", # 9
        "https://www.who.int/docs/default-source/coronaviruse/situation-reports/YYYYMMDD-sitrep-N-ncov.pdf", # 10
        "https://www.who.int/docs/default-source/coronaviruse/situation-reports/YYYYMMDD-sitrep-N-ncov-v3.pdf", # 13
        "https://www.who.int/docs/default-source/coronaviruse/situation-reports/YYYYMMDD-sitrep-N-ncov.pdf", # 14
        "https://www.who.int/docs/default-source/coronaviruse/situation-reports/YYYYMMDD-sitrep-N-covid-19.pdf", # 24
        "https://www.who.int/docs/default-source/coronaviruse/situation-reports/YYYYMMDD-sitrep-N-covid-19-mp.pdf", # 74
        "https://www.who.int/docs/default-source/coronaviruse/situation-reports/YYYYMMDD-sitrep-N-covid-19.pdf", # 75
        "https://www.who.int/docs/default-source/coronaviruse/situation-reports/YYYYMMDD-covid-19-sitrep.pdf", # 102
        "https://www.who.int/docs/default-source/coronaviruse/situation-reports/YYYYMMDD-covid-19-sitrep-N.pdf", # 103
        "https://www.who.int/docs/default-source/coronaviruse/situation-reports/YYYYMMDDcovid-19-sitrep-N.pdf", # 106
        "https://www.who.int/docs/default-source/coronaviruse/situation-reports/YYYYMMDD-covid-19-sitrep-N.pdf" # 112
    ] # YYYYMMDD - date, N - sit number

    # Load pdfs in loop
    url_format_id = 0
    for day in range(day_one, day_max + 1):
        day_date = first_report_date + datetime.timedelta(days=day-1)

        # Update url format
        if (day in  [6, 8, 9, 10, 13, 14, 24, 74, 75, 102, 103, 106, 112]):
            url_format_id = url_format_id + 1

        # Format url
        url_to_get = url_formats[url_format_id]
        url_to_get = re.sub("YYYY", ("%04i" % (day_date.year)), url_to_get)
        url_to_get = re.sub("MM", ("%02i" % (day_date.month)), url_to_get)
        url_to_get = re.sub("DD", ("%02i" % (day_date.day)), url_to_get)
        url_to_get = re.sub("N", str(day), url_to_get)

        # Get report
        response = requests.get(url_to_get)
        if (response.status_code != 200):
            print("Day %i. Response: %s" % (day, str(response)))
            print(url_to_get)
            input()
            continue

        # Extract data from pdfs
        text = get_pdf_data(response.content, day)
        datas, sources = parse_pdf_data(datas, sources, text)

    return datas, sources

# Read list of countries from .csv file
def read_countries(filename):
    countries = []

    with open(filename) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            countries.append(Country(row[0], row[1]))

    return countries

# Parse command line args
def parse_args(first_report_date):
    base_source_id = -1
    date = first_report_date

    try:
        argv = sys.argv[1:]
        opts, args = getopt.getopt(argv, 'b:u')

        if (len(opts) == 0):
            return base_source_id, date

        if (opts[0] == '-b'):
            base_source_id = a
            if (opts[1] == '-u'):
                date = datetime.datetime(int(args[0]), int(args[1]), int(args[2]))
            else:
                raise(exception)
        else:
            raise(exception)

    except:
        print("Invalid format. Please use:\n \
           python situation_reports_to_cases_csv.py -b #source_id_base_value# -u #yyyy# #mm# #dd#\n \
           python situation_reports_to_cases_csv.py -b #source_id_base_value#\n \
           python situation_reports_to_cases_csv.py")

    return base_source_id, date


# Main
if __name__ == "__main__":

    # INIT
    first_report_date = datetime.datetime(2020, 1, 21)
    base_source_id, date = parse_args(first_report_date)
    countries = read_countries("countries.csv")

    # DATA COLLECTION & FORMATTING
    # datas, sources = collect_data(base_source_id, date, first_report_date)
    datas, sources = collect_from_files()

    # OUTPUT
    # Write data to .csv files
