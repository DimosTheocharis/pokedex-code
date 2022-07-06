import requests, json, os

totalPokemons = 898
url = f"https://pokeapi.co/api/v2/pokemon?limit={totalPokemons}"
data = requests.get(url)

pokemonNames = [pokemon["name"] for pokemon in data.json()["results"]]
pokemonTypes = {}


for pokemon in pokemonNames:
    try:
        data = requests.get(f"https://pokeapi.co/api/v2/pokemon/{pokemon}").json()
        types = [item["type"]["name"] for item in data["types"]]
        pokemonTypes[pokemon] = types 
    except:
        print("Failed at the pokemon: ", pokemon)


#dump the created dictionary, pokemonTypes to the PokemonTypes.json file
os.chdir("./pokedex/src")
with open("PokemonTypes.json", "w") as f:
    json.dump(pokemonTypes, f, indent=4)

