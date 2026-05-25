"""
Пример использования LLMJudge из pydantic-evals.

LLMJudge — это оценщик, который использует LLM для проверки качества ответов.
Вы задаёте критерий (rubric), а LLM-судья решает: pass/fail и/или выставляет score.

Установка:
    pip install pydantic-evals pydantic-ai
"""

from pydantic_evals import Case, Dataset
from pydantic_evals.evaluators import LLMJudge


# ---------------------------------------------------------------------------
# 1. Task — функция, которую мы хотим оценить.
#    Принимает inputs из Case, возвращает строку (output).
#    В реальном проекте здесь будет вызов вашей LLM / RAG-пайплайна / агента.
# -----------------------------------------]----------------------------------
def support_bot(question: str) -> str:
    answers = {
        "Как сбросить пароль?": "Перейдите в настройки аккаунта, нажмите 'Забыли пароль' и следуйте инструкциям на экране.",
        "Какие способы оплаты?": "Мы принимаем Visa, MasterCard и банковский перевод.",
        "Где мои данные?": "Понятия не имею, спросите кого-нибудь другого.",  # плохой ответ — для демонстрации fail
    }
    return answers.get(question, "Извините, я не знаю ответа.")


# ---------------------------------------------------------------------------
# 2. Cases — тестовые кейсы.
#    - inputs: входные данные для task
#    - expected_output (опционально): эталонный ответ, можно передать судье
#    - name: имя кейса для отчёта
# ---------------------------------------------------------------------------
cases = [
    Case(
        name="password_reset",
        inputs="Как сбросить пароль?",
        expected_output="Инструкция по сбросу пароля через настройки аккаунта",
    ),
    Case(
        name="payment_methods",
        inputs="Какие способы оплаты?",
        expected_output="Перечень принимаемых способов оплаты",
    ),
    Case(
        name="bad_answer",
        inputs="Где мои данные?",
        expected_output="Вежливый и полезный ответ о хранении данных",
    ),
]


# ---------------------------------------------------------------------------
# 3. Evaluators — LLM-судьи с разными критериями.
#
#    rubric        — текстовый критерий, по которому судья оценивает ответ
#    include_input — передать ли судье вопрос пользователя (по умолчанию False)
#    include_expected_output — передать ли эталонный ответ
#    model         — какую модель использовать как судью
#    assertion     — True = pass/fail (по умолчанию)
#    score         — если задан, судья возвращает числовую оценку 0.0–1.0
# ---------------------------------------------------------------------------
evaluators = [
    # Судья 1: проверяет вежливость и профессионализм (pass/fail)
    LLMJudge(
        rubric="The response is polite, professional, and appropriate for a customer support context.",
        include_input=True,
    ),
    # Судья 2: проверяет соответствие эталону (pass/fail)
    LLMJudge(
        rubric="The response semantically matches the expected output and addresses the user's question.",
        include_input=True,
        include_expected_output=True,
    ),
    # Судья 3: числовая оценка качества (score 0.0–1.0, без pass/fail)
    LLMJudge(
        rubric="Overall helpfulness and clarity of the response.",
        include_input=True,
        score={"evaluation_name": "quality_score", "include_reason": True},
        assertion=False,
    ),
]
 

# ---------------------------------------------------------------------------
# 4. Dataset — объединяет кейсы и оценщиков в один объект.
# ---------------------------------------------------------------------------
dataset = Dataset(
    name="support_bot_eval",
    cases=cases,
    evaluators=evaluators,
)


# ---------------------------------------------------------------------------
# 5. Запуск оценки и вывод отчёта.
#    evaluate_sync(task) прогоняет каждый case через task,
#    затем каждый evaluator оценивает пару (input, output).
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    report = dataset.evaluate_sync(support_bot)
    report.print()

    # Можно также получить результаты программно:
    # for case_result in report.cases:
    #     print(case_result.name, case_result.assertions, case_result.scores)
