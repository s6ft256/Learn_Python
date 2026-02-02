
import { Challenge } from './types';

export const LEVELS: Challenge[] = [
  // BEGINNER FOUNDATION
  {
    id: 'b1',
    tier: 'Beginner',
    path: 'None',
    title: 'Hello Python',
    description: 'The first step of every coder. Use the `print()` function to show the text "Hello Python" on the screen.',
    points: 50,
    initialCode: '# Use print() here\n',
    solutionTemplate: 'print("Hello Python")',
    hints: ['Wrap your text in double quotes ""'],
    concepts: ['Output', 'Strings']
  },
  {
    id: 'b2',
    tier: 'Beginner',
    path: 'None',
    title: 'Storing Text',
    description: 'Variables are labels for data. Create a variable called `greeting` and set it to "Good Morning". Then print `greeting`.',
    points: 50,
    initialCode: '# Create the variable\n\n# Print it\n',
    solutionTemplate: 'greeting = "Good Morning"\nprint(greeting)',
    hints: ['No quotes around variable names!', 'greeting = "some text"'],
    concepts: ['Variables', 'Strings']
  },
  {
    id: 'b3',
    tier: 'Beginner',
    path: 'None',
    title: 'Numbers & Math',
    description: 'Python is a powerful calculator. Create a variable `total` that is the result of `15 + 25`. Print the `total`.',
    points: 50,
    initialCode: 'total = \n# Print total\n',
    solutionTemplate: 'total = 15 + 25\nprint(total)',
    hints: ['Numbers don\'t need quotes around them.'],
    concepts: ['Integers', 'Arithmetic']
  },
  {
    id: 'b4',
    tier: 'Beginner',
    path: 'None',
    title: 'Dynamic Text (f-strings)',
    description: 'You can put variables inside text using f-strings. Given `age = 20`, print: "I am 20 years old" using an f-string.',
    points: 75,
    initialCode: 'age = 20\n# Use f-string here\n',
    solutionTemplate: 'age = 20\nprint(f"I am {age} years old")',
    hints: ['Start the string with f before the quote.', 'Put the variable in curly braces {age}.'],
    concepts: ['f-strings', 'Strings']
  },
  {
    id: 'b5',
    tier: 'Beginner',
    path: 'None',
    title: 'True or False',
    description: 'Booleans are `True` or `False`. Set `is_coding` to `True` and `is_bored` to `False`. Print both.',
    points: 50,
    initialCode: '# Set variables\n\n# Print them\n',
    solutionTemplate: 'is_coding = True\nis_bored = False\nprint(is_coding)\nprint(is_bored)',
    hints: ['Python is case-sensitive: True, not true.'],
    concepts: ['Booleans']
  },
  {
    id: 'b6',
    tier: 'Beginner',
    path: 'None',
    title: 'Comparison Ops',
    description: 'Is 10 greater than 5? Set `result` to the result of `10 > 5` and print it.',
    points: 50,
    initialCode: '# Compare 10 and 5\n',
    solutionTemplate: 'result = 10 > 5\nprint(result)',
    hints: ['The > symbol checks if the left is larger.'],
    concepts: ['Comparison', 'Logic']
  },
  {
    id: 'b7',
    tier: 'Beginner',
    path: 'None',
    title: 'Simple If',
    description: 'Use an `if` statement to print "Success" only if `score` is greater than 50.',
    points: 100,
    initialCode: 'score = 75\n# If statement here\n',
    solutionTemplate: 'score = 75\nif score > 50:\n    print("Success")',
    hints: ['Don\'t forget the colon : at the end of the if line.', 'Indent the print line with 4 spaces.'],
    concepts: ['Conditionals']
  },
  {
    id: 'b8',
    tier: 'Beginner',
    path: 'None',
    title: 'The Else Branch',
    description: 'If `temp` is above 30, print "Hot". Otherwise, print "Cool".',
    points: 100,
    initialCode: 'temp = 25\n# If/Else here\n',
    solutionTemplate: 'temp = 25\nif temp > 30:\n    print("Hot")\nelse:\n    print("Cool")',
    hints: ['else: must be at the same indentation as if.'],
    concepts: ['Conditionals']
  },
  {
    id: 'b9',
    tier: 'Beginner',
    path: 'None',
    title: 'Multiple Choices',
    description: 'Use `elif` to check multiple conditions. If `grade` is 90+, print "A". If it\'s 80+, print "B". Otherwise print "C".',
    points: 150,
    initialCode: 'grade = 85\n# Use if, elif, else\n',
    solutionTemplate: 'grade = 85\nif grade >= 90:\n    print("A")\nelif grade >= 80:\n    print("B")\nelse:\n    print("C")',
    hints: ['elif stands for "else if".'],
    concepts: ['Conditionals', 'Logic']
  },
  {
    id: 'b10',
    tier: 'Beginner',
    path: 'None',
    title: 'Shopping List',
    description: 'Lists store many items. Create a list called `items` containing "Apple", "Banana", and "Cherry". Print the list.',
    points: 75,
    initialCode: '# Create list\n',
    solutionTemplate: 'items = ["Apple", "Banana", "Cherry"]\nprint(items)',
    hints: ['Use square brackets [ ] for lists.'],
    concepts: ['Lists']
  },
  // INTERMEDIATE STEPS
  {
    id: 'i1',
    tier: 'Intermediate',
    path: 'None',
    title: 'Repeat with Loops',
    description: 'Use a `for` loop to print every number in the list `[1, 2, 3]`.',
    points: 150,
    initialCode: 'numbers = [1, 2, 3]\n# Loop through numbers\n',
    solutionTemplate: 'numbers = [1, 2, 3]\nfor n in numbers:\n    print(n)',
    hints: ['for variable in list:'],
    concepts: ['Loops']
  },
  {
    id: 'i2',
    tier: 'Intermediate',
    path: 'None',
    title: 'Range Power',
    description: 'The `range()` function generates numbers. Print the numbers 0, 1, and 2 using `for i in range(3):`.',
    points: 150,
    initialCode: '# Use range(3)\n',
    solutionTemplate: 'for i in range(3):\n    print(i)',
    hints: ['range(3) gives 0, 1, 2.'],
    concepts: ['Loops', 'Functions']
  },
  {
    id: 'i3',
    tier: 'Intermediate',
    path: 'None',
    title: 'Defining Functions',
    description: 'Define a function `say_hi()` that prints "Hi!". Then call the function.',
    points: 200,
    initialCode: '# Define say_hi\n\n# Call it\n',
    solutionTemplate: 'def say_hi():\n    print("Hi!")\n\nsay_hi()',
    hints: ['Use def to start a function definition.'],
    concepts: ['Functions']
  },
  {
    id: 'i4',
    tier: 'Intermediate',
    path: 'None',
    title: 'Function Arguments',
    description: 'Make a function `greet(name)` that prints "Hello " + name. Call it with "Python".',
    points: 200,
    initialCode: '# Define greet with argument\n',
    solutionTemplate: 'def greet(name):\n    print(f"Hello {name}")\n\ngreet("Python")',
    hints: ['Pass the variable name into the parentheses.'],
    concepts: ['Functions', 'Arguments']
  },
  {
    id: 'i5',
    tier: 'Intermediate',
    path: 'None',
    title: 'Dictionary Basics',
    description: 'Dictionaries store key-value pairs. Create `user = {"id": 1, "name": "Alice"}` and print the "name".',
    points: 150,
    initialCode: '# Create dict\n',
    solutionTemplate: 'user = {"id": 1, "name": "Alice"}\nprint(user["name"])',
    hints: ['Use curly braces { } for dictionaries.'],
    concepts: ['Dictionaries']
  }
];

export const RANK_THRESHOLDS = [
  { rank: 'Curious Beginner', minXp: 0 },
  { rank: 'Aspiring Coder', minXp: 200 },
  { rank: 'Logic Explorer', minXp: 600 },
  { rank: 'Python Friend', minXp: 1200 },
  { rank: 'Code Architect', minXp: 2500 },
  { rank: 'Community Mentor', minXp: 4000 }
];
