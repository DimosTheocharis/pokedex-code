import requests, json, os
from bs4 import BeautifulSoup

################################################################### HELPING FUNCTIONS ##################################################

def removeSpaces(s): 
    #this function will get a string, remove the spaces at the front and the back part of the string, and return the result
    
    ##front part 
    found = False
    i = 0
    while (not found and i < len(s)): #looping through all letters from the start of the string until we find a non-space letter or we reach the end of the string
        if (s[i] == "\n" or s[i] == " "):
            i += 1
        else:
            found = True
            firstLetterPosition = i
    #throw away all spaces from the start of the string to the first letter
    if (found):
        s = s[firstLetterPosition:]
    
    ##back part
    found = False
    i = -1
    while(not found and i >= -len(s)): #looping through all letters from the end of the string untill we find a letter
        if (s[i] == "\n" or s[i] == " "):
            i -= 1
        else:
            found = True
            lastLetterPosition = i

    #throuw away all spaces from last letter to the end of the string
    if (found):
        s = s[:len(s) + lastLetterPosition + 1]


    return s


def findPokemonName(text):
    #this function will get a text and return the pokemon name that it contains
    #text will be something like "     Zekrom        #023" 

    start = 0 #the index of the first letter of the pokemon name
    end = 0 #the index of the last letter of the pokemon name
    foundStart = False #whether or not it found the start of the pokemon name
    foundEnd = False #whether or not it found the end of the pokemon name
    i = 0

    while (not foundEnd and i < len(text)):
        if ((text[i] >= 'a' and text[i] <= 'z') or (text[i] >= 'A' and text[i] <= 'Z')):
            if not foundStart:
                foundStart = True
                start = i
        else:
            if foundStart:
                foundEnd = True
                end = i
        i += 1
        
    pokemonName = ''
    if foundEnd:
        pokemonName = text[start:end]
    return pokemonName

    

################################################################### DATA FETCHING ##################################################

#fetch an array containing pokemon data for all pokemons
totalPokemons = 898
data = requests.get(f"https://pokeapi.co/api/v2/pokemon?limit={totalPokemons}")

pokemonData = data.json()["results"] #the data array
#each item in the pokemonData has the following structure: {'name': pokemonName, 'url': pokemonUrl}

#a list will the names of all pokemons
pokemonNames = [pokemonData[i]["name"] for i in range(len(pokemonData))]



################################################################### FETCHING FUNCTIONS ##################################################

def getEntryTexts():
    #the dictionary containing all extry texts of all pokemon, that will be dumped in the PokemonsEntryTexts.json file
    pokemonsEntryText = {}
    for pokemon in pokemonNames:
        try:
            #making a get request. r will be the response object
            r = requests.get(f"https://www.pokemon.com/us/pokedex/{pokemon}")

            #the html code
            soup = BeautifulSoup(r.content, "html.parser")

            #each pokemon has 2 entry texts, which exist in the p elements of the html with the className 'version-x' and 'version-y'
            s1 = soup.find(class_="version-x").string
            s2 = soup.find(class_="version-y").string

            #Entry texts have unnecessary blank spaces at the start and the at the end of the text
            # so entryTextA, entryTextB is the entry texts without the blank spaces
            entryTextA = removeSpaces(s1)
            entryTextB = removeSpaces(s2)
            
            pokemonsEntryText[pokemon] = [entryTextA, entryTextB]
        except:
            print("an error occured at the pokemon", pokemon) #catch error

    #dump the created dictionary, pokemonsEntryText to the PokemonsEntryTexts.json file
    os.chdir("src")
    with open('PokemonsEntryTexts.json', 'w') as f:
        json.dump(pokemonsEntryText, f, indent=4)


def getEvolutions():
    ##the dictionary containing the evolution chain of all pokemon, that will be dumped in the PokemonsEvolutionChain.json file
    pokemonsEvolutionTree = {}
    #for pokemon in pokemonNames:
    for pokemon in pokemonNames:
        try:
            #making a get request. r will be the response object
            r = requests.get(f"https://www.pokemon.com/us/pokedex/{pokemon}")

            #the html code
            soup = BeautifulSoup(r.content, 'html.parser')

            #each pokemon has an evolution unordered list, containing all the forms this pokemon can evolve to, with the className 'evolution-profile'
            evolutionList = soup.find(class_="evolution-profile").findChildren(recursive=False)

            evolutionChain = [] #will be a list of lists, containing each pokemon's evolution tree
            #the normal evolution tree is [['pA'], ['pB'], ['pC']] but it's likely to see a step like ['pB1', 'pB2']
            for evolutionStep in evolutionList:
                #each evolutionStep has one or more h3 tag with className 'match' which have as text the name of the pokemon evolution
                containers = evolutionStep.find_all("h3", class_="match")
                evolution = []
                for container in containers:
                    text = container.get_text() #get the text of the pokemon
                    pokemonName = findPokemonName(text) #filter the name
                    evolution.append(pokemonName.lower()) #append the pokemonName to the evolution step
                evolutionChain.append(evolution) #append the step to the evolution chain
            
            pokemonsEvolutionTree[pokemon] = evolutionChain
        except:
            print("an error occured at the pokemon", pokemon) #catch error
    
    
    #dump the created dictionary, pokemonsEvolutionTree to the PokemonsEvolutionTree.json file
    os.chdir("src")
    with open('PokemonsEvolutionTree.json', 'w') as f:
        json.dump(pokemonsEvolutionTree, f, indent=4)
        

