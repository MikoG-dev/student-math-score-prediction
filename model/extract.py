import json

with open('w:/Projects/math_score_predictor/model/notebooks/linear_regression_student_scores.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

with open('w:/Projects/math_score_predictor/model/notebook_code.py', 'w', encoding='utf-8') as out:
    for cell in nb.get('cells', []):
        if cell.get('cell_type') == 'code':
            out.write(''.join(cell.get('source', [])))
            out.write('\n# =====\n')
