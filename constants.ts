
import { Challenge } from './types';

export const LEVELS: Challenge[] = [
  // --- BEGINNER: THE BASICS (10 Levels) ---
  {
    id: 'b1',
    tier: 'Beginner',
    path: 'None',
    title: 'The First Command',
    description: 'Every journey begins with a single line. Use the `print()` function to output: "Hello Python"',
    points: 50,
    initialCode: '# Your code here\n',
    solutionTemplate: 'print("Hello Python")',
    hints: ['Wrap your text in double quotes ""', 'Functions end with parentheses ()'],
    concepts: ['Output', 'Strings']
  },
  {
    id: 'b2',
    tier: 'Beginner',
    path: 'None',
    title: 'Data Boxes',
    description: 'Variables store data. Create a variable named `player` and set it to "Alex". Then print it.',
    points: 50,
    initialCode: '# Create player variable\n\n# Print player\n',
    solutionTemplate: 'player = "Alex"\nprint(player)',
    hints: ['No quotes around the name of the variable itself!'],
    concepts: ['Variables']
  },
  {
    id: 'b3',
    tier: 'Beginner',
    path: 'None',
    title: 'Code Calculator',
    description: 'Python loves math. Create a variable `total` equal to `100 + 50`. Print it.',
    points: 50,
    initialCode: 'total = \n# Print it\n',
    solutionTemplate: 'total = 100 + 50\nprint(total)',
    hints: ['Numbers don\'t need quotes!'],
    concepts: ['Integers', 'Arithmetic']
  },
  {
    id: 'b4',
    tier: 'Beginner',
    path: 'None',
    title: 'Smart Strings',
    description: 'Use an f-string to combine text and variables. Given `level = 5`, print: "Current Level: 5"',
    points: 75,
    initialCode: 'level = 5\n# Print using f-string\n',
    solutionTemplate: 'level = 5\nprint(f"Current Level: {level}")',
    hints: ['Put an f before the first quote.', 'Put the variable inside {curly braces}.'],
    concepts: ['f-strings', 'Strings']
  },
  {
    id: 'b5',
    tier: 'Beginner',
    path: 'None',
    title: 'Boolean Check',
    description: 'Booleans are simple: True or False. Set `is_ready` to `True`. Print it.',
    points: 50,
    initialCode: '# Set is_ready\n',
    solutionTemplate: 'is_ready = True\nprint(is_ready)',
    hints: ['True must start with a capital T.'],
    concepts: ['Booleans']
  },
  {
    id: 'b6',
    tier: 'Beginner',
    path: 'None',
    title: 'The "If" Gate',
    description: 'Use `if` to make decisions. If `score` is greater than 10, print "Win".',
    points: 100,
    initialCode: 'score = 15\n# Check if score > 10\n',
    solutionTemplate: 'score = 15\nif score > 10:\n    print("Win")',
    hints: ['End the if line with a colon :', 'Indent the print line with spaces.'],
    concepts: ['Conditionals']
  },
  {
    id: 'b7',
    tier: 'Beginner',
    path: 'None',
    title: 'Two Paths',
    description: 'Use `if-else`. If `health` is above 0, print "Alive". Otherwise, print "Game Over".',
    points: 100,
    initialCode: 'health = 0\n# Use if-else logic\n',
    solutionTemplate: 'health = 0\nif health > 0:\n    print("Alive")\nelse:\n    print("Game Over")',
    hints: ['else: must be at the same level as if.'],
    concepts: ['Conditionals']
  },
  {
    id: 'b8',
    tier: 'Beginner',
    path: 'None',
    title: 'Inventory List',
    description: 'Create a list called `items` with "Sword" and "Shield". Print the list.',
    points: 75,
    initialCode: '# Create list\n',
    solutionTemplate: 'items = ["Sword", "Shield"]\nprint(items)',
    hints: ['Use square brackets [ ]'],
    concepts: ['Lists']
  },
  {
    id: 'b9',
    tier: 'Beginner',
    path: 'None',
    title: 'Item Access',
    description: 'Lists start at index 0. Given `items = ["A", "B", "C"]`, print the first item (A).',
    points: 75,
    initialCode: 'items = ["A", "B", "C"]\n# Print first item\n',
    solutionTemplate: 'items = ["A", "B", "C"]\nprint(items[0])',
    hints: ['Access items using [0], [1], etc.'],
    concepts: ['Lists', 'Indexing']
  },
  {
    id: 'b10',
    tier: 'Beginner',
    path: 'None',
    title: 'Update Data',
    description: 'Change the first item of `items` to "Potion". Print the list.',
    points: 100,
    initialCode: 'items = ["Empty", "Shield"]\n# Update item at index 0\n',
    solutionTemplate: 'items = ["Empty", "Shield"]\nitems[0] = "Potion"\nprint(items)',
    hints: ['items[0] = "New Value"'],
    concepts: ['Lists', 'Mutation']
  },

  // --- INTERMEDIATE: LOGIC & FLOW (8 Levels) ---
  {
    id: 'i1',
    tier: 'Intermediate',
    path: 'None',
    title: 'The Loop',
    description: 'Use a `for` loop to print every name in the list `["Bo", "Cy", "Jo"]`.',
    points: 150,
    initialCode: 'names = ["Bo", "Cy", "Jo"]\n# Loop here\n',
    solutionTemplate: 'names = ["Bo", "Cy", "Jo"]\nfor name in names:\n    print(name)',
    hints: ['for x in list:'],
    concepts: ['Loops']
  },
  {
    id: 'i2',
    tier: 'Intermediate',
    path: 'None',
    title: 'Range Loop',
    description: 'Print "Looping" exactly 3 times using `range(3)`.',
    points: 150,
    initialCode: '# Loop 3 times\n',
    solutionTemplate: 'for i in range(3):\n    print("Looping")',
    hints: ['range(3) gives indices 0, 1, 2.'],
    concepts: ['Loops', 'Range']
  },
  {
    id: 'i3',
    tier: 'Intermediate',
    path: 'None',
    title: 'Mini Machine',
    description: 'Define a function `greet()` that prints "Hello!". Call it.',
    points: 200,
    initialCode: '# Define greet\n\n# Call it\n',
    solutionTemplate: 'def greet():\n    print("Hello!")\n\ngreet()',
    hints: ['Functions start with def.'],
    concepts: ['Functions']
  },
  {
    id: 'i4',
    tier: 'Intermediate',
    path: 'None',
    title: 'Input Power',
    description: 'Define `square(x)` that returns `x * x`. Print the result of `square(4)`.',
    points: 250,
    initialCode: '# Define square\n\n# Print square(4)\n',
    solutionTemplate: 'def square(x):\n    return x * x\n\nprint(square(4))',
    hints: ['Use return to send data back.'],
    concepts: ['Functions', 'Return']
  },
  {
    id: 'i5',
    tier: 'Intermediate',
    path: 'None',
    title: 'Data Map',
    description: 'Create a dictionary `hero` with "hp": 10. Print the "hp" value.',
    points: 150,
    initialCode: '# Create dictionary\n',
    solutionTemplate: 'hero = {"hp": 10}\nprint(hero["hp"])',
    hints: ['Use curly braces { } and colons :'],
    concepts: ['Dictionaries']
  },
  {
    id: 'i6',
    tier: 'Intermediate',
    path: 'None',
    title: 'Adding Items',
    description: 'Add "mana": 5 to the `hero` dictionary. Print it.',
    points: 150,
    initialCode: 'hero = {"hp": 10}\n# Add mana here\n',
    solutionTemplate: 'hero = {"hp": 10}\nhero["mana"] = 5\nprint(hero)',
    hints: ['dict["new_key"] = value'],
    concepts: ['Dictionaries']
  },
  {
    id: 'i7',
    tier: 'Intermediate',
    path: 'None',
    title: 'Quick Filter',
    description: 'Use a list comprehension to create `evens` from `[1,2,3,4,5,6]` with only even numbers.',
    points: 300,
    initialCode: 'nums = [1,2,3,4,5,6]\n# Filter evens\n',
    solutionTemplate: 'nums = [1,2,3,4,5,6]\nevens = [x for x in nums if x % 2 == 0]\nprint(evens)',
    hints: ['x % 2 == 0 checks if a number is even.'],
    concepts: ['List Comprehensions']
  },
  {
    id: 'i8',
    tier: 'Intermediate',
    path: 'None',
    title: 'Safe Division',
    description: 'Use `try-except` to print "Error" if `10 / 0` fails.',
    points: 200,
    initialCode: '# Use try-except\n',
    solutionTemplate: 'try:\n    print(10 / 0)\nexcept:\n    print("Error")',
    hints: ['Wrap risky code in try block.'],
    concepts: ['Exception Handling']
  },

  // --- ADVANCED: PRO CONCEPTS (5 Levels) ---
  {
    id: 'a1',
    tier: 'Advanced',
    path: 'None',
    title: 'Blueprint Design',
    description: 'Define a class `Player` with an `__init__` method that sets `self.name`. Create an instance.',
    points: 400,
    initialCode: '# Define Class\n',
    solutionTemplate: 'class Player:\n    def __init__(self, name):\n        self.name = name\n\np1 = Player("Alex")\nprint(p1.name)',
    hints: ['Classes use the class keyword.'],
    concepts: ['OOP', 'Classes']
  },
  {
    id: 'a2',
    tier: 'Advanced',
    path: 'None',
    title: 'Modern Hints',
    description: 'Define a function `add(a: int, b: int) -> int` that returns `a + b`.',
    points: 350,
    initialCode: '# Use type hints\n',
    solutionTemplate: 'def add(a: int, b: int) -> int:\n    return a + b',
    hints: ['Type hints help humans and tools read code.'],
    concepts: ['Type Hinting']
  },
  {
    id: 'a3',
    tier: 'Advanced',
    path: 'None',
    title: 'The Match Case',
    description: 'Use Python 3.10 `match` to set `action` to "Go" if `cmd` is "up".',
    points: 300,
    initialCode: 'cmd = "up"\n# Use match-case\n',
    solutionTemplate: 'cmd = "up"\nmatch cmd:\n    case "up":\n        action = "Go"',
    hints: ['match variable: case value:'],
    concepts: ['Structural Pattern Matching']
  },
  {
    id: 'a4',
    tier: 'Advanced',
    path: 'None',
    title: 'Async Task',
    description: 'Define an `async def fetch()` function that returns "Done".',
    points: 500,
    initialCode: '# Define async function\n',
    solutionTemplate: 'async def fetch():\n    return "Done"',
    hints: ['Async functions allow concurrent code execution.'],
    concepts: ['Asyncio']
  },
  {
    id: 'a5',
    tier: 'Advanced',
    path: 'None',
    title: 'Data Class',
    description: 'Create a `@dataclass` called `Point` with `x: int` and `y: int`.',
    points: 450,
    initialCode: 'from dataclasses import dataclass\n# Define dataclass\n',
    solutionTemplate: 'from dataclasses import dataclass\n@dataclass\nclass Point:\n    x: int\n    y: int',
    hints: ['Dataclasses automate standard class methods.'],
    concepts: ['Dataclasses']
  }
];

export const RANK_THRESHOLDS = [
  { rank: 'Curious Beginner', minXp: 0 },
  { rank: 'Aspiring Coder', minXp: 250 },
  { rank: 'Logic Explorer', minXp: 750 },
  { rank: 'Python Friend', minXp: 1500 },
  { rank: 'Code Architect', minXp: 3000 },
  { rank: 'Syntax Sage', minXp: 5000 }
];
