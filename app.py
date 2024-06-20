from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL

app = Flask(__name__)
CORS(app)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '^sNi2TuSwa8N'
app.config['MYSQL_DB'] = 'climate_companion'

mysql = MySQL(app)

@app.route('/save_locations', methods=['POST'])
def save_locations():
  if request.method == 'POST':
    name = request.form.get('name')

    # Check if the location already exists
    cur = mysql.connection.cursor()
    cur.execute('''SELECT * FROM locations WHERE name = %s''', (name,))
    existing_location = cur.fetchone()
    cur.close()

    if existing_location:
      return jsonify({'message': 'Location already exists.'}), 400

    # Insert new location if it doesn't exist
    cur = mysql.connection.cursor()
    cur.execute('''INSERT INTO locations (name) VALUES (%s)''', (name,))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Location saved successfully'}), 201


@app.route('/get_locations', methods=['GET'])
def get_locations():
  cur = mysql.connection.cursor()
  cur.execute('''SELECT * FROM locations''')
  locations = cur.fetchall()
  cur.close()

  if not locations:
    return jsonify(
      {
        'fetched': False,
        'message': 'No locations found.'
      }), 200

  locations_list = [{'id': loc[0], 'name': loc[1]} for loc in locations]
  return jsonify(locations_list)


@app.route('/delete_location/<string:name>', methods=['DELETE'])
def delete_location(name):
  cur = mysql.connection.cursor()
  cur.execute('''DELETE FROM locations WHERE name = %s''', (name,))
  mysql.connection.commit()
  cur.close()

  return jsonify({'message': f'Location with name "{name}" deleted successfully'}), 200

if __name__ == '__main__':
  app.run(debug=True)