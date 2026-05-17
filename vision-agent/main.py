import logging

from env import load_env
from teacher import BASE_INSTRUCTIONS, build_greeting, build_instructions
from vision_agents.core import Agent, AgentLauncher, Runner, User
from vision_agents.core.instructions import Instructions
from vision_agents.plugins import gemini, getstream

load_env()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

AGENT_USER_ID = "ai-language-teacher"
AGENT_DISPLAY_NAME = "Language Teacher"


async def create_agent(**kwargs) -> Agent:
    call_id = kwargs.get("call_id")

    if not call_id:
        logger.info("Warmup: Creating agent with default instructions")
        return Agent(
            edge=getstream.Edge(),
            agent_user=User(name=AGENT_DISPLAY_NAME, id=AGENT_USER_ID),
            instructions=BASE_INSTRUCTIONS,
            llm=gemini.Realtime(),
        )

    return Agent(
        edge=getstream.Edge(),
        agent_user=User(name=AGENT_DISPLAY_NAME, id=AGENT_USER_ID),
        instructions=BASE_INSTRUCTIONS,
        llm=gemini.Realtime(),
    )


def custom_value(custom: dict, camel_key: str, snake_key: str):
    return custom.get(camel_key) or custom.get(snake_key)


async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs) -> None:
    # Fetch lesson metadata packed into Stream call custom data by the Expo API.
    response = await agent.edge.client.call(call_type=call_type, id=call_id).get()
    custom = getattr(response.call, "custom", {})
    ai_teacher_prompt = custom.get("aiTeacherPrompt") or custom.get("ai_teacher_prompt") or {}
    teacher_instructions = custom_value(
        custom,
        "teacherInstructions",
        "teacher_instructions",
    ) or ai_teacher_prompt.get("instructions")
    teacher_context = custom_value(
        custom,
        "teacherContext",
        "teacher_context",
    ) or ai_teacher_prompt.get("context")

    agent.instructions = Instructions(
        input_text=build_instructions(
            language_name=custom_value(custom, "languageName", "language_name"),
            lesson_title=custom_value(custom, "lessonTitle", "lesson_title"),
            lesson_goal=custom_value(custom, "lessonGoal", "lesson_goal"),
            vocabulary=custom.get("vocabulary"),
            phrases=custom.get("phrases"),
            teacher_instructions=teacher_instructions,
            teacher_context=teacher_context,
        )
    )

    call = await agent.create_call(call_type, call_id)
    logger.info("Joining call %s (%s)", call_id, call_type)

    async with agent.join(call):
        await agent.simple_response(
            build_greeting(
                language_name=custom_value(custom, "languageName", "language_name"),
                lesson_title=custom_value(custom, "lessonTitle", "lesson_title"),
            )
        )
        await agent.finish()


if __name__ == "__main__":
    Runner(
        AgentLauncher(
            create_agent=create_agent,
            join_call=join_call,
            max_sessions_per_call=1,
        )
    ).cli()
