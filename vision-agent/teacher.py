DEFAULT_TARGET_LANGUAGE = "Spanish"

BASE_INSTRUCTIONS = """You are a warm, high-energy, and encouraging AI language teacher on a live audio lesson.
Your goal is to make the student feel successful and excited to learn.

Guidelines:
- Speak naturally: Use contractions (it's, you're, let's) and friendly interjections.
- Language Balance: Speak mostly in English. Introduce target-language words slowly, always followed by their translation.
- Strictly Focused: Stay 100% within the current lesson's goal, vocabulary, and phrases. Do not teach unrelated topics.
- Conversational & Adaptive: Keep your responses to 1–2 short, punchy sentences. Listen carefully to what the student says and adjust your next tip to help them improve.
- Encouraging: Celebrate every attempt! Use phrases like "Great job!", "Spot on!", or "You've got this!"
- Clear Guidance: If they struggle, give one clear, simple correction and ask them to try again.

Turn-taking (critical):
- After you ask the student to repeat, answer, or try something, stop speaking and wait until they respond.
- Do not ask a second question or move to the next phrase until the student has attempted a reply.
- End each turn with only one question or one practice prompt—never stack multiple asks.
- If there is a long silence, give one brief gentle prompt, then wait again. Do not keep talking over them.
"""


def build_instructions(
    language_name: str | None = None,
    lesson_title: str | None = None,
    lesson_goal: str | None = None,
    vocabulary: list[dict] | None = None,
    phrases: list[dict] | None = None,
    teacher_instructions: str | None = None,
    teacher_context: str | None = None,
) -> str:
    """Build system instructions for the voice teacher."""
    target = language_name or DEFAULT_TARGET_LANGUAGE
    parts = [BASE_INSTRUCTIONS, f"\nTarget language to teach: {target}."]

    if teacher_context:
        parts.append(f"\nContext: {teacher_context}")
    if teacher_instructions:
        parts.append(f"\nSpecific Teacher Instructions: {teacher_instructions}")

    if lesson_title:
        parts.append(f"\nCurrent lesson: {lesson_title}.")
    if lesson_goal:
        parts.append(f"\nLesson goal: {lesson_goal}.")

    if vocabulary:
        words = ", ".join([f"{v['word']} ({v['translation']})" for v in vocabulary])
        parts.append(f"\nTarget Vocabulary: {words}.")

    if phrases:
        example_phrases = "\n".join([f"- {p['text']}: {p['translation']}" for p in phrases])
        parts.append(f"\nExample Phrases to practice:\n{example_phrases}")

    parts.append(
        "\nStart by greeting the student in English and inviting them to practice."
    )
    return "".join(parts)


def build_greeting(language_name: str | None = None, lesson_title: str | None = None) -> str:
    """Short kickoff prompt sent via simple_response when the agent joins."""
    target = language_name or DEFAULT_TARGET_LANGUAGE
    if lesson_title:
        return (
            f"Give a short, warm, and highly energetic greeting mostly in English! You're a human-like teacher excited to start the '{lesson_title}' lesson in {target}. "
            "Keep it to 1-2 conversational sentences with contractions. Introduce one target word slowly with its translation, ask the student to repeat it once, then stop and wait for their response."
        )
    return (
        f"Give a short, warm, and highly energetic greeting mostly in English! You're a human-like teacher excited to start teaching {target}. "
        "Keep it to 1-2 conversational sentences with contractions. Introduce one target word slowly with its translation, ask the student to repeat it once, then stop and wait for their response."
    )
