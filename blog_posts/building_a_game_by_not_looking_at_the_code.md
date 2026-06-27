# Building a game by not looking at the code
**2026-06-27**

This weekend I am experimenting with using a team of AI agents to create a 2D game for me.

## Rules

- No manual coding, I can't even look at the code.
- Minimal interference from my end, I am letting the project manager agent make almost all decisions.
- When I am over the usage limit of my Claude subscription, I can manually tell Codex to solve certain tasks, but these instructions cannot be technical.


## Initial setup

### Claude cowork

- **Project manager agent:** Manages the other agents and reports to me now and then. Gets reports from all other agents. Runs on Opus.
- **Code agent:** Implements features and tests. Its code must pass all tests and build before it can report back to the project manager. Runs on Sonnet.
- **Tester agent:** Runs the code and takes screenshots of the game. Does not modify code unless a trivial fix is found. Runs on Haiku.
- **Critic agent:** Inspects and analyzes the screenshots and writes a review with the goal of roasting the game. Proposes no fixes. Runs on Sonnet.
- **Designer agent:** Reads the critique and turns it into change proposals. Does not implement anything. Runs on Haiku.
- **Fika Master:** In Sweden, all teams have a <a href="https://en.wikipedia.org/wiki/Coffee_in_Sweden#Fika" style="color: #1a60c8; text-decoration: underline;">fika</a> break now and then, I think it is fair that the agents should have that as well. The Fika Master agent keeps track of the current Claude usage session and how many tokens the team consumes. When usage is close to the limit, it calls all agents for a fika. When a new usage session starts, the Fika Master has scheduled the project manager agent to call all agents back to work.

### OpenAI Codex

Since my budget for this experiment is small, I frequently run into the Claude usage limit. In those cases I try playing the game and send Codex to fix obvious issues I find. My rule here, as previously mentioned, is that I can't give it technical instructions, only instructions like "The player can walk out of the game area, fix it."


### End note:
I am doing this purely to improve my AI workflow. In my daily work at CERN I run code on expensive, delicate hardware and I don't dare to let a team of agents run a full development loop on that quite yet. Not looking at the code is a strange experience, I normally know and understand every single line. I am looking forward to seeing the results of this little experiment!
