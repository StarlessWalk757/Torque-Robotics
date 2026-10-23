# AI usage disclosure

The Congressional App Challenge allows AI tools only if all AI use is disclosed, and AI must not make up the
entirety of the technical development. This file records how AI was used in Torque.

## Real-time assessment of CAD projects

I primarily used AI to enhance the interactive nature of the CAD projects, which helps with the real-time
assessment of the files uploaded by the user.

## Grading CAD files

I used AI to help me write the code that grades the CAD files users upload for any of the CAD projects. I used
AI here because the formulas needed to accurately grade the CAD files were extremely complex, but since CAD is a
fundamental part of engineering, implementing it was a vital part of my website. I researched how the vertices
of a CAD drawing can be found in the files, then worked with Claude AI to code the part of the application that
finds the specifications of the user's CAD file, such as its volume, shape, and dimensions, to check for
accuracy.

## Generating simulations

My app also uses AI to generate simulations based on the user's prompt. Since seeing the actual pieces and
components move in real time is an essential part of the learning curve, especially in robotics, the simulation
generator helps users better their understanding of a topic. To create the simulations, I use Anthropic's
Claude (`claude-sonnet-5-5`) model. I added specific hard boundaries on what simulations can be asked for, to prohibit any
inappropriate use of the generator and so that the model only creates simulations for the information covered on
my website and deeper applications of those concepts.
