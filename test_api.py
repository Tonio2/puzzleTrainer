import requests

BASE_URL = "http://localhost:5000/api/v1/puzzles"  # Replace with your actual base URL
AUTH_URL = "http://localhost:5000/api/v1/auth"   # Authentication endpoint

# Test Data
TEST_USER = {"email": "test@test.com", "password": "#Test1234"}
TEST_PUZZLE = {
    "theme": "Chess Strategy",
    "details": "Mate in two moves.",
    "setup": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "moves": "1. e4 e5 2. Qh5+ Ke7",
}
HEADERS = {}

# Register
# requests.post(f"{AUTH_URL}/register", json=TEST_USER)

# Login and get token
response = requests.post(f"{AUTH_URL}/login", json=TEST_USER)
token = response.json().get("accessToken")
HEADERS = {"Authorization": f"Bearer {token}"}

# Create puzzle
response = requests.post(BASE_URL, json=TEST_PUZZLE, headers=HEADERS)
assert response.status_code == 201
json_data = response.json()
assert json_data["theme"] == TEST_PUZZLE["theme"]
assert "_id" in json_data
assert json_data["is_public"] == False

puzzle_id = json_data.get("_id")



# Fetch one puzzle
response = requests.get(f"{BASE_URL}/{puzzle_id}", headers=HEADERS)
assert response.status_code == 200
json_data = response.json()
assert json_data["_id"] == puzzle_id

# Set puzzle public
response = requests.patch(f"{BASE_URL}/toggle_public/{puzzle_id}", headers=HEADERS)
assert response.status_code == 200
response = requests.get(f"{BASE_URL}/{puzzle_id}", headers=HEADERS)
json_data = response.json()
assert json_data["is_public"] == True

# Fetch my puzzles
response = requests.get(f"{BASE_URL}/mine", headers=HEADERS)
assert response.status_code == 200
json_data = response.json()
assert len(json_data) > 0
assert any(puzzle["_id"] == puzzle_id for puzzle in json_data)


# Fetch public puzzles
response = requests.get(f"{BASE_URL}/public", headers=HEADERS)
assert response.status_code == 200
json_data = response.json()
assert len(json_data) > 0
assert any(puzzle["_id"] == puzzle_id for puzzle in json_data)

# Edit puzzle
TEST_PUZZLE["theme"] = "Updated Chess Strategy"
response = requests.patch(f"{BASE_URL}/{puzzle_id}", json=TEST_PUZZLE, headers=HEADERS)
assert response.status_code == 200
json_data = response.json()
assert json_data["theme"] == TEST_PUZZLE["theme"]

# Review puzzle
response = requests.put(f"{BASE_URL}/review/{puzzle_id}", json={"success": "true"}, headers=HEADERS)
assert response.status_code == 200
response = requests.get(f"{BASE_URL}/{puzzle_id}", headers=HEADERS)
json_data = response.json()
assert json_data["interval_days"] == 1

# Delete puzzle
response = requests.delete(f"{BASE_URL}/{puzzle_id}", headers=HEADERS)
assert response.status_code == 200
# Confirm deletion
response = requests.get(f"{BASE_URL}/{puzzle_id}", headers=HEADERS)
assert response.status_code == 404

print("Everything is allright man!")