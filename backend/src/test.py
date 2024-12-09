import sqlite3

con = sqlite3.connect('db.sqlite3')
cursor = con.cursor()
cursor.execute("SELECT * FROM todoapis_todolist;")
print(cursor.fetchall())