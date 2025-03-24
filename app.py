# 'from' and 'import' are used to include modules/functions from other files
from flask import Flask, render_template, request, jsonify
# 'as' creates an alias for imported modules
import math as math_lib  
from time import sleep
from contextlib import contextmanager

app = Flask(__name__)

# 'global' declares a variable that can be accessed/modified from any scope
global_counter = 0

# 'with' is used for context management (resource handling)
# 'yield' temporarily returns control and later resumes from same point
@contextmanager
def operation_timer():
    try:  # 'try' starts a block of code that might raise exceptions
        yield
    # 'finally' executes whether an exception occurred or not
    finally:  
        print("Operation completed")

# 'class' defines a blueprint for creating objects
class Calculator:
    # 'def' defines a function/method
    def __init__(self):
        # 'None' represents null/absence of value
        self.result = None  
        self.history = []
        # 'is' tests if two objects are the same object in memory
        self.is_active = True  

    def validate_numbers(self, *args):
        # 'and', 'or', 'not' are logical operators
        # 'True', 'False' are boolean values
        return all(isinstance(x, (int, float)) and not isinstance(x, bool) for x in args)

    def add(self, x, y):
        # 'assert' verifies a condition, raises AssertionError if False
        assert self.is_active is True, "Calculator is inactive"  
        return x + y if self.validate_numbers(x, y) else None

    def divide(self, x, y):
        # 'if' starts a conditional block
        if y == 0:  
            # 'raise' triggers an exception
            raise ValueError("Cannot divide by zero")  
        return x / y

    def process_numbers(self, numbers):
        # 'for' iterates over a sequence
        # 'continue' skips rest of current loop iteration
        # 'break' exits the loop
        # 'pass' does nothing (placeholder)
        result = 0
        for num in numbers:
            if num < 0:
                continue
            elif num > 100:  # 'elif' is else if
                break
            else:
                pass
            result += num
        return result

    def generate_sequence(self, start, end):
        # 'while' loops while condition is True
        while start < end:
            yield start
            start += 1

    def complex_operation(self):
        # 'nonlocal' declares variable in nearest enclosing scope
        outer_value = 10
        def inner_function():
            nonlocal outer_value
            outer_value += 5
            return outer_value
        return inner_function()

    def clear_history(self):
        # 'del' removes/deletes objects
        del self.history[:]  

# 'lambda' creates small anonymous functions
format_result = lambda x: f"Result: {x}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        global global_counter
        global_counter += 1
        
        data = request.get_json()
        operation = data.get('operation')
        x = float(data.get('x', 0))
        y = float(data.get('y', 0))
        
        calc = Calculator()
        result = None

        with operation_timer():
            # 'in' tests if value is in sequence
            if operation in ('add', 'subtract', 'multiply', 'divide'):
                if operation == 'add':
                    result = calc.add(x, y)
                elif operation == 'subtract':
                    result = x - y
                elif operation == 'multiply':
                    result = x * y
                elif operation == 'divide':
                    result = calc.divide(x, y)

        calc.history.append(format_result(result))
        
        return jsonify({
            'result': result,
            'global_counter': global_counter
        })

    # 'except' handles exceptions
    except (ValueError, AssertionError) as e:
        return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)