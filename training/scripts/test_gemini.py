from google import genai

client = genai.Client(api_key="AIzaSyCmmlYqmP5K_WlXChs2RD4z1IDH5g7vN4Q")

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Halo! Apa kabar?"
)

print(response.text)
