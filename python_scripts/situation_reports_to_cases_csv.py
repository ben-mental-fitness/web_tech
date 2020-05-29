import re
import csv
import sys
import getopt
import datetime
import requests

from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfdocument import PDFDocument
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfparser import PDFParser
from io import StringIO

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

def get_pdf_data(pdf_bytes):
    # PDF MINER
    return

# Collect situation reports data from WHO
def collect_data(base_source_id, date, first_report_date):

    datas = []
    sources = []
    day_max = (datetime.datetime.now() - first_report_date).days + 1
    day_one = (date - first_report_date).days + 1
    url_formats = [
        "https://www.who.int/docs/default-source/coronaviruse/situation-reports/YYYYMMDD-sitrep-N-2019-ncov.pdf", # 1
        "https://www.who.int/docs/default-source/coronaviruse/situation-reports/YYYYMMDD-sitrep-N-covid-19.pdf", # 24
        "https://www.who.int/docs/default-source/coronaviruse/situation-reports/YYYYMMDD-covid-19-sitrep.pdf", # 102
        "https://www.who.int/docs/default-source/coronaviruse/situation-reports/YYYYMMDD-covid-19-sitrep-N.pdf" # 103
    ] # YYYYMMDD - date, N - sit number

    # Load pdfs in loop
    url_format_id = 0
    for day in range(day_one, day_max + 1):
        day_date = first_report_date + datetime.timedelta(days=day-1)

        # Update url format
        if (day == 24 or day == 102 or day == 103):
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
            continue

        # Extract data from pdfs
        get_pdf_data(response.content)
        input()


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
    datas, sources = collect_data(base_source_id, date, first_report_date)

    # OUTPUT
    # Write data to .csv files
