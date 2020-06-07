import sqlite3

# Create stories_db.sqlite
def create_stories_db():
    conn = sqlite3.connect('stories_db.sqlite')
    c = conn.cursor()

    # Create table
    c.execute('''CREATE TABLE STORIES
                ([story_id] INTEGER PRIMARY KEY, [name] text, [data] text, [script] text)''')

    # Insert data
    sql = "INSERT INTO STORIES VALUES (?, ?, ?, ?)"
    vals = []
    vals.append((0, "One Earth", "./data_scripts/one_earth.js", "./vis_scripts/one_earth.js"))
    vals.append((1, "The Passage of Time", "./data_scripts/the_passage_of_time.js", "./vis_scripts/the_passage_of_time.js"))
    vals.append((2, "You're the Boss", "./data_scripts/template.js", "./vis_scripts/template.js"))
    vals.append((3, "WHO said What?", "./data_scripts/template.js", "./vis_scripts/template.js"))
    vals.append((4, "WHO did What?", "./data_scripts/template.js", "./vis_scripts/template.js"))
    vals.append((5, "Magic Money Tree", "./data_scripts/template.js", "./vis_scripts/template.js"))
    vals.append((6, "Escape Rooms", "./data_scripts/template.js", "./vis_scripts/template.js"))
    vals.append((7, "One People", "./data_scripts/template.js", "./vis_scripts/template.js"))
    for val in vals:
        c.execute(sql, val)

    conn.commit()
    conn.close()
    return

# Create stories_db.sqlite
def create_meta_db():
    conn = sqlite3.connect('meta_db.sqlite')
    c = conn.cursor()

    # Create stories table
    c.execute('''CREATE TABLE STORIES
                ([story_id] INTEGER PRIMARY KEY, [name] text)''')

    # Insert data
    sql = "INSERT INTO STORIES VALUES (?, ?)"
    vals = []
    vals.append((0, "One Earth"))
    vals.append((1, "The Passage of Time"))
    vals.append((2, "You're the Boss"))
    vals.append((3, "WHO said What?"))
    vals.append((4, "WHO did What?"))
    vals.append((5, "Magic Money Tree"))
    vals.append((6, "Escape Rooms"))
    vals.append((7, "One People"))
    for val in vals:
        c.execute(sql, val)

    # Create categories table
    c.execute('''CREATE TABLE CATEGORIES
                ([category_id] INTEGER PRIMARY KEY, [name] text, [colour] text, [description] text)''')

    # Insert data
    sql = "INSERT INTO CATEGORIES VALUES (?, ?, ?, ?)"
    vals = []
    vals.append((0, "Country Bios", "#71BF45", "This category contains information about countries. This includes population, population density, median age, people aged 65 or older, gdp per capita and the number of people living in extreme poverty."))
    vals.append((1, "Cases Data", "#0072BB", "This category contains information about a country's COVID-19 cases. Here we include cases, deaths, recoveries, tests complete (and test units), COVID-19 death rate, handwashing facilities and hospital beds per 100k residents. This data is stored for each day for each country."))
    vals.append((2, "Response Strategy", "#FEF200", "This category contains information about how countries have responded to COVID-19, including if/ when they went into lockdown."))
    vals.append((3, "Good News", "#8DD8F8", "This category contains some good news stories that have come out of this pandemic. These are stories of people and communities coming together to cope with COVID-19 and the many difficulties it has brought."))
    vals.append((4, "Wildcards", "#A1499D", "This category is everything else. Any pieces of information that don't fit into these categories that relates to COVID-19 will live here. For example, here we would include corporations who are exploiting the pandemic for profit."))
    for val in vals:
        c.execute(sql, val)

    conn.commit()
    conn.close()
    return

# Create contact_db.sqlite
def create_contact_db():
    conn = sqlite3.connect('contact_db.sqlite')
    c = conn.cursor()

    # Create table
    c.execute('''CREATE TABLE MESSAGES
                ([contact_id] INTEGER PRIMARY KEY, [time] date, [name] text, [email] text, [subject] text, [message] text)''')
                # ([contact_id] INTEGER PRIMARY KEY, [time] date, [source_ip] text, [user_agent] text, [name] text, [email] text, [subject] text, [message] text)''')
    c.execute('''INSERT INTO MESSAGES VALUES (0, "2020/06/07", "test_name", "test@test.com", "test_subject", "test_text")''')

    conn.commit()
    conn.close()
    return

# Create contact_db.sqlite
def print_contact_db():
    conn = sqlite3.connect('../site/contact_db.sqlite')
    c = conn.cursor()

    # Print table
    c.execute('''SELECT * FROM MESSAGES''')
    print(c.fetchall())
    conn.commit()
    conn.close()

    return

# Create contact_db.sqlite
def print_test_db():
    conn = sqlite3.connect('./CoVision_test.sqlite')
    c = conn.cursor()

    # Print table
    c.execute('''SELECT * FROM SOURCES''')
    all = c.fetchall()
    conn.commit()
    conn.close()

    for a in all:
        print(a)
    return


# Run Functions
#create_stories_db()
#create_meta_db();
#create_contact_db()
#print_contact_db()
print_test_db()
