import logging

from env import load_env
from teacher import BASE_INSTRUCTIONS, build_greeting, build_instructions
from vision_agents.core import Agent, AgentLauncher, Runner, User
from vision_agents.plugins import gemini, getstream

load_env()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

AGENT_USER_ID = "ai-language-teacher"
AGENT_DISPLAY_NAME = "Language Teacher"


async def create_agent(**kwargs) -> Agent:
    call_id = kwargs.get("call_id")
    call_type = kwargs.get("call_type", "default")

    if not call_id:
        logger.info("Warmup: Creating agent with default instructions")
        return Agent(
            edge=getstream.Edge(),
            agent_user=User(name=AGENT_DISPLAY_NAME, id=AGENT_USER_ID),
            instructions=BASE_INSTRUCTIONS,
            llm=gemini.Realtime(),
        )

    edge = getstream.Edge()
    
    # Fetch call data to get custom metadata
    logger.info("Fetching call data for %s:%s", call_type, call_id)
    response = await edge.client.call(call_type=call_type, id=call_id).get()
    
    # Structure in getstream-io is response.call.custom
    custom = getattr(response.call, "custom", {})

    return Agent(
        edge=edge,
        agent_user=User(name=AGENT_DISPLAY_NAME, id=AGENT_USER_ID),
        instructions=build_instructions(
            language_name=custom.get("languageName"),
            lesson_title=custom.get("lessonTitle"),
            lesson_goal=custom.get("lessonGoal"),
            vocabulary=custom.get("vocabulary"),
            phrases=custom.get("phrases"),
            teacher_instructions=custom.get("teacherInstructions"),
            teacher_context=custom.get("teacherContext"),
        ),
        llm=gemini.Realtime(),
    )


async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs) -> None:
    # Fetch call data again for greeting if needed
    response = await agent.edge.client.call(call_type=call_type, id=call_id).get()
    custom = getattr(response.call, "custom", {})

    call = await agent.create_call(call_type, call_id)
    logger.info("Joining call %s (%s)", call_id, call_type)

    async with agent.join(call):
        await agent.simple_response(
            build_greeting(
                language_name=custom.get("languageName"), 
                lesson_title=custom.get("lessonTitle")
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
