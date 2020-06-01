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

# Create contact_db.sqlite
def create_contact_db():
    conn = sqlite3.connect('contact_db.sqlite')
    c = conn.cursor()

    # Create table
    c.execute('''CREATE TABLE MESSAGES
                ([contact_id] INTEGER PRIMARY KEY, [time] date, [source_ip] text, [user_agent] text, [name] text, [email] text, [subject] text, [message] text)''')

    conn.commit()
    conn.close()
    return


# Run Functions
create_stories_db()
create_contact_db()
