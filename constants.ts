
import { Challenge } from './types';

export const LEVELS: Challenge[] = [
  // --- BEGINNER: FOUNDATIONS (Already polished) ---
  {
    id: 'b1',
    tier: 'Beginner',
    path: 'None',
    title: 'The First Command',
    description: 'Use the `print()` function to output: "Hello World"',
    points: 50,
    initialCode: '',
    solutionTemplate: 'print("Hello World")',
    hints: ['Check your quotes and parentheses!'],
    concepts: ['Output'],
    localFeedback: {
      success: { 
        msg: "Perfect Start!", 
        explanation: "The print function tells Python to show data on the screen." 
      },
      hint: "Type: print(\"Hello World\") exactly.",
      pitfalls: [
        { pattern: /print\(Hello World\)/i, guidance: "You're missing quotes!", action: "Wrap Hello World in double quotes: \"Hello World\"" },
        { pattern: /Print/ , guidance: "Python is case-sensitive.", action: "Use lowercase 'print' instead of 'Print'." },
        { pattern: /"Hello World"/ , guidance: "You forgot the function call.", action: "Wrap the text inside print(...) " }
      ]
    }
  },
  {
    id: 'b2',
    tier: 'Beginner',
    path: 'None',
    title: 'The Box (Variables)',
    description: 'Create a variable `name` and set it to "Python".',
    points: 50,
    initialCode: '',
    solutionTemplate: 'name = "Python"',
    hints: ['Variable name first, then =, then value.'],
    concepts: ['Variables'],
    localFeedback: {
      success: { 
        msg: "Labeled!", 
        explanation: "You've successfully stored a string in a memory slot named 'name'." 
      },
      hint: "name = \"Python\"",
      pitfalls: [
        { pattern: /"name" =/ , guidance: "Don't put quotes around variable names.", action: "Change \"name\" to just name." },
        { pattern: /name="Python"/ , guidance: "Your syntax is mostly correct, but keep it clean!", action: "Add spaces around the = for better readability: name = \"Python\"" },
        { pattern: /name ==/ , guidance: "Use a single = for assignment.", action: "Change == to =" }
      ]
    }
  },
  {
    id: 'b6',
    tier: 'Beginner',
    path: 'None',
    title: 'The If Gate',
    description: 'If `x` is 5, print "Bingo".',
    points: 100,
    initialCode: 'x = 5\n',
    solutionTemplate: 'x = 5\nif x == 5:\n    print("Bingo")',
    hints: ['Use == for comparison and don\'t forget the colon!'],
    concepts: ['Conditionals'],
    localFeedback: {
      success: { msg: "Decision Made!", explanation: "Conditionals allow your program to branch based on data." },
      hint: "if x == 5:\n    print(\"Bingo\")",
      pitfalls: [
        { pattern: /if x = 5/, guidance: "Use == to compare values.", action: "Change = to == in your if statement." },
        { pattern: /if x == 5\s+print/, guidance: "Missing colon.", action: "Add a colon : after the 5." },
        { pattern: /if x == 5:\nprint/, guidance: "Indentation error.", action: "Add 4 spaces before the print command." }
      ]
    }
  },

  // --- INTERMEDIATE: LOGIC ENGINE ---
  {
    id: 'i1',
    tier: 'Intermediate',
    path: 'None',
    title: 'The For Loop',
    description: 'Loop through `nums = [1, 2, 3]` and print each number.',
    points: 150,
    initialCode: 'nums = [1, 2, 3]\n',
    solutionTemplate: 'nums = [1, 2, 3]\nfor n in nums:\n    print(n)',
    hints: ['for variable in list:'],
    concepts: ['Loops'],
    localFeedback: {
      success: { msg: "Iterated!", explanation: "For loops let you repeat actions for every item in a collection." },
      hint: "for n in nums:\n    print(n)",
      pitfalls: [
        { pattern: /for n in nums\n/, guidance: "Missing colon in loop.", action: "Add a colon : after 'nums'." },
        { pattern: /for nums in n/, guidance: "Variable order swapped.", action: "Use 'for n in nums:' (element first, then list)." },
        { pattern: /for n in nums:\nprint/, guidance: "Indentation missing.", action: "Indent the print(n) line with 4 spaces." }
      ]
    }
  },
  {
    id: 'i2',
    tier: 'Intermediate',
    path: 'None',
    title: 'Defining Functions',
    description: 'Define a function `greet()` that prints "Hi".',
    points: 200,
    initialCode: '',
    solutionTemplate: 'def greet():\n    print("Hi")',
    hints: ['Use def function_name():'],
    concepts: ['Functions'],
    localFeedback: {
      success: { msg: "Reusable Code!", explanation: "Functions are blocks of code you can name and run whenever you want." },
      hint: "def greet():\n    print(\"Hi\")",
      pitfalls: [
        { pattern: /function greet/, guidance: "Python uses 'def' for functions.", action: "Replace 'function' with 'def'." },
        { pattern: /def greet\s*\n/, guidance: "Missing parentheses or colon.", action: "Add (): after 'greet'." },
        { pattern: /def greet\(\):\nprint/, guidance: "Indentation error.", action: "Indent the print line inside the function." }
      ]
    }
  },
  {
    id: 'i3',
    tier: 'Intermediate',
    path: 'None',
    title: 'Mapping Data',
    description: 'Create a dictionary `hero` with "hp" set to 10.',
    points: 150,
    initialCode: '',
    solutionTemplate: 'hero = {"hp": 10}',
    hints: ['Dictionaries use curly braces {}.'],
    concepts: ['Dictionaries'],
    localFeedback: {
      success: { msg: "Structured!", explanation: "Dictionaries store data as Key:Value pairs, like a real dictionary." },
      hint: "hero = {\"hp\": 10}",
      pitfalls: [
        { pattern: /hero = \["hp", 10\]/, guidance: "That's a list, not a dictionary.", action: "Use curly braces {} and a colon : between hp and 10." },
        { pattern: /hero = {hp: 10}/, guidance: "Keys are usually strings.", action: "Put quotes around \"hp\"." }
      ]
    }
  },

  // --- ADVANCED: MASTER ARCHITECT ---
  {
    id: 'a1',
    tier: 'Advanced',
    path: 'None',
    title: 'The Blueprint (OOP)',
    description: 'Create a class `Robot` with an empty body (use `pass`).',
    points: 300,
    initialCode: '',
    solutionTemplate: 'class Robot:\n    pass',
    hints: ['class Name:'],
    concepts: ['OOP', 'Classes'],
    localFeedback: {
      success: { msg: "Architect Found!", explanation: "Classes are blueprints for creating objects with data and behavior." },
      hint: "class Robot:\n    pass",
      pitfalls: [
        { pattern: /def Robot/, guidance: "Use 'class' to define a type.", action: "Replace 'def' with 'class'." },
        { pattern: /class Robot\(\)/, guidance: "Empty parentheses aren't needed here.", action: "Just use 'class Robot:'." }
      ]
    }
  },
  {
    id: 'a2',
    tier: 'Advanced',
    path: 'None',
    title: 'Match-Case logic',
    description: 'Use `match status:` and `case "idle":` to print "Sleep".',
    points: 250,
    initialCode: 'status = "idle"\n',
    solutionTemplate: 'status = "idle"\nmatch status:\n    case "idle":\n        print("Sleep")',
    hints: ['match variable:', '    case value:'],
    concepts: ['Pattern Matching'],
    localFeedback: {
      success: { msg: "Pattern Matched!", explanation: "Structural Pattern Matching (Python 3.10+) is a cleaner way to handle many conditions." },
      hint: "match status:\n    case \"idle\":\n        print(\"Sleep\")",
      pitfalls: [
        { pattern: /switch status/, guidance: "Python uses 'match', not 'switch'.", action: "Change 'switch' to 'match'." },
        { pattern: /case "idle" print/, guidance: "Missing colon after case.", action: "Add a colon : after \"idle\"." }
      ]
    }
  }
];

export const RANK_THRESHOLDS = [
  { rank: 'Curious Beginner', minXp: 0 },
  { rank: 'Aspiring Coder', minXp: 200 },
  { rank: 'Logic Explorer', minXp: 600 },
  { rank: 'Python Friend', minXp: 1200 },
  { rank: 'Code Architect', minXp: 2500 },
  { rank: 'Syntax Sage', minXp: 4000 }
];
